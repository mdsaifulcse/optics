import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiAnsQuestRoutingModule } from './multi-ans-routing.module';
import { MultiAnsQuestComponent } from './multi-ans.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [MultiAnsQuestComponent],
  imports: [
    CommonModule,
    MultiAnsQuestRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class MultiAnsQuestModule { }
