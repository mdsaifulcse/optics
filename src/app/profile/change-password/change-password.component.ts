import {
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnInit
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { CommonService } from "src/app/_services/common.service";
import { MustMatch } from "src/app/_helpers/must-match.validator";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html"
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {

    this.changePasswordForm = this.formBuilder.group({
      old_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
    }, {
      validator: MustMatch('new_password', 'confirm_password')
    });

  }
  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.blockUI.start('Saving data...');

    const obj = {
      old_password: this.changePasswordForm.value.old_password.trim(),
      new_password: this.changePasswordForm.value.new_password.trim(),
      confirm_password: this.changePasswordForm.value.confirm_password.trim(),
    };

    this._service.post('update-password', obj).subscribe(
      res => {
        this.blockUI.stop();
        this.toastr.success('Password Changed Successfully', 'Success!', { timeOut: 2000 });
        this.submitted = false;
        this.changePasswordForm.reset();
      },
      error => {
        //this.toastr.warning(error.message || error, 'Warning!', { timeOut: 2000 });
        this.blockUI.stop();
      }
    );

  }



}
