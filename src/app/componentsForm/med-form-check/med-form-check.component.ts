import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-med-form-check',
  templateUrl: './med-form-check.component.html',
  styleUrls: ['./med-form-check.component.scss'],
})
export class MedFormCheckComponent implements OnInit {
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

  Item: any = {};
  @Input()
  set item(data: any) {
    this.Item = data;
    // alert(data.Report);
    if (data.Report && +data.Report == 1) {
      this.Item[`ReportVal`] = 1;
    } else {
      this.Item[`ReportVal`] = 0;
    }
    // alert(this.Item.ReportVal);
  }

  constructor() { }

  ngOnInit() { }

  @Output() getData: EventEmitter<any> = new EventEmitter<any>();
  export() {

    if(this.Item.ReportVal==0){
      this.Item.ReportVal = 1;
    }else{
      this.Item.ReportVal = 0;
    }

    // this.Item.ReportVal = !this.Item.ReportVal;

    console.log(this.Item.ReportVal);
    this.getData.emit(this.Item.ReportVal);
  }

}
