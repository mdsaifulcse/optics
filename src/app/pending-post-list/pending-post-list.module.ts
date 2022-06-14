import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingPostListRoutingModule } from './pending-post-list-routing.module';
import { PendingPostListComponent } from './pending-post-list.component';
import { SharedModule } from './../theme/shared/shared.module';

@NgModule({
  declarations: [PendingPostListComponent],
  imports: [
    CommonModule,
    PendingPostListRoutingModule,
    SharedModule
  ]
})
export class PendingPostListModule { }
