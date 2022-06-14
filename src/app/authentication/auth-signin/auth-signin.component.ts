import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../_services/authentication.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {

  LoginForm: FormGroup;
  submitted = false;
  show: boolean = false;
  returnUrl: string = "";
  @BlockUI() blockUI: any;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }
  }

  ngOnInit() {
    this.LoginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.LoginForm.controls;
  }

  onLoginSubmit() {
    this.submitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    this.blockUI.start('Logging...');
    this.authService.login(this.LoginForm.value).subscribe({
      next: (data : any) => {
        
        if (data.status=='OK') {
          this.toastr.success('You Successfully logged in', 'Success!', { timeOut: 2000 });
          this.router.navigate([this.returnUrl]);
        }
        else {
          this.toastr.warning(data.message, 'Warning!', { timeOut: 2000 });
        }

      },
      error: (e) => {
        if (e.status === 400) {
          this.toastr.error('Unauthorized request found', 'Warning!', { timeOut: 3000 });
        } else if (e.status === 401) {
          this.toastr.error('Invalid Username Or Password', 'Warning!', { timeOut: 3000 });
        }
      },
      complete: () =>  this.blockUI.stop()
  });

  }

}
