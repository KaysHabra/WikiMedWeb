import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleDailyNotePage } from './schedule-daily-note.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleDailyNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleDailyNotePageRoutingModule {}
