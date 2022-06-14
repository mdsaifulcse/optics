import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SourcingRequestListComponent} from './sourcing-request-list.component';

const routes: Routes = [
  {
    path: '',
    component: SourcingRequestListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SourcingRequestListRoutingModule { }
