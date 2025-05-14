import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tmp2PageRoutingModule } from './tmp2-routing.module';

import { Tmp2Page } from './tmp2.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tmp2PageRoutingModule,
    TranslateModule,
  ],
  declarations: [Tmp2Page]
})
export class Tmp2PageModule {}
