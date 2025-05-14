import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tmp2Page } from './tmp2.page';

const routes: Routes = [
  {
    path: '',
    component: Tmp2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tmp2PageRoutingModule {}
