import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AllPaymentListComponent} from './all-payment-list.component';

const routes: Routes = [
  {
    path: '',
    component: AllPaymentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllPaymentListRoutingModule { }
