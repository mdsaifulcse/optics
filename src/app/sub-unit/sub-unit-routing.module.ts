import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SubUnitComponent} from './sub-unit.component';

const routes: Routes = [
  {
    path: '',
    component: SubUnitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubUnitRoutingModule { }
