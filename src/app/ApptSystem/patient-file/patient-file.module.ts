import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientFilePageRoutingModule } from './patient-file-routing.module';

// import { PatientFilePage } from './patient-file.page';
// import { SharedComponentsModule } from '../components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { PatientFilePage } from './patient-file.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientFilePageRoutingModule,
    SharedComponentsModule,
    TranslateModule,
    MatTooltipModule,
  ],
  declarations: [PatientFilePage]
})
export class PatientFilePageModule {}
