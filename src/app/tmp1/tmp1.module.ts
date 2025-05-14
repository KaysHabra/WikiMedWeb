import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tmp1PageRoutingModule } from './tmp1-routing.module';

import { Tmp1Page } from './tmp1.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tmp1PageRoutingModule,
    TranslateModule,
  ],
  declarations: [Tmp1Page]
})
export class Tmp1PageModule {}
