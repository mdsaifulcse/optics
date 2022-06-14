import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SourcingRequestListRoutingModule } from './sourcing-request-list-routing.module';
import { SourcingRequestListComponent } from './sourcing-request-list.component';
import { SharedModule } from './../theme/shared/shared.module';

@NgModule({
  declarations: [SourcingRequestListComponent],
  imports: [
    CommonModule,
    SourcingRequestListRoutingModule,
    SharedModule
  ]
})
export class SourcingRequestListModule { }
