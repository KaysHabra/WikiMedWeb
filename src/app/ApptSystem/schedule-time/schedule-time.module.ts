import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleTimePageRoutingModule } from './schedule-time-routing.module';

import { ScheduleTimePage } from './schedule-time.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleTimePageRoutingModule,
    TranslateModule,
    SharedComponentsModule,
    MatTooltipModule,
  ],
  declarations: [ScheduleTimePage]
})
export class ScheduleTimePageModule {}
