import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UpazilaComponent} from './upazila.component';

const routes: Routes = [
  {
    path: '',
    component: UpazilaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpazilaRoutingModule { }
