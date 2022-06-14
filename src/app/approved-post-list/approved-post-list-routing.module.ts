import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApprovedPostListComponent} from './approved-post-list.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovedPostListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovedPostListRoutingModule { }
