import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InteractiveQuestionRoutingModule } from './interactive-question-routing.module';
import { InteractiveQuestionComponent } from './interactive-question.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [InteractiveQuestionComponent],
  imports: [
    CommonModule,
    InteractiveQuestionRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class InteractiveQuestionModule { }
