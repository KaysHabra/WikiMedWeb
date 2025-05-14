import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleDailyNotePageRoutingModule } from './schedule-daily-note-routing.module';

import { ScheduleDailyNotePage } from './schedule-daily-note.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleDailyNotePageRoutingModule,
    TranslateModule,
    SharedComponentsModule
  ],
  declarations: [ScheduleDailyNotePage]
})
export class ScheduleDailyNotePageModule {}
