import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminViewRoutingModule } from './dashboard-admin-routing.module';
import { AdminViewComponent } from './dashboard-admin.component';
import { SharedModule } from '../theme/shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AdminViewComponent],
  imports: [
    CommonModule,
    AdminViewRoutingModule,
    SharedModule,
    NgbTooltipModule,
    HighchartsChartModule
  ]
})
export class AdminViewViewModule { }
