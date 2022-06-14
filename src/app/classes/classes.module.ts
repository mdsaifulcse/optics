import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassRoutingModule } from './classes-routing.module';
import { ClassComponent } from './classes.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [ClassComponent],
  imports: [
    CommonModule,
    ClassRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class ClassModule { }
