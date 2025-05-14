import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-patient-illness',
  templateUrl: './patient-illness.page.html',
  styleUrls: ['./patient-illness.page.scss'],
})
export class PatientIllnessPage implements OnInit {
  tblIllnessType = [];
  tblPatientIllness = [];
  constructor(public all: AllService, private activatedRoute: ActivatedRoute, private nav: NavController) { }

  ngOnInit() {
   

    this.all.getfirstLoad().then(res => {
      if (res) {
        let idpatient = this.activatedRoute.snapshot.paramMap.get('idpatient');
        if (idpatient) {
          this.all.Patient = this.all.tblPatient.find(x=>x.IDP == +idpatient);
          this.getIllnessType(idpatient);
        }else{
          this.getIllnessType();
        }
        // alert(this.all.tblPatient.length);
        
        // // alert(this.all.RegisterData.CD_SreviceFilter);
        // this.CD_SreviceFilter = +this.all.RegisterData.CD_SreviceFilter;
        // this.getLoad();
        // this.tblDoctor = this.all.tblDoctors.filter(x => x.IsDoctor);
      }
    });
  }

  getIllnessType(idpatient = this.all.Patient.IDP) {
    console.log(`idpatient= `, idpatient);

    let Query0 = `select * from IllnessType`;
    let Query1 = `select * from PatientIllness
      where IDC=${this.all.User.IDC} and IDPatient=${idpatient}`;

    let Query = `${Query0};${Query1}`;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }

      this.tblIllnessType = res[`Q0`];
      this.tblPatientIllness = res[`Q1`];

    });
  }

  getPatientIllness(ev) {
    console.log(`ev= `, ev);

    this.getIllnessType();
  }

  cancel() {
    this.nav.back()
  }

  isInPatientIllness(item) {

    return this.tblPatientIllness.filter(x => x.IllnessType == item.ID).length > 0;
  }

  chkIllness(item) {
    console.log(item, this.tblPatientIllness);

    if (this.tblPatientIllness.filter(x => x.IllnessType == item.ID).length == 0) {
      this.tblPatientIllness.push({
        ID: 0,
        IDC: this.all.User.IDC,
        IDPatient: this.all.Patient.IDP,
        // IDClinicalNote:``, 
        IDUser: this.all.User.IDP,
        //ADate:, 
        IllnessType: item.ID,
        IllnessDesc: item.NameE,
        Warning: item.Warning,
        // LastModifyDate:, 
        // ModifyIDUser:, 
        // ModifyReason:
      });
    } else {
      this.tblPatientIllness = this.tblPatientIllness.filter(x => x.IllnessType != item.ID);
    }
  }

  savePatientIllness() {
    let Query0 = `delete from PatientIllness where IDC=${this.all.User.IDC} and IDPatient=${this.all.Patient.IDP}`;
    // -- _____________________
    // delete from PatientIllness where IDC=1 and IDPatient=100357138; -- ,0,51 
    // -- _____________________
    // Insert into PatientIllness (`IDC`,`IDPatient`,`IDClinicalNote`,`IDUser`,`ADate`,`IllnessType`,`IllnessDesc`,`Warning`,`LastModifyDate`,`ModifyIDUser`,`ModifyReason`) Values (1,100357138,0,17,"2025-04-27 13:45:49",10,"Work Related Accident",0,"2025-04-27 13:45:49",0,""); -- ,0,51 
    let IllnessInsert = ``;
    if (this.tblPatientIllness.length > 0) {
      IllnessInsert = `Insert into PatientIllness (IDC,IDPatient,IDClinicalNote,IDUser,ADate,IllnessType,IllnessDesc,Warning,LastModifyDate,ModifyIDUser,ModifyReason) Values `;
    }
    let i = 0;
    for (let il of this.tblPatientIllness) {
      IllnessInsert += i++ ? `,` : ``;
      IllnessInsert += `(${this.all.User.IDC},${this.all.Patient.IDP},0,${this.all.User.IDP},now(),${il.IllnessType},"${il.IllnessDesc}",${il.Warning},now(),0,"")`;
    }

    let Query = `[Call RunTranMulti('${Query0}|${IllnessInsert}')]`;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
        return;
      }
      this.all.ngxToast(`Saved Successfully`, '', 'success');

    });
  }
}
