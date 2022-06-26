import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentDetailsRoutingModule } from './student-details-routing.module';
import { StudentDetailsComponent } from './student-details.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [StudentDetailsComponent],
  imports: [
    CommonModule,
    StudentDetailsRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class StudentDetailsModule { }