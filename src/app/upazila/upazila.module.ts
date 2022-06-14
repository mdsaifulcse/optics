import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpazilaRoutingModule } from './upazila-routing.module';
import { UpazilaComponent } from './upazila.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [UpazilaComponent],
  imports: [
    CommonModule,
    UpazilaRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class UpazilaModule { }
