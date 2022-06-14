import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MemberProfileEditRoutes } from './member-profile-edit-routing.module';
import { MemberProfileEditComponent } from './member-profile-edit.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/theme/shared/shared.module';



@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(MemberProfileEditRoutes),
      SharedModule,
      BsDatepickerModule.forRoot()

  ],
  declarations: [MemberProfileEditComponent]
})

export class MemberProfileEditModule {}