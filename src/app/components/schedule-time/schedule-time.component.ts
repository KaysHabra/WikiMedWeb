import { Component, OnInit } from '@angular/core';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-schedule-time',
  templateUrl: './schedule-time.component.html',
  styleUrls: ['./schedule-time.component.scss'],
})
export class ScheduleTimeComponent implements OnInit {
  PageName = `Doctors`;
  DoctorData = {
    CreatedFromDate: this.all.getDateNow(`-`),
  };

  tblDoctors = [
    {
      ID: 1, IDP: 1, IDF: 0, NameA: 'Plastic Surgery', No: `1531`, Progress: 0.3
    },
    {
      ID: 2, IDP: 3, IDF: 1, NameA: 'Dr.Alatawe', No: `97541`, Progress: 0.5
    },
    {
      ID: 4, IDP: 4, IDF: 1, NameA: 'Dr.Samer', No: `0025`, Progress: 0.9
    },
    {
      ID: 5, IDP: 5, IDF: 1, NameA: 'Dr.maher', No: `0015`, Progress: 0.2
    },
  ];
  tblSelectedItem = [];
  constructor(public all: AllService) { }

  ngOnInit() { }

  getInvitedPatient(ev) {

  }
}
