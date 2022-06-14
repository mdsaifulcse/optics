import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClassComponent} from './classes.component';

const routes: Routes = [
  {
    path: '',
    component: ClassComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassRoutingModule { }
