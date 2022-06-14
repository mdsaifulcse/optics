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


@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  currentUser: any;
  baseUrl = environment.baseUrl;
  filterForm: FormGroup;
  editProfileForm: FormGroup;
  userPasswrodChangeForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = "Create new admin";
  btnSaveText = "Save";
  submitted = false;
  modalConfig: any = { class: "gray modal-md", backdrop: "static" };
  modalLgConfig: any = { class: "gray modal-lg", backdrop: "static" };
  modalRef: BsModalRef;
  imageFile: any;
  imageUrl: string | ArrayBuffer;
  userId=null;

  rows = [];
  admins = [];
  status = [{ status: 1, name: "Active" }, { status: 0, name: "Inactive" }]
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  public categoryList: Array<any> = [];

  page = new Page();

  selectedCustomer: any;
  selectedStatus: any;
  config: any;
  amount: number = 0;
  isInitalBalanceGiven: boolean = true;

  images: Array<any> = [];

  constructor(
    private _service: CommonService,
    public formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private _lightbox: Lightbox,
    private authService: AuthenticationService,
  ) {
    this.authService.currentUserDetails.subscribe(value=>this.currentUser = value);
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      search_text: [null],
    });

    this.editProfileForm = this.formBuilder.group({
      id: [null],
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
    
  }

  get f() {
    return this.editProfileForm.controls;
  }
  get pc() {
    return this.userPasswrodChangeForm.controls;
  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }


  filterCustomer() {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.getList();
  }





  getList() {
    this.loadingIndicator = true;
  
    this._service.get("admins").subscribe(
      (res) => {
        console.log(res)
      
        if (res.status=='FAIL') {
          this.toastr.warning(res.messages, "Warning!", { timeOut: 2000 });
          return;
        }

        this.admins = res.result;
      
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

  openModal(template: TemplateRef<any>) {
    this.editProfileForm.reset();
    this.imageUrl=null;
    this.userId=null;
    this.modalTitle='Create new Admin';
    this.btnSaveText='Save';
    this.editProfileForm.controls['status'].setValue(1);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  openModalProfile(template: TemplateRef<any>, admin) {
    this.editProfileForm.reset();
    this.modalTitle='Update Profile Details';
    this.btnSaveText='Update Profile';
    this.imageUrl=null;
    this.editProfileForm.controls['name_bn'].setValue(admin.name_bn);
    this.editProfileForm.controls['name_en'].setValue(admin.name_en);
    this.editProfileForm.controls['mobile_number'].setValue(admin.mobile_number);
    //this.editProfileForm.controls['mobile_number'].disable();
    this.editProfileForm.controls['email'].setValue(admin.email);
    this.editProfileForm.controls['id'].setValue(admin.id);
    this.editProfileForm.controls['status'].setValue(admin.status);
    this.userId=admin.id;
    if (admin.profile) this.imageUrl = this.baseUrl +'/'+ admin.profile.photo;


    // if (this.selectedCustomer.NID_image) {
    //   this.images.push({
    //     image_id :1,
    //     src: this.baseUrl + '/' + this.selectedCustomer.NID_image,
    //     caption: 'NID Image',
    //     thumb: this.baseUrl + '/' + this.selectedCustomer.NID_image
    //   });
    // }

    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }



  onFormSubmit() {

    this.submitted = true;
    if (this.editProfileForm.invalid) {
      return;
    }

    if(!this.editProfileForm.value.id){ // create new admin ----------------
      let formData = new FormData();

      if(!this.editProfileForm.value.password){
       return this.toastr.error('Passwrod is required', 'Error!', { timeOut: 2000 });
      }
      if(!this.editProfileForm.value.confirm_password){
       return this.toastr.error('Confirm passwrod is required', 'Error!', { timeOut: 2000 });
      }

      if(this.editProfileForm.value.password!==this.editProfileForm.value.confirm_password){
       return this.toastr.error('Confirm passwrod does not match', 'Error!', { timeOut: 2000 });
      }
    

      formData.append('name_bn', this.editProfileForm.value.name_bn.trim())
      formData.append('name_en', this.editProfileForm.value.name_en.trim())
      formData.append('email', this.editProfileForm.value.email.trim())
      formData.append('mobile_number', this.editProfileForm.value.mobile_number.trim())
      formData.append('password', this.editProfileForm.value.password.trim())
      formData.append('confirm_password', this.editProfileForm.value.confirm_password.trim())
      formData.append('status', this.editProfileForm.value.status)

      
      if (this.imageFile) formData.append('photo', this.imageFile)
      
      this.blockUI.start('Creating...');
      this._service.post('admins', formData).subscribe(
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

    }else{ // update admin -----------------
      this.blockUI.start('Updating...');

      const obj = {
        id: this.editProfileForm.value.id,
        name_bn: this.editProfileForm.value.name_bn.trim(),
        name_en: this.editProfileForm.value.name_en.trim(),
        email: this.editProfileForm.value.email.trim(),
        mobile_number: this.editProfileForm.value.mobile_number.trim(),
        status: this.editProfileForm.value.status,
      };
  
      this._service.put('admins/'+this.editProfileForm.value.id, obj).subscribe(
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

  openModalPasswordChange(template: TemplateRef<any>,admin) {
    this.userPasswrodChangeForm.reset();
    this.modalTitle='Change Password for '+ admin.name_bn;
    this.btnSaveText='Update';
    this.userPasswrodChangeForm.controls['user_id'].setValue(admin.id);
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
    
    this.blockUI.start('Updating...');
    this._service.post('update-user-password', obj).subscribe(
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


  onPhotoSubmit() {
    this.submitted = true;

    this.blockUI.start('Uploading...');
    let formData = new FormData();
    formData.append('user_id', this.editProfileForm.value.id)
    if (this.imageFile) formData.append('photo', this.imageFile)

    this._service.post('user-upload-profile-image', formData).subscribe(
      res => {
        this.blockUI.stop();
        //this.authService.updateImage(res.data);
        this.toastr.success(res.message, 'Success!', { timeOut: 3000 });
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
    if(this.editProfileForm.value.id){
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
