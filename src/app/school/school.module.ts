import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { SchoolComponent } from './school.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [SchoolComponent],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class SchoolModule { }
