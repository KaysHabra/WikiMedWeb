import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Appointmen1PageRoutingModule } from './appointmen1-routing.module';

import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { Appointmen1Page } from './appointmen1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Appointmen1PageRoutingModule,
    SharedComponentsModule,
    TranslateModule,
  ],
  declarations: [Appointmen1Page]
})
export class Appointmen1PageModule {}
