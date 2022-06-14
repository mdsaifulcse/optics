import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InteractiveQuestionComponent} from './interactive-question.component';

const routes: Routes = [
  {
    path: '',
    component: InteractiveQuestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InteractiveQuestionRoutingModule { }
