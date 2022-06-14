import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostListRoutingModule } from './post-list-routing.module';
import { PostListComponent } from './post-list.component';
import { SharedModule } from './../theme/shared/shared.module';

@NgModule({
  declarations: [PostListComponent],
  imports: [
    CommonModule,
    PostListRoutingModule,
    SharedModule
  ]
})
export class PostListModule { }
