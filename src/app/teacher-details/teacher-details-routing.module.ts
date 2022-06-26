import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TeacherDetailsComponent} from './teacher-details.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherDetailsComponent
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherDetailsRoutingModule { }
