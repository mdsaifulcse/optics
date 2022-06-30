import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExamReportComponent} from './exam-report.component';

const routes: Routes = [
  {
    path: '',
    component: ExamReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamReportRoutingModule { }
