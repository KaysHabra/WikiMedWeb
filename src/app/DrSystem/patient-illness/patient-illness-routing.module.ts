import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientIllnessPage } from './patient-illness.page';

const routes: Routes = [
  {
    path: '',
    component: PatientIllnessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientIllnessPageRoutingModule {}
