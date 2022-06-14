import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DivisionRoutingModule } from './division-routing.module';
import { DivisionComponent } from './division.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [DivisionComponent],
  imports: [
    CommonModule,
    DivisionRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class DivisionModule { }
