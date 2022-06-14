import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthSigninRoutingModule } from './auth-signin-routing.module';
import { AuthSigninComponent } from './auth-signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  imports: [
    CommonModule,
    AuthSigninRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule
  ],
  declarations: [AuthSigninComponent]
})
export class AuthSigninModule { }
