import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiAnswerExamRoutingModule } from './multi-answer-exam-routing.module';
import { MultiAnswerExamComponent } from './multi-answer-exam.component';
import { SharedModule } from '../../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [MultiAnswerExamComponent],
  imports: [
    CommonModule,
    MultiAnswerExamRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class MultiAnswerExamModule { }
