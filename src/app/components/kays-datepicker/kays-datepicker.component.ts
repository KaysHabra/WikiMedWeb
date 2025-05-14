import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-kays-datepicker',
  templateUrl: './kays-datepicker.component.html',
  styleUrls: ['./kays-datepicker.component.scss'],
})
export class KaysDatepickerComponent implements OnInit {
  @Input() Label = '';

  @Input()
  counterNumber = '';

  @Output() counterNumberChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  dateValue: string = ''; // يتم تخزين قيمة التاريخ هنا

  onDateChange(event: any): void {
    console.log('Selected Date:', this.dateValue);
    this.counterNumberChange.emit(this.dateValue);
  }


  export(ev) {
    console.log(`cdcdcd= `, ev.value);

    var date = new Date(ev.value);
    let newdate = this.formatDate(date);
    this.dateValue = newdate;
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
