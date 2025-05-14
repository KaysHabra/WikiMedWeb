import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-med-form-text',
  templateUrl: './med-form-text.component.html',
  styleUrls: ['./med-form-text.component.scss'],
})
export class MedFormTextComponent implements OnInit {
   @Output() getData: EventEmitter<any> = new EventEmitter<any>();

  @Input() Lang = `E`;
  @Input() IsPrinting = false;
  @Input() item = {
    "ID": 444,
    "IDForm": 1,
    "IDNature": 1,
    "IsDefault": 1,
    "Visible": 1,
    "SingleForm": 0,
    "FieldsGroupE": "General Form",
    "FieldsGroupA": "النموذج العام",
    "NameE": "NURSE’S FORM",
    "NameA": "نموذج التمريض",
    "FieldDataType": "Text",
    "FieldDataSize": 0,
    "FieldIsRequired": 0,
    "CharsInLine": 0,
    "LinesInHeight": 1,
    "DefaultColor": 12895487,
    "UserUnAllow": "",
    "Permissions": "",
    "AnswerTypes": "",
    "AnswerDegrees": 0,
    "HeaderDescriptions": "",
    "FooterDescriptions": "",
    "ListValues": "",
    "ListDefaultValue": -1,
    "GroupFields": "",
    "GroupColumns": 0,
    "GroupLines": 0,
    "Image": "",
    "DefaultDoc": "",
    "CalcName": "",
    Report: ""
  };
  constructor() { }

  ngOnInit() { }


  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  
  isPhoneNumber(text) {
    // تعريف التعبير المنتظم لرقم الهاتف
    // const phonePattern = /^(?:\+?\d{1,3})?[-.\s]?(?:\(\d{1,4}\))?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    // return phonePattern.test(text);
    const phonePattern = /^0\d{9}$/; // يبدأ بـ 0 ويتبعه 9 أرقام (إجمالي 10 خانات)
    return phonePattern.test(text);
  }

  isMoney(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const allowedChars = /[0-9.]/;

    // منع الأحرف غير المسموحة
    if (!allowedChars.test(event.key)) {
      event.preventDefault();
      return;
    }

    // منع إدخال أكثر من نقطة عشرية
    if (event.key === "." && input.value.includes(".")) {
      event.preventDefault();
    }
  }

  export(){
    this.getData.emit(this.item.Report);
  }
}
