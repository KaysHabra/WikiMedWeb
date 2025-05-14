import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tmp1Page } from './tmp1.page';

const routes: Routes = [
  {
    path: '',
    component: Tmp1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tmp1PageRoutingModule {}
