import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { McqExamRoutingModule } from './mcq-exam-routing.module';
import { McqExamComponent } from './mcq-exam.component';
import { SharedModule } from '../../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [McqExamComponent],
  imports: [
    CommonModule,
    McqExamRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class McqExamModule { }
