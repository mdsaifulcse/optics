import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [StudentComponent],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class StudentModule { }
