import { Component, OnInit } from '@angular/core';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-schedule-daily-note',
  templateUrl: './schedule-daily-note.page.html',
  styleUrls: ['./schedule-daily-note.page.scss'],
})
export class ScheduleDailyNotePage implements OnInit {
  tblNots = [
    {
      IDP: 1,
      IDF: 0,
      Note: `every Day`,
    },
    {
      IDP: 2,
      IDF: 1,
      Note: `first`,
    },
    {
      IDP: 3,
      IDF: 1,
      Note: `secound`,
    },
  ];

  CreatedDate = this.all.getDateNow(`-`);
  RepeatedDays = 0;
  constructor(public all: AllService) { }

  ngOnInit() {
  }

  getSelectedUser(ev) {
    
  }

  setRepeatedDays(ev){
    console.log(ev);
    this.RepeatedDays = ev.detail.value;
  }

  setRepeatedDaysRadio(){
    this.RepeatedDays = +this.RepeatedDays;
  }

  edit(ev) {
    console.log(`ev= `, ev);
  }
  cancel() { }
  save() { }
}
