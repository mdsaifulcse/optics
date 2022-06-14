import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { CommonService } from '../../_services/common.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { environment } from '../../../environments/environment'
import { ResponseStatus } from 'src/app/_models/enum';


@Component({
  selector: 'app-member-profile-edit',
  templateUrl: './member-profile-edit.component.html',
  styleUrls: ['./member-profile-edit.component.css']
})
export class MemberProfileEditComponent implements OnDestroy, OnInit {

  baseUrl = environment.baseUrl;
  picURL: any;
  picFile: any = null;
  currentUser: any;
  @BlockUI() blockUI: NgBlockUI;
  fullFormArray: any;
  editProfileForm: FormGroup;
  historyList: FormArray;
  imageFile: any;
  imageUrl: string | ArrayBuffer;
  bsConfig: Partial<BsDatepickerConfig>;
  maxDate: Date;

  genderList = ["Male", "Female","Other"];
  submitted = false;
  today: Date;

  constructor(
    private formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.authService.currentUserDetails.subscribe(value=>this.currentUser = value);
    this.today = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue' });
  }

  ngOnInit(): void {
    // this.loadJquery();

    this.getItem();

    this.editProfileForm = this.formBuilder.group({
      name_bn: [null, [Validators.required]],
      name_en: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      mobile_number:  [null, [Validators.required]],
      //mobile_number: [{value:null,disable:true}]
    });

  }

  get f() {
    return this.editProfileForm.controls;
  }




  ngOnDestroy() {
    // (function($) {
    //   $("header").removeClass("default-header");
    // })($);
  }

  getItem() {
    this.blockUI.start('Getting data...');
    this._service.get('admins/'+this.currentUser.id).subscribe(res => {
      this.blockUI.stop();
      if (res.result.status=='FAIL') {
        this.toastr.warning(res.message, "Warning!", { timeOut: 2000 });
        return;
      }

      this.editProfileForm.controls['name_bn'].setValue(res.result.name_bn);
      this.editProfileForm.controls['name_en'].setValue(res.result.name_en);
      this.editProfileForm.controls['mobile_number'].setValue(res.result.mobile_number);
      //this.editProfileForm.controls['mobile_number'].disable();
      this.editProfileForm.controls['email'].setValue(res.result.email);

      if (res.result.profile) this.imageUrl = this.baseUrl +'/'+ res.result.profile.photo;
    }, err => {
      this.blockUI.stop();
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });

  }

  onFormSubmit() {
    this.submitted = true;
    if (this.editProfileForm.invalid) {
      return;
    }

    this.blockUI.start('Updating...');

    const obj = {
      name_bn: this.editProfileForm.value.name_bn.trim(),
      name_en: this.editProfileForm.value.name_en.trim(),
      email: this.editProfileForm.value.email.trim(),
      mobile_number: this.editProfileForm.value.mobile_number.trim(),
    };

    this._service.put('admins/'+this.currentUser.id, obj).subscribe(
      res => {
        this.blockUI.stop();
        // if (!res.success) {
        //     this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true, enableHtml: true });
        //     return;
        // }
          this.toastr.success(res.messages, 'Success!', { timeOut: 2000 });
          this.authService.updateProfile(res.result);
          this.submitted = false;
          this.getItem();


      },
      err => {
        this.blockUI.stop();
        //this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }
  onPhotoSubmit() {
    this.submitted = true;

    this.blockUI.start('Uploading...');
    let formData = new FormData();
    formData.append('user_id', this.currentUser.id)
    if (this.imageFile) formData.append('photo', this.imageFile);

    console.log(formData)

    this._service.post('user-upload-profile-image', formData).subscribe(
      res => {
        this.blockUI.stop();
        this.authService.updateImage(res.data);
        this.toastr.success(res.message, 'Success!', { timeOut: 3000 });
        this.submitted = false;
        this.getItem();

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
    this.onPhotoSubmit();
  }








}
