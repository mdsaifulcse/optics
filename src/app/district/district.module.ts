import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistrictRoutingModule } from './district-routing.module';
import { DistrictComponent } from './district.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [DistrictComponent],
  imports: [
    CommonModule,
    DistrictRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class DistrictModule { }
