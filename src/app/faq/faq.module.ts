import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FAQRoutingModule } from './faq-routing.module';
import { FAQComponent } from './faq.component';
import { SharedModule } from '../theme/shared/shared.module';

@NgModule({
  declarations: [FAQComponent],
  imports: [
    CommonModule,
    FAQRoutingModule,
    SharedModule
  ]
})
export class FAQModule { }
