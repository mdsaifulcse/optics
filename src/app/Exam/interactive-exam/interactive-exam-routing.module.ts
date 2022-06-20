import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InteractiveExamComponent} from './interactive-exam.component';

const routes: Routes = [
  {
    path: '',
    component: InteractiveExamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InteractiveExamRoutingModule { }
