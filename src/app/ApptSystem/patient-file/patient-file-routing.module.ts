import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientFilePage } from './patient-file.page';

const routes: Routes = [
  {
    path: '',
    component: PatientFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientFilePageRoutingModule {}
