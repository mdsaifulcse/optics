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
  selector: "app-teacher",
  templateUrl: "./teacher.component.html",
  styleUrls: ["./teacher.component.scss"],
})
export class TeacherComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  teacherUploForm: FormGroup;
  createEditForm: FormGroup;
  userPasswrodChangeForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Create new Teacher";
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
  divisions=[];
  districts=[];
  subDistricts=[];
  schools = [];

  teachers = [];
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
  status = [{ status: 1, name: "Active" }, { status: 0, name: "Inactive" }]

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
    this.page.size = 20;
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      search_text: [null],
      status: [null]
    });
    

    this.teacherUploForm = this.formBuilder.group({
      teacher_file: [null],
    });

    this.createEditForm = this.formBuilder.group({
      id: [null],
      division_id: [null, [Validators.required]],
      district_id: [null, [Validators.required]],
      sub_district_id: [null, [Validators.required]],
      school_id: [null, [Validators.required]],
      name_bn: [null, [Validators.required]],
      name_en: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      mobile_number:  [null, [Validators.required]],
      password:  [null],
      confirm_password:  [null],
      status: [1,[Validators.required]]
      //mobile_number: [{value:null,disable:true}]
    });


    this.userPasswrodChangeForm = this.formBuilder.group({
      user_id:  [null],
      new_password:  [null, [Validators.required]],
      confirm_password:  [null, [Validators.required]],
    }, {
      validator: MustMatch('new_password', 'confirm_password')
    }
    
    );

    this.getList();
    this.getTeacherMaxSequence();
    this.getDivisions();
    
  }

  get f() {
    return this.createEditForm.controls;
  }
  get pc() {
    return this.userPasswrodChangeForm.controls;
  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }
  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
    };
    this._service.get("teachers",obj).subscribe(
      (res) => {
        if (res.status=='FAIL') {
          this.toastr.warning(res.messages, "Warning!", { timeOut: 2000 });
          return;
        }
        this.teachers = res.result.records;
        this.page.totalElements = res.result.total;
        this.page.totalPages = Math.ceil(
            this.page.totalElements / this.page.size
        );
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 1000); 
      
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


  getTeacherMaxSequence() {
    this.loadingIndicator = true;
    this._service.get("school-max-sequence").subscribe(
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
    this.getDistrictByDivision(item.id)
    this.districts=[]
    this.subDistricts=[]
    this.schools=[]    
    this.createEditForm.controls['district_id'].setValue('');
    this.createEditForm.controls['sub_district_id'].setValue('');
    this.createEditForm.controls['school_id'].setValue('');
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
    this.getSubDistrictByDistrict(item.id)
    this.subDistricts=[]
    this.schools=[]
    this.createEditForm.controls['sub_district_id'].setValue('');
    this.createEditForm.controls['school_id'].setValue('');
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
    this.getSchoolBySubDistrict(item.id)
    this.schools=[]
    this.createEditForm.controls['school_id'].setValue(null);
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



  openExcelUplodModal(template: TemplateRef<any>) {
    this.teacherUploForm.reset();
    this.imageUrl=null;
    this.modalTitle='Upload Teacher by Excel';
    this.btnSaveText='Upload';
    this.userId=null;
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  openModal(template: TemplateRef<any>) {
    this.createEditForm.reset();
    this.sampleExcelFile=this.baseUrl +'/'+ 'excel/teacher_file.xlsx';
    this.imageUrl=null;
    this.userId=null;
    this.modalTitle='Create new Teacher';
    this.btnSaveText='Save';
    this.createEditForm.controls['status'].setValue(1);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openModalProfile(template: TemplateRef<any>, data) {
    this.createEditForm.reset();
    this.modalTitle='Update Teacher Details';
    this.btnSaveText='Update Teacher';

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
    this.createEditForm.controls['name_bn'].setValue(data.name_bn);
    this.createEditForm.controls['name_en'].setValue(data.name_en);
    this.createEditForm.controls['mobile_number'].setValue(data.mobile_number);
    //this.createEditForm.controls['mobile_number'].disable();
    this.createEditForm.controls['email'].setValue(data.email);
    this.createEditForm.controls['status'].setValue(data.status);
    this.createEditForm.controls['id'].setValue(data.id);
    this.userId=data.id;

    if (data.profile) this.imageUrl = this.baseUrl +'/'+ data.profile.photo;

    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  onExcelUploadFormSubmit() {
    this.submitted = true;
    if (this.teacherUploForm.invalid) {
      return;
    }

   // upload/create new teacher ----------------
      let formData = new FormData();
      if (this.excelFile) formData.append('teacher_file', this.excelFile)
      
      this.blockUI.start('Creating...');
      this._service.post('teacher-upload', formData).subscribe(
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
    // if(this.teacherUploForm.value.id){
    //   this.onPhotoSubmit();
    // }
  }


  onFormSubmit() {
    this.submitted = true;
    if (this.createEditForm.invalid) {
      return;
    }

    if(!this.createEditForm.value.id){ // create new teacher ----------------
      let formData = new FormData();

      if(!this.createEditForm.value.password){
       return this.toastr.error('Passwrod is required', 'Error!', { timeOut: 2000 });
      }
      if(!this.createEditForm.value.confirm_password){
       return this.toastr.error('Confirm passwrod is required', 'Error!', { timeOut: 2000 });
      }

      if(this.createEditForm.value.password!==this.createEditForm.value.confirm_password){
       return this.toastr.error('Confirm passwrod does not match', 'Error!', { timeOut: 2000 });
      }
  

      formData.append('division_id', this.createEditForm.value.division_id)
      formData.append('district_id', this.createEditForm.value.district_id)
      formData.append('sub_district_id', this.createEditForm.value.sub_district_id)
      formData.append('school_id', this.createEditForm.value.school_id)
      formData.append('name_bn', this.createEditForm.value.name_bn.trim())
      formData.append('name_en', this.createEditForm.value.name_en.trim())
      formData.append('email', this.createEditForm.value.email.trim())
      formData.append('mobile_number', this.createEditForm.value.mobile_number.trim())
      formData.append('password', this.createEditForm.value.password.trim())
      formData.append('confirm_password', this.createEditForm.value.confirm_password.trim())

      
      if (this.imageFile) formData.append('photo', this.imageFile)
      
      this.blockUI.start('Creating...');
      this._service.post('teachers', formData).subscribe(
        res => {
          console.log(res)
          this.blockUI.stop();
            this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
            this.submitted = false;
            this.modalHide();
            this.getList();
            this.getTeacherMaxSequence();
        },
        err => {
          this.blockUI.stop();
        }
      );

    }else{ // update teacher -----------------
      this.blockUI.start('Updating...');
      const obj = {
        id: this.createEditForm.value.id,
        division_id: this.createEditForm.value.division_id,
        district_id: this.createEditForm.value.district_id,
        sub_district_id: this.createEditForm.value.sub_district_id,
        school_id: this.createEditForm.value.school_id,
        name_bn: this.createEditForm.value.name_bn.trim(),
        name_en: this.createEditForm.value.name_en.trim(),
        email: this.createEditForm.value.email.trim(),
        mobile_number: this.createEditForm.value.mobile_number.trim(),
        status: this.createEditForm.value.status,
      };
      console.log(this.createEditForm.value)
  
      this._service.put('teachers/'+this.createEditForm.value.id, obj).subscribe(
        res => {
          this.blockUI.stop();
        
          console.log(res)

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

  openModalPasswordChange(template: TemplateRef<any>,data) {
    this.userPasswrodChangeForm.reset();
    this.modalTitle='Change Password for '+ data.name_bn;
    this.btnSaveText='Update';
    this.userPasswrodChangeForm.controls['user_id'].setValue(data.id);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  onPasswordChangeFormSubmit() {
    this.submitted = true;
    if (this.userPasswrodChangeForm.invalid) {
      return;
    }
    
    const obj = {
      user_id: this.userPasswrodChangeForm.value.user_id,
      new_password: this.userPasswrodChangeForm.value.new_password.trim(),
      confirm_password: this.userPasswrodChangeForm.value.confirm_password.trim(),
    };

    console.log(obj)
    
    this.blockUI.start('Updating...');
    this._service.post('update-teacher-password', obj).subscribe(
      res => {
        this.blockUI.stop();
          this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
          this.submitted = false;
          this.modalHide();
          this.getList();
      },
      err => {
        this.blockUI.stop();
      }
    );
  }

  submitDeleteForm(school) {
    this.confirmService.confirm('Are you sure?', 'Do you want to delete the this School?')
    .subscribe(
        result => {
            if (result) {
                // delete school ----------------
              this.blockUI.start('Deleting...');
              this._service.delete('schools/'+school.id).subscribe(
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

    this._service.post('teacher-upload-profile-image', formData).subscribe(
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
