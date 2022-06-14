import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClassWiseSubjectComponent} from './class-wise-subject.component';

const routes: Routes = [
  {
    path: '',
    component: ClassWiseSubjectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassWiseSubjectRoutingModule { }
