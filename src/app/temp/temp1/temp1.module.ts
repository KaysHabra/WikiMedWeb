import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Temp1PageRoutingModule } from './temp1-routing.module';

import { Temp1Page } from './temp1.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Temp1PageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [Temp1Page]
})
export class Temp1PageModule {}
