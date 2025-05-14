import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-med-form-icd10',
  templateUrl: './med-form-icd10.component.html',
  styleUrls: ['./med-form-icd10.component.scss'],
})
export class MedFormIcd10Component implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter<any>();

  @Input() Lang = `E`;
  @Input() SearchProp = `Diagnosis`;
  @Input() SearchProp2 = `Code`;
  @Input() ResProp = `ID`;
  @Input() IsPrinting = true;
  @Input() tblItem = [];

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

  tblVale = [];
  ICD10Item = null;
  @Input()
  set item(data: any) {
    this.ICD10Item = data;

    setTimeout(() => {
      let InRes = data.Report.split(`,`).map(Number);
      for (let n of InRes) {
        if(this.tblItem.find(x => x[this.SearchProp2] == n)){
          this.tblVale.push(this.tblItem.find(x => x[this.SearchProp2] == n));
        }
        
      }
      // console.log(this.tblItem);
      console.log(this.tblVale);
    }, 250);
    
    
  }
  // @Output() ResultSubmit = new EventEmitter<any>();
  constructor() { }

  ngOnInit() { }

  addItem(ev) {
    console.log(ev);
    this.tblVale.push(ev);
    console.log(this.tblVale);


    const codes = this.tblVale.map(item => item.Code);
    const result = codes.join(',');
    this.getData.emit(result);
  }

  remove(item) {
    this.tblVale = this.tblVale.filter(x => x[this.ResProp] != item[this.ResProp]);

    const codes = this.tblVale.map(item => item.Code);
    const result = codes.join(',');
    this.getData.emit(result);
  }
}
