import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mat-datepicker',
  templateUrl: './mat-datepicker.component.html',
  styleUrls: ['./mat-datepicker.component.scss'],
})
export class MatDatepickerComponent implements OnInit {

  @Input()
  counterNumber = '';

  @Output() counterNumberChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  export(ev) {
    console.log(`cdcdcd= `, ev.value);
    // this.counterNumber = this.counterNumber.split("/").reverse().join("-");
    
    var date = new Date(ev.value);
    let newdate = this.formatDate(date);
    // alert(newdate);
    this.counterNumberChange.emit(newdate);
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
