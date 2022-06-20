import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InteractiveExamRoutingModule } from './interactive-exam-routing.module';
import { InteractiveExamComponent } from './interactive-exam.component';
import { SharedModule } from '../../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [InteractiveExamComponent],
  imports: [
    CommonModule,
    InteractiveExamRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class InteractiveExamModule { }
