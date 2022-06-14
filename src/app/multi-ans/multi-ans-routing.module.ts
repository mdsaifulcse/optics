import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MultiAnsQuestComponent} from './multi-ans.component';

const routes: Routes = [
  {
    path: '',
    component: MultiAnsQuestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiAnsQuestRoutingModule { }
