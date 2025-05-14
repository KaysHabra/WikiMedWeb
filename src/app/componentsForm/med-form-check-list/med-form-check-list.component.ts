import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-med-form-check-list',
  templateUrl: './med-form-check-list.component.html',
  styleUrls: ['./med-form-check-list.component.scss'],
})
export class MedFormCheckListComponent implements OnInit {

  @Output() getData: EventEmitter<any> = new EventEmitter<any>();

  @Input() Lang = `E`;
  @Input() IsPrinting = false;


  tblVals = [];
  Item = null;
  tblRes = [];
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
    this.tblRes = data.Report.split(`,`).map(Number);
    this.tblVals = this.convertTextArrayToJson(this.tblVals);
    // alert(JSON.stringify(this.tblVals));
  }

  constructor() { }

  ngOnInit() { }

  export(){
    console.log(this.item);
    this.getData.emit(this.item);
  }

  onCheckboxChange(value: any, event: any) {
    const isChecked = event.target.checked;
    const index = this.tblRes.indexOf(value);

    if (isChecked && index === -1) {
      this.tblRes.push(value);
    } else if (!isChecked && index !== -1) {
      this.tblRes.splice(index, 1);
    }
    console.log(this.tblRes);
    this.getData.emit(this.tblRes.join(','));
  }

  isChecked(value) {
    // console.log(this.tblRes.indexOf(value));
    return this.tblRes.indexOf(value) != -1;
  }


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
}
