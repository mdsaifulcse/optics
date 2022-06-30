import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamReportRoutingModule } from './exam-report-routing.module';
import { ExamReportComponent } from './exam-report.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [ExamReportComponent],
  imports: [
    CommonModule,
    ExamReportRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class ExamReportModule { }
