import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {McqQuestionComponent} from './mcq-question.component';

const routes: Routes = [
  {
    path: '',
    component: McqQuestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class McqQuestionRoutingModule { }
