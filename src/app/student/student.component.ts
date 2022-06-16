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


@Component({
  selector: "app-student",
  templateUrl: "./student.component.html",
  styleUrls: ["./student.component.scss"],
})
export class StudentComponent implements OnInit {
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
  divisions=[];
  districts=[];
  subDistricts=[];
  schools = [];
  teachers = [];

  students = [];
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
    

    this.studentUploForm = this.formBuilder.group({
      student_file: [null],
    });

    this.createEditForm = this.formBuilder.group({
      id: [null],
      division_id: [null, [Validators.required]],
      district_id: [null, [Validators.required]],
      sub_district_id: [null, [Validators.required]],
      school_id: [null, [Validators.required]],
      teacher_id: [null, [Validators.required]],
      class_id: [null, [Validators.required]],
      name_bn: [null, [Validators.required]],
      name_en: [null, [Validators.required]],
      age: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      guardian_mobile: [null],
      guardian_email:  [null],
      status: ['Active',[Validators.required]],
      sequence: [null,[Validators.required]]
    });

    this.getList();
    this.getStudentMaxSequence();
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


  openExcelUplodModal(template: TemplateRef<any>) {
    this.studentUploForm.reset();
    this.imageUrl=null;
    this.modalTitle='Upload Student by Excel';
    this.btnSaveText='Upload';
    this.userId=null;
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  openModal(template: TemplateRef<any>) {
    this.createEditForm.reset();
    this.sampleExcelFile=this.baseUrl +'/'+ 'excel/student_file.xlsx';
    this.imageUrl=null;
    this.userId=null;
    this.modalTitle='Create new Student';
    this.btnSaveText='Save';
    this.createEditForm.controls['sequence'].setValue(this.sequence);
    this.createEditForm.controls['status'].setValue('Active');
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openModalProfile(template: TemplateRef<any>, data) {
    this.createEditForm.reset();
    this.modalTitle='Update Student Details';
    this.btnSaveText='Update Student';

    console.log(data)

    if(data.division_id){
      this.getDistrictByDivision(data.division_id)
    }

    if(data.district_id){
      this.getSubDistrictByDistrict(data.district_id)
    }

    if(data.sub_district_id){
      this.getSchoolBySubDistrict(data.sub_district_id)
    }

    this.createEditForm.controls['division_id'].setValue(data.division_id);
    this.createEditForm.controls['district_id'].setValue(data.district_id);
    this.createEditForm.controls['sub_district_id'].setValue(data.sub_district_id);
    this.createEditForm.controls['school_id'].setValue(data.school_id);
    this.createEditForm.controls['teacher_id'].setValue(data.teacher_id);
    this.createEditForm.controls['class_id'].setValue(data.class_id);
    this.createEditForm.controls['name_bn'].setValue(data.name_bn);
    this.createEditForm.controls['name_en'].setValue(data.name_en);
    this.createEditForm.controls['guardian_mobile'].setValue(data.guardian_mobile);
    this.createEditForm.controls['guardian_email'].setValue(data.guardian_email);
    this.createEditForm.controls['gender'].setValue(data.gender);
    this.createEditForm.controls['age'].setValue(data.age);
    this.createEditForm.controls['sequence'].setValue(data.sequence);
    this.createEditForm.controls['status'].setValue(data.status);
    this.createEditForm.controls['id'].setValue(data.id);
    this.userId=data.id;

    if (data.profile) this.imageUrl = this.baseUrl +'/'+ data.profile.photo;

    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


 


  onFormSubmit() {
    this.submitted = true;
    if (this.createEditForm.invalid) {
      return;
    }

    if(!this.createEditForm.value.id){ // create new student ----------------
      let formData = new FormData();
      formData.append('division_id', this.createEditForm.value.division_id)
      formData.append('district_id', this.createEditForm.value.district_id)
      formData.append('sub_district_id', this.createEditForm.value.sub_district_id)
      formData.append('school_id', this.createEditForm.value.school_id)
      formData.append('teacher_id', this.createEditForm.value.teacher_id)
      formData.append('class_id', this.createEditForm.value.class_id)
      formData.append('name_bn', this.createEditForm.value.name_bn.trim())
      formData.append('name_en', this.createEditForm.value.name_en.trim())
      formData.append('guardian_mobile', this.createEditForm.value.guardian_mobile)
      formData.append('guardian_email', this.createEditForm.value.guardian_email)
      formData.append('gender', this.createEditForm.value.gender)
      formData.append('age', this.createEditForm.value.age)
      formData.append('sequence', this.createEditForm.value.sequence)

      if (this.imageFile) formData.append('photo', this.imageFile)
      
      this.blockUI.start('Creating...');
      this._service.post('students-by-admin', formData).subscribe(
        res => {
          console.log(res)
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            this.submitted = false;
            this.modalHide();
            this.getList();
            this.getStudentMaxSequence();
        },
        err => {
          this.blockUI.stop();
        }
      );

    }else{ // update student -----------------
      this.blockUI.start('Updating...');
      const obj = {
        id: this.createEditForm.value.id,
        division_id: this.createEditForm.value.division_id,
        district_id: this.createEditForm.value.district_id,
        sub_district_id: this.createEditForm.value.sub_district_id,
        school_id: this.createEditForm.value.school_id,
        teacher_id: this.createEditForm.value.teacher_id,
        class_id: this.createEditForm.value.class_id,
        name_bn: this.createEditForm.value.name_bn.trim(),
        name_en: this.createEditForm.value.name_en.trim(),
        guardian_mobile: this.createEditForm.value.guardian_mobile,
        guardian_email: this.createEditForm.value.guardian_email,
        gender: this.createEditForm.value.gender,
        age: this.createEditForm.value.age,
      };
  
      this._service.put('students-by-admin/'+this.createEditForm.value.id, obj).subscribe(
        res => {
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            //this.authService.updateProfile(res.result);
            this.submitted = false;
            this.modalHide();
            this.getList();
  
  
        },
        err => {
          this.blockUI.stop();
          //this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
        }
      );

    }
  }

  onExcelUploadFormSubmit() {
    this.submitted = true;
    if (this.studentUploForm.invalid) {
      return;
    }

   // upload/create new student ----------------
      let formData = new FormData();
      if (this.excelFile) formData.append('student_file', this.excelFile)
      
      this.blockUI.start('Uploading...');
      this._service.post('student-upload-by-admin', formData).subscribe(
        res => {
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            this.submitted = false;
            this.modalHide();
            this.getList();
        },
        err => {
          this.blockUI.stop();
          return this.toastr.error(err.errors, 'Error!', { timeOut: 10000 });
          
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

  openModalPasswordChange(template: TemplateRef<any>,data) {
    this.userPasswrodChangeForm.reset();
    this.modalTitle='Change Password for '+ data.name_bn;
    this.btnSaveText='Update';
    this.userPasswrodChangeForm.controls['user_id'].setValue(data.id);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  submitDeleteForm(school) {
    this.confirmService.confirm('Are you sure?', 'Do you want to delete the this Student ?')
    .subscribe(
        result => {
            if (result) {
                // delete school ----------------
              this.blockUI.start('Deleting...');
              this._service.delete('students-by-admin/'+school.id).subscribe(
                res => {
                  this.blockUI.stop();
                    this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
                    this.submitted = false;
                    this.getList();
                },
                err => {
                  this.blockUI.stop();
                }
              );
            }
        }
    );  
  }


  onPhotoSubmit() {
    this.submitted = true;

    this.blockUI.start('Uploading...');
    let formData = new FormData();
    formData.append('user_id', this.createEditForm.value.id)
    if (this.imageFile) formData.append('photo', this.imageFile)

    this._service.post('change-student-image-by-admin', formData).subscribe(
      res => {
        this.blockUI.stop();
        this.toastr.success(res.messages, 'Success!', { timeOut: 3000 });
        this.submitted = false;
      },
      err => {
        //this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }

  RemovePhoto(){
    this.imageFile=[];
    this.imageUrl=null;
  }

  readURL(event: any, input) {
    if (!input || input.files.length === 0)
      return;

    var mimeType = input.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.warning("Only images are supported", 'Warning!!');
      return;
    }

    var reader = new FileReader();

    this.imageFile = input.files[0];
    reader.readAsDataURL(input.files[0]);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
    if(this.createEditForm.value.id){
      this.onPhotoSubmit();
    }
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
