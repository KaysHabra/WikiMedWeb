import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Appointmen1Page } from './appointmen1.page';

const routes: Routes = [
  {
    path: '',
    component: Appointmen1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Appointmen1PageRoutingModule {}
