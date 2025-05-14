import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Temp1Page } from './temp1.page';

const routes: Routes = [
  {
    path: '',
    component: Temp1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Temp1PageRoutingModule {}
