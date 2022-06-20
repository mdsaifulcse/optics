import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {McqExamComponent} from './mcq-exam.component';

const routes: Routes = [
  {
    path: '',
    component: McqExamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class McqExamRoutingModule { }
