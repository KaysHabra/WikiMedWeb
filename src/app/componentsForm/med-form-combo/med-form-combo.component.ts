import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-med-form-combo',
  templateUrl: './med-form-combo.component.html',
  styleUrls: ['./med-form-combo.component.scss'],
})
export class MedFormComboComponent implements OnInit {
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


  tblVals = [];
  Item = null;
  @Input()
  set item(data: any) {
    this.Item = data;
    this.tblVals = data.ListValues.split(/\r?\n/)         // تقسيم بناءً على \n أو \r\n
      .map(line => line.trim()) // حذف الفراغات و \r إن وجدت
      .filter(line => line !== ''); // تجاهل الأسطر الفارغة
    console.log(`this.tblVals= `, this.tblVals);


    for (let index = 0; index < this.tblVals.length; index++) {
      let line = this.tblVals[index];
      if (!line.includes(`=`)) {
        this.tblVals[index] = line + `=${index+1}`;
      }
    }
    this.tblVals = this.convertTextArrayToJson(this.tblVals);
    // alert(JSON.stringify(this.tblRadioVals));
  }
  constructor() { }

  ngOnInit() { }

  // options: string[] = ['Option 1', 'Option 2', 'Apple', 'Orange', 'Test'];
  // filteredOptions: string[] = [...this.options];
  // selectedItem: string = '';
  // showOptions = false;

  // filterOptions() {
  //   const query = this.selectedItem.toLowerCase();
  //   this.filteredOptions = this.options.filter(opt =>
  //     opt.toLowerCase().includes(query)
  //   );
  // }

  // selectOption(option: string) {
  //   this.selectedItem = option;
  //   this.showOptions = false;
  // }

  // hideOptionsDelayed() {
  //   // تأخير صغير حتى لا تختفي القائمة قبل تنفيذ (mousedown)
  //   setTimeout(() => {
  //     this.showOptions = false;
  //   }, 200);
  // }


  convertTextArrayToJson(textArray) {
    const jsonArray = [];
    for (const item of textArray) {
      const parts = item.split('=');
      if (parts.length === 2) {
        const label = parts[0].trim();
        const val = parseInt(parts[1].trim());
        jsonArray.push({ Label: label, Val: val });
      } else {
        console.warn(`Skipping invalid item: ${item}. Expected format 'Label=Value'.`);
      }
    }
    return jsonArray;
  }

  export(){
    this.getData.emit(this.Item.Report);
  }
}
