import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PendingPostListComponent} from './pending-post-list.component';

const routes: Routes = [
  {
    path: '',
    component: PendingPostListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingPostListRoutingModule { }
