import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from './teacher.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [TeacherComponent],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class TeacherModule { }
