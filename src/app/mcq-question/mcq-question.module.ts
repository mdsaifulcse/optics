import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { McqQuestionRoutingModule } from './mcq-question-routing.module';
import { McqQuestionComponent } from './mcq-question.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [McqQuestionComponent],
  imports: [
    CommonModule,
    McqQuestionRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class McqQuestionModule { }
