import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicComponent } from './topic.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [TopicComponent],
  imports: [
    CommonModule,
    TopicRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class TopicModule { }
