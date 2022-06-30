import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Lightbox } from "ngx-lightbox";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { Page } from "../_models/page";
import { AuthenticationService } from "../_services/authentication.service";
import { CommonService } from "../_services/common.service";
import { MustMatch } from "src/app/_helpers/must-match.validator";
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';
import { PrintStudentReportService } from '../_services/student-base-report.service'


@Component({
  selector: "app-exam-report",
  templateUrl: "./exam-report.component.html",
  styleUrls: ["./exam-report.component.scss"],
})
export class ExamReportComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  studentUploForm: FormGroup;
  createEditForm: FormGroup;
  userPasswrodChangeForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Create new Student";
  btnSaveText = "Save";
  submitted = false;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalLgConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;
  imageFile: any;
  excelFileUrl: any;
  excelFile: any;
  imageUrl: string | ArrayBuffer;
  userId=null;

  sequence:number;
  classes=[];
  subjects=[];
  divisions=[];
  districts=[];
  subDistricts=[];
  schools = [];
  teachers = [];
  isExamReportLoaded=false

  examReports = [];
  students = [];
  student;
  subject;
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  public categoryList: Array<any> = [];

  page = new Page();

  selectedCustomer: any;
  selectedStatus: any;
  config: any;
  amount: number = 0;
  sampleExcelFile: string = null;
  isInitalBalanceGiven: boolean = true;

  images: Array<any> = [];
  status = [{ status: 'Active', name: "Active" }, { status: "Inactive", name: "Inactive" }]
  gerners = [{ value: 'Male', name: "Male" }, { value: "Female", name: "Female" }]

  constructor(
    private _service: CommonService,
    public formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private _lightbox: Lightbox,
    private authService: AuthenticationService,
    private confirmService: ConfirmService,
    private _printStudentReportService : PrintStudentReportService
  ) {
    this.authService.currentUserDetails.subscribe(value=>this.currentUser = value);
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      search_text: [null],
      status: [null]
    });
    

    this.createEditForm = this.formBuilder.group({
      id: [null],
      division_id: [null, [Validators.required]],
      district_id: [null, [Validators.required]],
      sub_district_id: [null, [Validators.required]],
      school_id: [null, [Validators.required]],
      teacher_id: [null, [Validators.required]],
      class_id: [null, [Validators.required]],
      student_id: [null, [Validators.required]],
      subject_id: [null, [Validators.required]],
    });

    this.getDivisions();
    this.getClasses();
    
  }

  get f() {
    return this.createEditForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }
  getList() {
    this.loadingIndicator = true;
  
    this._service.get("students-by-admin").subscribe(
      (res) => {
        console.log(res)
      
        if (res.status=='FAIL') {
          this.toastr.warning(res.messages, "Warning!", { timeOut: 2000 });
          return;
        }
        this.students = res.result;
      
      },
      (err) => {
        this.toastr.warning(err.message || err, "Warning!", {
          closeButton: true,
          disableTimeOut: false,
        });
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000);
      }
    );
  }

  getClasses() {
    this.loadingIndicator = true;
    this._service.get("class-list").subscribe(
      (res) => {
        this.classes = res.result;
      },
      (err) => {}
    );
  }

  getStudentMaxSequence() {
    this.loadingIndicator = true;
    this._service.get("student-max-sequence-by-admin").subscribe(
      (res) => {
        this.sequence = res.result.sequence;
      },
      (err) => {}
    );
  }

  getDivisions() {
    this.loadingIndicator = true;
    this._service.get("division-list").subscribe(
      (res) => {
        this.divisions = res.result;
      },
      (err) => {}
    );
  }

  onDivisionChange(item) {
    this.getDistrictByDivision(item.id);
    this.districts=[];
    this.subDistricts=[];
    this.schools=[];
    this.teachers=[]; 
    this.createEditForm.controls['district_id'].setValue('');
    this.createEditForm.controls['sub_district_id'].setValue('');
    this.createEditForm.controls['school_id'].setValue('');
    this.createEditForm.controls['teacher_id'].setValue('');
  }
  getDistrictByDivision(divisionId) {
    this.loadingIndicator = true;
    this._service.get("districtByDivisionId/"+divisionId).subscribe(
      (res) => {
        this.districts = res.result;
      },
      (err) => {}
    );
  }

  onDistrictChange(item) {
    this.getSubDistrictByDistrict(item.id);
    this.subDistricts=[];
    this.schools=[];
    this.teachers=[] ; 
    this.createEditForm.controls['sub_district_id'].setValue('');
    this.createEditForm.controls['school_id'].setValue('');
    this.createEditForm.controls['teacher_id'].setValue('');
  }

  getSubDistrictByDistrict(districtId) {
    this.loadingIndicator = true;
    this._service.get("subDistrictByDistrictId/"+districtId).subscribe(
      (res) => {
        this.subDistricts= res.result;
      },
      (err) => {}
    );
  }

  onSubDistrictChange(item) {
    this.getSchoolBySubDistrict(item.id);
    this.schools=[];
    this.teachers=[];
    this.createEditForm.controls['school_id'].setValue('');
    this.createEditForm.controls['teacher_id'].setValue('');
  }

  getSchoolBySubDistrict(subDistrictId) {
    this.loadingIndicator = true;
    this._service.get("schoolsBySubDistrictId/"+subDistrictId).subscribe(
      (res) => {
        this.schools= res.result;
      },
      (err) => {}
    );
  }

  onSchoolChange(item) {
    this.getTeachersBySchool(item.id)
    this.teachers=[]
    this.createEditForm.controls['teacher_id'].setValue('');
  }

  getTeachersBySchool(schoolId) {
    this.loadingIndicator = true;
    this._service.get("teacherBySchoolId/"+schoolId).subscribe(
      (res) => {
        this.teachers= res.result;
      },
      (err) => {}
    );
  }


  onClassChange(item) {
    this.getSubjectByClassId(item.id)
    this.getStudentByClassId(item.id)
    this.subjects=[]
    this.createEditForm.controls['subject_id'].setValue('');
    this.students=[]
    this.createEditForm.controls['student_id'].setValue('');
  }
  

  getSubjectByClassId(classId) {
    this.loadingIndicator = true;
    this._service.get("subjectByClassId/"+classId).subscribe(
      (res) => {
        this.subjects= res.result.subjects;
        console.log(res.result.subjects)
      },
      (err) => {}
    );
  }

  getStudentByClassId(classId) {
    let teacherId=this.createEditForm.value.teacher_id
    this.loadingIndicator = true;
    this._service.get("studentsByClassId/"+teacherId+"/"+classId).subscribe(
      (res) => {
        this.students= res.result;
      },
      (err) => {}
    );
  }


  openModal(template: TemplateRef<any>) {
    this.createEditForm.reset();
    this.imageUrl=null;
    this.userId=null;
    this.modalTitle='Search student base exam report';
    this.btnSaveText='Search Report';
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }



  onFormSubmit() {
    this.submitted = true;
    if (this.createEditForm.invalid) {
      return;
    }
      
      this.blockUI.start('Updating...');
      const obj = {
        student_id: this.createEditForm.value.student_id,
        subject_id: this.createEditForm.value.subject_id,
        teacher_id: this.createEditForm.value.teacher_id,
        class_id: this.createEditForm.value.class_id,

      };
  
      this._service.get('student-based-report', obj).subscribe(
        res => {
          this.blockUI.stop();
          this.examReports=res.result.exam
          this.student=res.result.student
          this.subject=res.result.subject
          this.toastr.success(res.messages, 'Success!', { timeOut: 2000 })
          this.isExamReportLoaded=true
          this.submitted = false;

          this._printStudentReportService.printReport(res.result);


         // this.modalHide();
        },
        err => {
          this.blockUI.stop();
          //this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
        }
      );
  }


  readExcelFileUrl(event: any, input) {
    
    if (!input || input.files.length === 0)
      return;

    var mimeType = input.files[0].type;
    var reader = new FileReader();

    this.excelFile = input.files[0];

    reader.readAsDataURL(input.files[0]);
    reader.onload = (_event) => {
      this.excelFileUrl = reader.result;
    }
    // if(this.studentUploForm.value.id){
    //   this.onPhotoSubmit();
    // }
  }


  RemovePhoto(){
    this.imageFile=[];
    this.imageUrl=null;
  }


  open(id: number): void {
    // open lightbox
    const i = this.images.findIndex((x)=>x.image_id == id);
    this._lightbox.open(this.images, i, { wrapAround: true, showImageNumberLabel: true, positionFromTop: 50 });
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }


  modalHide() {
    // this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.selectedCustomer = null;
    this.selectedStatus = null;
    this.isInitalBalanceGiven = true;
    this.amount = 0;
    this.images = [];
  }


  modalHideProfile() {
    this.modalRef.hide();
    this.selectedCustomer = null;
    this.images = [];
  }


  findImage(image_id){
    return this.images.find((x)=>x.image_id == image_id);
  }

}
