import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassWiseSubjectRoutingModule } from './class-wise-subject-routing.module';
import { ClassWiseSubjectComponent } from './class-wise-subject.component';
import { SharedModule } from '../theme/shared/shared.module';
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [ClassWiseSubjectComponent],
  imports: [
    CommonModule,
    ClassWiseSubjectRoutingModule,
    SharedModule,
    LightboxModule
  ]
})
export class ClassWiseSubjectModule { }
