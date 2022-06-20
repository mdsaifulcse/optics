import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestResultListRoutingModule } from './test-result-list-routing.module';
import { TestResultListComponent } from './test-result-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TestResultListComponent],
  imports: [
    CommonModule,
    TestResultListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class TestResultListModule { }
