import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Appointmen2Page } from './appointmen2.page';

const routes: Routes = [
  {
    path: '',
    component: Appointmen2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Appointmen2PageRoutingModule {}
