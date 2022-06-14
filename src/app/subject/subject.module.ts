import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectRoutingModule } from './subject-routing.module';
import { SubjectComponent } from './subject.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [SubjectComponent],
  imports: [
    CommonModule,
    SubjectRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class SubjectModule { }
