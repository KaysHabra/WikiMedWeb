import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientIllnessPageRoutingModule } from './patient-illness-routing.module';

import { PatientIllnessPage } from './patient-illness.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientIllnessPageRoutingModule,
    TranslateModule,
    SharedComponentsModule,
  ],
  declarations: [PatientIllnessPage]
})
export class PatientIllnessPageModule {}
