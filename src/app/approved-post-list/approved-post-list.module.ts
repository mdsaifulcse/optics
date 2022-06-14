import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovedPostListRoutingModule } from './approved-post-list-routing.module';
import { ApprovedPostListComponent } from './approved-post-list.component';
import { SharedModule } from './../theme/shared/shared.module';

@NgModule({
  declarations: [ApprovedPostListComponent],
  imports: [
    CommonModule,
    ApprovedPostListRoutingModule,
    SharedModule
  ]
})
export class ApprovedPostListModule { }
