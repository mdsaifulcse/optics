import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllPaymentListRoutingModule } from './all-payment-list-routing.module';
import { AllPaymentListComponent } from './all-payment-list.component';
import { SharedModule } from './../theme/shared/shared.module';

@NgModule({
  declarations: [AllPaymentListComponent],
  imports: [
    CommonModule,
    AllPaymentListRoutingModule,
    SharedModule
  ]
})
export class AllPaymentListModule { }
