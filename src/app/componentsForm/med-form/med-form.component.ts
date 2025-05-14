import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-med-form',
  templateUrl: './med-form.component.html',
  styleUrls: ['./med-form.component.scss'],
})
export class MedFormComponent implements OnInit {
  @Input() tblFormItems = [];
  @Input() tblFieldsMap = [];
  @Input() tblDiagnosis = [];
  @Input() IsPrinting = false;
  // idform = 1;
  // IDPatient = 100341410;// 100273773;
  // IDAppt = 0;

  // tblFormComps = [];


  // tblForms=[];
  // @Input() set SessionData(data: any) {
  //   console.log(this.tblFieldsMap);
  //   // alert(this.tblFieldsMap.length);
  //   console.log(`data= `, data);


  //   let OpenMedicalRecordSessionData = data;

  //   for (const key in OpenMedicalRecordSessionData) {
  //     if (OpenMedicalRecordSessionData.hasOwnProperty(key)) {

  //       if (this.isIDFormat(key) && OpenMedicalRecordSessionData[key] != 0) {
  //         let ID = key.split(`_`)[1];
  //         console.log(ID);
  //         let IDForm = this.tblFieldsMap.find(x => x.ID == ID).IDForm;

  //         if (!this.tblForms.find(x => x.IDForm == IDForm)) {
  //           let copyFieldsMapForm = this.all.deepCopy(this.tblFieldsMap.filter(x => x.IDForm == IDForm));
  //           this.tblForms.push({
  //             IDForm: IDForm,
  //             tblFormItems: copyFieldsMapForm
  //           });
  //         }

  //       }
  //     }
  //   }
  //   for (let form of this.tblForms) {
  //     for (let item of form.tblFormItems) {
  //       if (OpenMedicalRecordSessionData[`Report_${item.ID}`]) {
  //         item[`Report`] = OpenMedicalRecordSessionData[`Report_${item.ID}`]
  //       } else {
  //         item[`Report`] = ``;
  //       }
  //     }
  //   }
  // }

  constructor(public all: AllService) {

  }

  ngOnInit() {
    setTimeout(() => {
      // this.getFormData();
    }, 200);
  }

  getImageResult(ev, item) {
    console.log(`getImageResult= `, ev);
    const result = ev.map(item => item.data).join('\n');
    console.log(`result= `, result);
    item.Report = result;
  }

  

  isIDFormat(text) {
    return /^ID_\d+$/.test(text);
  }
  // isReportFormat(text) {
  //   return /^Report_\d+$/.test(text);
  // }

  // tblForms = [];
  // getFormData() {
  //   // let Query0 = `select * from FieldsMap where idform=${this.idform}`;
  //   let Query0 = `select * from FieldsMap`;
  //   // let Query1 = `Call OpenMedicalRecord(${this.all.User.IDC},${this.IDPatient},${this.IDAppt}, ${this.idform})`;
  //   let Query1 = `Call OpenMedicalRecord(1,100268151,0,0)`;
  //   // alert(Query1);
  //   let Query = `${Query0};${Query1}`;
  //   console.log(`Query= `, Query);

  //   const body = new HttpParams()
  //     .set('Mtype', 'A16')
  //     .set('Query', Query);

  //   this.all.postData(body).then(res => {
  //     if (res[`Q0Error`] != "") {
  //       this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
  //       console.log(`Q0Error= `, res[`Q0Error`]);
  //     }
  //     this.tblFieldsMap = res[`Q0`];
  //     this.tblFormComps = res[`Q1`];

  //     // alert(this.tblFormComps.length);

  //     let OpenMedicalRecordSessionData = this.tblFormComps[1];
  //     // alert( JSON.stringify(jsonObject ));
  //     this.FormRows = [];

  //     // alert(2);
  //     for (const key in OpenMedicalRecordSessionData) {
  //       if (OpenMedicalRecordSessionData.hasOwnProperty(key)) {
  //         // console.log(`المفتاح: ${key}, القيمة: ${jsonObject[key]}`);

  //         if (this.isIDFormat(key) && OpenMedicalRecordSessionData[key] != 0) {
  //           let ID = key.split(`_`)[1];
  //           console.log(ID);
  //           // let FieldsMap = this.all.deepCopy(this.tblFieldsMap.find(x => x.ID == ID));
  //           // FieldsMap[`ReportVal`] = jsonObject[`Report_${ID}`],
  //           // this.FormRows.push(FieldsMap);

  //           let IDForm = this.tblFieldsMap.find(x => x.ID == ID).IDForm;

  //           // console.log(copyFieldsMapForm);
  //           // alert(IDForm);

  //           if (!this.tblForms.find(x => x.IDForm == IDForm)) {
  //             let copyFieldsMapForm = this.all.deepCopy(this.tblFieldsMap.filter(x => x.IDForm == IDForm));
  //             // copyFieldsMapForm.filter(x => x.ID == ID)[0][`Report`] = jsonObject[key][`Report_${ID}`];

  //             // alert(IDForm);
  //             this.tblForms.push({
  //               IDForm: IDForm,
  //               tblFormItems: copyFieldsMapForm
  //             });
  //           }

  //         }
  //       }
  //     }
  //     for (let form of this.tblForms) {
  //       for (let item of form.tblFormItems) {
  //         if (OpenMedicalRecordSessionData[`Report_${item.ID}`]) {
  //           item[`Report`] = OpenMedicalRecordSessionData[`Report_${item.ID}`]
  //         } else {
  //           item[`Report`] = ``;
  //         }
  //       }
  //     }

  //     console.log(`tblForms= `, this.tblForms);
  //     console.log(`FormRows= `, this.FormRows);
  //     // for(let item of this.FormRows){
  //     //   if(!this.tblForms.find(x=>x.IDForm==item.IDForm)){
  //     //     this.tblForms.push({
  //     //       IDForm: item.IDForm,
  //     //       tblFormItems:this.tblFieldsMap.filter(x=>x.IDForm==item.IDForm)
  //     //     });
  //     //   }
  //     // }

  //   });
  // }


  getCheck(ev, item) {
    console.log(ev, item);
    item.Report = ev;
  }

  getCheckList(ev, item) {
    console.log(ev, item);
    item.Report = ev;
  }
  getCombo(ev, item) {
    console.log(ev, item);
    item.Report = ev;
  }
  getDateOrTime(ev, item) {
    
    item.Report = ev;
    console.log(ev, item);
  }

  getDoc(ev, item) {
    item.Report = ev;
    console.log(ev, item);
  }

  getICD10(ev, item) {
    item.Report = ev;
    console.log(ev, item);
  }

  getRadioList(ev, item) {
    item.Report = ev;
    console.log(ev, item);
  }

  getText(ev, item){
    item.Report = ev;
    console.log(item)
  }

  getPanel(ev, item){
    console.log(ev, item);
    item.Report = ev;
  }

  save(){
    console.log(this.tblFormItems);
  }
}
