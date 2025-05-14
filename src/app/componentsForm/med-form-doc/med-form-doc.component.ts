import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { RtfService } from 'src/app/services/rtf.service';

@Component({
  selector: 'app-med-form-doc',
  templateUrl: './med-form-doc.component.html',
  styleUrls: ['./med-form-doc.component.scss'],
})
export class MedFormDocComponent implements OnInit {
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
    this.getDocInfo()
  }


  editor: Editor;
  toolbar: Toolbar = [
    // ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private rtf: RtfService,) { }

  ngOnInit() {
    this.editor = new Editor();
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  getDocInfo() {
    // this.DrInfo = ``;
    // let Info = this.all.tblDoctorsInfo.filter(x => x.IDP == event.IDDoctor);
    console.log(this.Item.ReportVal);
    if (this.Item?.ReportVal?.length > 0) {
      this.rtf.convertRtfToHtml(this.Item.ReportVal).then(html => {
        this.Item.ReportVal = html;
      });
    }

  }

  export(ev){
    console.log(this.Item.ReportVal);
    this.getData.emit(this.Item.ReportVal);
  }


  content: string = '';

  // onInput(event: any) {
  //   this.Item.ReportVal = event.target.innerHTML; // يحتوي على النص + التنسيق
  // }


  // wrapContent(event: KeyboardEvent) {
  //   console.log(event);
  //   const element = event.target as HTMLElement;
  //   setTimeout(() => {
  //     if (element.innerHTML.trim() === '') {
  //       element.innerHTML = '<div><br></div>';
  //       this.placeCaretAtEnd(element);
  //     }
  //   });
  // }

  // // وضع المؤشر في نهاية المحتوى
  // placeCaretAtEnd(el: HTMLElement) {
  //   const range = document.createRange();
  //   const sel = window.getSelection();
  //   range.selectNodeContents(el);
  //   range.collapse(false);
  //   sel?.removeAllRanges();
  //   sel?.addRange(range);
  // }
}
