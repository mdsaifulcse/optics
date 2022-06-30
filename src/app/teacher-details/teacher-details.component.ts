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
import { ActivatedRoute,Router } from "@angular/router";


@Component({
  selector: "app-teacher-details",
  templateUrl: "./teacher-details.component.html",
  styleUrls: ["./teacher-details.component.scss"],
})
export class TeacherDetailsComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  studentUploForm: FormGroup;
  createEditForm: FormGroup;
  userPasswrodChangeForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Teacher Details";
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
  teacherId;
  teacher;
  is_teacher_loaded = false;

  sequence:number;
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  page = new Page();
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
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.authService.currentUserDetails.subscribe(value=>this.currentUser = value);
    this.teacherId = this.route.snapshot.paramMap.get("teacherId");
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      search_text: [null],
      status: [null]
    });
    
    this.getTeacherDetails();
    
  }

  get f() {
    return this.createEditForm.controls;
  }



  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
  }

  getTeacherDetails() {
    this.loadingIndicator = true;
    this._service.get("teachers/"+this.teacherId).subscribe(
      (res) => {
        this.teacher = res.result;
        console.log(this.teacher)
        this.is_teacher_loaded = true;
      },
      (err) => {}
    );
  }



  openExcelUplodModal(template: TemplateRef<any>) {
    this.studentUploForm.reset();
    this.sampleExcelFile=this.baseUrl +'/'+ 'excel/student_file.xlsx';
    this.imageUrl=null;
    this.modalTitle='Upload Student by Excel';
    this.btnSaveText='Upload';
    this.userId=null;
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  openModal(template: TemplateRef<any>) {
    this.createEditForm.reset();
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

    if (data.photo) this.imageUrl = this.baseUrl +'/'+ data.photo;

    this.modalRef = this.modalService.show(template, this.modalLgConfig);
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
    this.isInitalBalanceGiven = true;
    this.amount = 0;
    this.images = [];
  }


  modalHideProfile() {
    this.modalRef.hide();
    this.images = [];
  }


  findImage(image_id){
    return this.images.find((x)=>x.image_id == image_id);
  }

}
