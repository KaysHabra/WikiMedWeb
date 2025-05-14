import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-med-form-date',
  templateUrl: './med-form-date.component.html',
  styleUrls: ['./med-form-date.component.scss'],
})
export class MedFormDateComponent implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter<any>();
  @Input() Lang = `E`;
  @Input() IsPrinting = false;
  // @Input() item = {
  //   "ID": 444,
  //   "IDForm": 1,
  //   "IDNature": 1,
  //   "IsDefault": 1,
  //   "Visible": 1,
  //   "SingleForm": 0,
  //   "FieldsGroupE": "General Form",
  //   "FieldsGroupA": "النموذج العام",
  //   "NameE": "NURSE’S FORM",
  //   "NameA": "نموذج التمريض",
  //   "FieldDataType": "Text",
  //   "FieldDataSize": 0,
  //   "FieldIsRequired": 0,
  //   "CharsInLine": 0,
  //   "LinesInHeight": 1,
  //   "DefaultColor": 12895487,
  //   "UserUnAllow": "",
  //   "Permissions": "",
  //   "AnswerTypes": "",
  //   "AnswerDegrees": 0,
  //   "HeaderDescriptions": "",
  //   "FooterDescriptions": "",
  //   "ListValues": "",
  //   "ListDefaultValue": -1,
  //   "GroupFields": "",
  //   "GroupColumns": 0,
  //   "GroupLines": 0,
  //   "Image": "",
  //   "DefaultDoc": "",
  //   "CalcName": "",
  //   ReportVal: ""
  // };


  Item = null;
  @Input()
  set item(data: any) {
    this.Item = data;
    if(this.Item.FieldDataType == 'Date'){
      this.Item.ReportVal = this.Item.Report.split(` `)[0];
    }
  }
  constructor() { }

  ngOnInit() {
    // setTimeout(() => {
    //   this.item.FieldDataType = this.item.FieldDataType.split(` `)[0];
    // }, 150);
  }

  convertTo12HourFormat(time24: string): string {
    if (!time24) return '';

    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (isNaN(hour) || isNaN(minute)) return '';

    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;

    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  export(ev){
    console.log(this.Item.ReportVal, ev);
    this.getData.emit(this.Item.ReportVal);
  }

}
