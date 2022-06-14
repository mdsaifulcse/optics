import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostEditRoutingModule } from './post-edit-routing.module';
import { PostEditComponent } from './post-edit.component';
import { SharedModule } from './../theme/shared/shared.module';

@NgModule({
  declarations: [PostEditComponent],
  imports: [
    CommonModule,
    PostEditRoutingModule,
    SharedModule
  ]
})
export class PostEditModule { }
