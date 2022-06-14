import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberListRoutingModule } from './member-list-routing.module';
import { MemberListComponent } from './member-list.component';
import { SharedModule } from './../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [MemberListComponent],
  imports: [
    CommonModule,
    MemberListRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class MemberListModule { }
