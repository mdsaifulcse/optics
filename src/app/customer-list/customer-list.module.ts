import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerListRoutingModule } from './customer-list-routing.module';
import { CustomerListComponent } from './customer-list.component';
import { SharedModule } from './../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [CustomerListComponent],
  imports: [
    CommonModule,
    CustomerListRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class CustomerListModule { }
