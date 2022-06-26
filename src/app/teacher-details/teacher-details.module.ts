import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherDetailsRoutingModule } from './teacher-details-routing.module';
import { TeacherDetailsComponent } from './teacher-details.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [TeacherDetailsComponent],
  imports: [
    CommonModule,
    TeacherDetailsRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class TeacherDetailsModule { }