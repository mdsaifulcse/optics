import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubUnitRoutingModule } from './sub-unit-routing.module';
import { SubUnitComponent } from './sub-unit.component';
import { SharedModule } from '../theme/shared/shared.module';

@NgModule({
  declarations: [SubUnitComponent],
  imports: [
    CommonModule,
    SubUnitRoutingModule,
    SharedModule
  ]
})
export class SubUnitModule { }
