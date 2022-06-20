import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestResultListComponent} from './test-result-list.component';

const routes: Routes = [
  {
    path: '',
    component: TestResultListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestResultListRoutingModule { }
