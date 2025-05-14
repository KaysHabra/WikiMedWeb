import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { AllService } from 'src/app/services/all.service';
import { PatientAddEditComponent } from '../patient-add-edit/patient-add-edit.component';
import { HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ApptService } from 'src/app/services/appt.service';
import { DatetimeService } from 'src/app/services/datetime.service';

@Component({
  selector: 'app-new-app',
  templateUrl: './new-app.component.html',
  styleUrls: ['./new-app.component.scss'],
})
export class NewAppComponent implements OnInit {


  // IDPAppt = 0;
  @Input("IsNew") IsNew: any = true;
  @Input("Appointments") Appointments: any = null;
  @Input("tblMedicalProcedures") tblMedicalProcedures: any = [];
  @Input("tblPatientsblacklist") tblPatientsblacklist: any = [];
  @Input("tblPatientcommunication") tblPatientcommunication: any = [];

  @Input("StartDate") StartDate: any;
  @Input("tblService") tblService: any = [];
  @Input("tblOR") tblOR: any = [];
  @Input("tblOfferPkg") tblOfferPkg: any = [];
  @Input("tblBranch") tblBranch: any;
  @Input("Patient") Patient: any;
  @Input("Duration") Duration: any;
  @Input("tblAnesthetist") tblAnesthetist: any = [];
  @Input("AType") AType: any;
  @Input("IDDoctor") IDDoctor: any = 0;
  @Input("IDRoom") IDRoom: any = 0;
  @Input("IsOnCall") IsOnCall: any = 0;
  @Input("IsWalk") IsWalk: any = 0;

  @Input("tblPatientSmsData") tblPatientSmsData: any = 0;
  @Input("tblTextTemplate") tblTextTemplate: any = 0;


  tblBedRoom = [];
  // OperatingRoom = {
  //   IDP: 0
  // };
  BedRoom = {
    IDP: 0
  };
  Anesthetist = {
    IDP: 0,
  }
  OfferPkg = {
    IDP: 0
  }

  // Call Run('NewAppointment(68728898,1,1,11,0,17,2,0,0,100357137,0,0,0,"2025-03-17 21:30:00","",15,6,0,"00:00:00","00:00:00","00:00:00",3,0,0,5210239,0,0,"2025-03-17 19:06:59",17,0,"0","")'); 
  // Call Run('NewAppointment(11654854,1,1,11,0,17,2,0,0,100357137,0,0,0,"2025-03-17 21:40:00","",15,6,0,"00:00:00","00:00:00","00:00:00",3,0,0,5210249,0,0,"2025-03-17 19:07:46",17,0,"0","")'); 

  readyVars() {
    // alert(this.IsWalk);
    // this.Appointments.IDOperatingRoom = this.IDRoom;
    // if (this.tblOR.length > 0 && this.tblOR.filter(x => x.IDP == 0).length > 0) {
    //   this.OperatingRoom = this.tblOR.filter(x => x.IDP == 0)[0];
    // }
    if (this.tblAnesthetist.length > 0 && this.tblAnesthetist.filter(x => x.IDP == 0).length > 0) {
      this.Anesthetist = this.tblAnesthetist.filter(x => x.IDP == 0)[0];
    }
    if (this.tblOfferPkg.length > 0 && this.tblOfferPkg.filter(x => x.IDP == 0).length > 0) {
      this.OfferPkg = this.tblOfferPkg.filter(x => x.IDP == 0)[0];
    }
    this.Appointments = {
      IDP: 0,
      IDOperatingRoom: this.IDRoom,
      Deleted: 0,
    };
  }

  VisitType = 0;

  getDoctor() {
    const doctor = this.all.tblDoctors.filter(x => x.IDP == this.IDDoctor)[0];
    return doctor || "";
    // if(this.IDDoctor==0) return "";
    // if(this.all.tblDoctors.filter(x=>x.IDDoctor == this.IDDoctor).length==0){
    //   return "";
    // }else{
    //   return this.all.tblDoctors.filter(x=>x.IDDoctor == this.IDDoctor)[0];
    // }
  }

  options = [
    { id: 1, NameA: 'Apple' },
    { id: 2, NameA: 'Banana' },
    { id: 3, NameA: 'Cherry' },
    { id: 4, NameA: 'Date' },
    { id: 5, NameA: 'Fig' }
  ];

  // App = {
  //   ID: 0,
  //   IDP: 0,
  //   Duration: 15,
  // };
  AttendTime = '12:13 AM'; AttendEnter = '12:13 AM'; AttendOut = '12:13 AM';

  // DoctorApproved = false;

  tblSelService = [];
  SelectedService;
  Description = ``;

  getBranchName() {
    if (this.Appointments && this.Appointments.IDBranch > 0) {
      return this.all.tblBranch.filter(x => x.IDP == this.Appointments.IDBranch)[0]['Name' + this.all.LangLetter];
    } else {
      return this.all.tblBranch.filter(x => x.IDP == this.all.RegisterData.Branch)[0]['Name' + this.all.LangLetter];
    }
  }
  cancelTime() { } handleTimeChange(event) { }
  constructor(public all: AllService, private modalCtrl: ModalController,
    private translate: TranslateService, private apptService: ApptService,
    private alertController: AlertController, private popoverController: PopoverController,
    public datetimeService: DatetimeService,
  ) { }

  ngOnInit() {
    // alert(this.Appointments);
    // alert(this.IsNew);
    // alert(this.IDRoom);
    if (this.IsNew) {
      this.readyVars();
    } else {

      // this.OperatingRoom = this.tblOR.find(x => x.IDP == this.Appointments.IDOperatingRoom);
      // if (this.Appointments.IDOperatingRoom > 0) {
      //   this.OperatingRoom = this.tblOR.filter(x => x.IDP == 0)[0];
      // } else if (this.tblOR.length > 0 && this.tblOR.filter(x => x.IDP == 0).length > 0) {
      //   this.OperatingRoom = this.tblOR.filter(x => x.IDP == 0)[0];
      // }

      if (this.Appointments.IDAnesthetist > 0) {
        this.Anesthetist = this.tblAnesthetist.find(x => x.IDP == this.Appointments.IDAnesthetist);
      } else if (this.tblAnesthetist.length > 0 && this.tblAnesthetist.filter(x => x.IDP == 0).length > 0) {
        this.Anesthetist = this.tblAnesthetist.filter(x => x.IDP == 0)[0];
      }
      if (this.Appointments.IDAgreement > 0) {
        this.OfferPkg = this.tblOfferPkg.find(x => x.IDP == this.Appointments.IDAgreement);
      } else if (this.tblOfferPkg.length > 0 && this.tblOfferPkg.filter(x => x.IDP == 0).length > 0) {
        this.OfferPkg = this.tblOfferPkg.filter(x => x.IDP == 0)[0];
      }

      // alert(this.Appointments.Description);
      this.VisitType = this.Appointments.VisitType;
      this.Description = this.Appointments.Description;
      this.Duration = this.Appointments.Duration;

      // AttendTime = '12:13 AM'; AttendEnter = '12:13 AM'; AttendOut = '12:13 AM';
      this.AttendTime = this.Appointments.AttendTime;
      this.AttendEnter = this.Appointments.AttendEnter;
      this.AttendOut = this.Appointments.AttendOut;

      // this.AttendEnter = this.all.convertTo12HourFormat(this.Appointments.AttendEnter);
      // this.AttendOut = this.all.convertTo12HourFormat(this.Appointments.AttendOut);

      for (let item of this.tblMedicalProcedures) {
        let service = this.tblService.find(x => x.IDP == item.IDItem);
        if (service) {
          this.tblSelService.push(service);
        }
      }
    }
    // alert(JSON.stringify(this.Patient));
    console.log(`StartDate= `, this.StartDate);
  }

  addService() {
    console.log(this.SelectedService);
    if (this.SelectedService) {
      this.tblSelService.push(this.SelectedService);
    }
  }

  removeService(item) {
    this.tblSelService = this.tblSelService.filter(x => x.IDP != item.IDP);
  }
  removeAllService() {
    this.tblSelService = [];
  }

  // getInvitedPatient(ev) {
  //   console.log(`ev= `, ev);
  //   console.log(`OR= `, this.OR);
  // }

  getResult(event: any) {
    console.log(`event= `, event);
  }

  save() {
    // Call Run('NewAppointment(48135937,1,2,16,0,17,1112,0,0,300125556,0,0,0,"2025-02-15 11:15:00","",15,6,13,"00:00:00","00:00:00","00:00:00",0,0,0,5210848,0,0,"2025-02-14 19:54:17",17,0,"13","")')
    // Call Run('NewAppointment(79413196,1,2,16,0,17,1112,0,0,2225237,0,0,0,"2025-02-15 11:30:00","",45,6,15,"00:00:00","00:00:00","00:00:00",0,0,0,5211094,0,0,"2025-02-14 19:55:15",17,0,"15,16,16",",,")');

    // Select count(*) v from patientsblacklist where IDC=1 and IDPatient=300125555 and (1112=0 or IDDoctor in (0,1112) ); -- ,0,51 ; -- [125]
    // -- _____________________
    // Call Run('NewAppointment(17171332,1,2,16,0,17,1112,0,0,300125555,0,0,0,"2025-02-15 11:15:00","",30,0,0,"00:00:00","00:00:00","00:00:00",0,0,0,5210548,0,0,"2025-02-13 21:20:57",17,0,"0","")'); -- ,0,51 
    // -- _____________________
    // Select Result,WarningMessage,StoredStatus from storedResult where Random=17171332 group by ID order by id desc limit 1; -- ,0,51 ; -- [203]
    // -- _____________________
    // SELECT * FROM MedicalProcedures
    // where IDC=1 and IDAppointment=3942492; -- ,0,51 ; -- [172]
    let ADate = this.datetimeService.getDateTimeWithoutSecound(this.StartDate);
    // alert(ADate);
    let IDProcedure = 0;
    let ProceduresD = ``;
    let DescriptionD = ``;
    if (this.tblSelService.length > 0) {
      IDProcedure = this.tblSelService[0].IDP;
      for (let p of this.tblSelService) {
        if (ProceduresD.length > 0) {
          ProceduresD += `,`;
          DescriptionD += `,`;
        }
        ProceduresD += `${p.IDP}`;
      }
    } else {
      ProceduresD = `0`;
    }


    let RandomNo = this.all.generateRandomNumber(8);
    let IDY = this.all.RegisterData.FinancialYear;
    if (!this.IsNew) {
      IDY = this.Appointments.IDY;
    }

    //            Call Run('NewAppointment(68728898,    1,                  1,                                11,       0,                    17,
    // 2,             0,      0,                100357137,            0,                                  0,                    0
    // ,"2025-03-17 21:30:00","",         15,               6,
    // 0,
    // "00:00:00","00:00:00","00:00:00",
    // 3,
    // 0, 0,  5210239,  0,0,"2025-03-17 19:06:59",17,0,"0","")'); 
    let Query0 = `Call Run('NewAppointment(${RandomNo},${this.all.User.IDC},${this.all.RegisterData.Branch},${IDY},${this.Appointments.IDP},${this.all.User.IDP},
      ${this.IDDoctor},0,${this.OfferPkg.IDP},${this.Patient.IDP},${this.Appointments.IDOperatingRoom},${this.BedRoom.IDP},${this.Anesthetist.IDP},
      "${ADate}","${this.Description}",${this.Duration},${this.VisitType},
      ${IDProcedure},
      "00:00:00",
      "00:00:00",
      "00:00:00",
      ${this.IsWalk == 0 ? this.AType : 3},
      0,${this.IsOnCall},0,0,0,now(),${this.all.User.IDP},0,"${ProceduresD}","${DescriptionD}")')`;
    let Query1 = `Select Result,WarningMessage,StoredStatus from storedResult where Random=${RandomNo} group by ID order by id desc limit 1`

    let Query = `[${Query0}];${Query1}`;
    console.log(`Query0= `, Query0);
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      // if (res[`Q0Error`] != "") {
      //   this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
      //   console.log(`Q0Error= `, res[`Q0Error`]);
      // }
      if (res[`Q1Error`] != "") {
        this.all.ngxToast(`Q1Error= `, res[`Q1Error`], `warning`);
        console.log(`Q1Error= `, res[`Q1Error`]);
      }

      console.log(`res= `, res);
      console.log(`Q0= `, res[`Q0`]);
      console.log(`Q1= `, res[`Q1`]);
      let Result = res[`Q1`][0].Result;
      // alert(Result);
      if (Result > 0 && res[`Q1`][0].StoredStatus == "Done") {
        this.all.ngxToast(`Saved Successfully`, '', 'success');
        // 3942501
        this.modalCtrl.dismiss({ Saved: true }, 'confirm');
      } else {
        this.all.alert(this.apptService.errorSavedResult(`ar`, Result));
        // alert( this.errorSavedResult(this.all.SelectedLang, Result) )
      }
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  formatTime(dateString: any) {
    const date = new Date(dateString);

    // الحصول على الأجزاء المختلفة من التاريخ
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours: any = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // تحديد am أو pm
    const ampm = hours >= 12 ? "pm" : "am";

    // تحويل الساعة إلى صيغة 12 ساعة
    hours = hours % 12 || 12; // إذا كانت الساعة 0، اجعلها 12
    hours = String(hours).padStart(2, "0");

    // تركيب النص النهائي
    return `${hours}:${minutes} ${ampm}`;
  }


  // formatDate(dateString: any) {
  //   const date = new Date(dateString);

  //   // الحصول على الأجزاء المختلفة من التاريخ
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");

  //   let hours: any = date.getHours();
  //   const minutes = String(date.getMinutes()).padStart(2, "0");

  //   // تحديد am أو pm
  //   const ampm = hours >= 12 ? "pm" : "am";

  //   // تحويل الساعة إلى صيغة 12 ساعة
  //   hours = hours % 12 || 12; // إذا كانت الساعة 0، اجعلها 12
  //   hours = String(hours).padStart(2, "0");

  //   // تركيب النص النهائي
  //   return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  // }


  async newPatient() {
    const modal = await this.modalCtrl.create({
      component: PatientAddEditComponent,
      backdropDismiss: false,
      cssClass: 'new-patient-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.Patient = data.Patient;

    }
  }






  restAllAttend() {


    this.all.confirm(this.translate.instant(`Are you sure you want to do the operation?`)).then(yes => {
      if (yes) {
        let Query0 = `update appointments  set
        AttendTime = '0:0:0',
        AttendEnter = '0:0:0',
        AttendOut = '0:0:0',
        Attend = '0',
        Enter = '0',
        AOut = '0',
        AttendUser = '0',
        EnterUser = '0',
        OutUser = '0'
        where ID = ${this.Appointments.ID}`;

        let Query1 = `SELECT AttendTime, AttendEnter, AttendOut, Attend, Enter, AOut, AttendUser, EnterUser, OutUser
        FROM appointments
        where ID = ${this.Appointments.ID}`;
        console.log(`Query1= `, Query1);

        let Query = `[${Query0}];${Query1}`;

        const body = new HttpParams()
          .set('Mtype', 'A16')
          .set('Query', Query);

        this.all.postData(body).then(res => {
          // if (res[`Q0Error`] != "") {
          //   this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
          //   console.log(`Q0Error= `, res[`Q0Error`]);
          //   return;
          // }
          let NewData = res[`Q1`][0];
          console.log(`NewData= `, NewData);
          if (NewData.Attend == 0 && NewData.AttendTime == "00:00:00") {
            this.all.ngxToast(`Saved Successfully`, '', 'success');
            this.modalCtrl.dismiss({ Saved: true }, 'confirm');
          } else {
            this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
          }

        });
      }
    });

  }

  // setAttendedTimeNow() {
  //   this.AttendTime = this.all.getTimeWithoutSecound(new Date());
  // }
  // setAttendedEnterNow() {
  //   this.AttendEnter = this.all.getTimeWithoutSecound(new Date());
  // }
  // setAttendedOutNow() {
  //   this.AttendOut = this.all.getTimeWithoutSecound(new Date());
  // }

  getIDMainPatientsAcc() {
    return new Promise(resolve => {
      if (this.Patient.SavedFileNo == 0) {
        resolve(0);
      }
      let Query = `select IDMainPatientsAcc from Branchs b where b.IDC=${this.all.User.IDC} and b.IDP=${this.Appointments.IDBranch}`;
      console.log(`Query= `, Query);

      const body = new HttpParams()
        .set('Mtype', 'A16')
        .set('Query', Query);

      this.all.postData(body).then(res => {
        console.log(res);
        if (res[`Q0Error`] != "") {
          resolve(0);
        }

        let IDMainPatientsAcc = res[`Q0`][0].IDMainPatientsAcc;
        resolve(IDMainPatientsAcc);
      });
    });
  }

  setAttendedTime() {
    // حضور لمريض ليس لديه ملف

    // update `appointments`  set
    //  `AttendTime` = '2:3:35',
    //  `Attend` = '1',
    //  `AttendUser` = '17'
    // where
    //  `ID` = '1530491'; 


    // -- _____________________
    // Call UpdatePatientColorPoints(1 ,100357138); -- ,0,51 Patient.IDP
    // -- _____________________
    // select IDMainPatientsAcc from Branchs b where b.IDC=1 and b.IDP=1; -- ,0,51 ; -- [140]
    // -- _____________________
    // Call CreatePatientFileNo (1,8,100357138); -- ,0,51 ; -- [1500]

    // alert(this.Patient.SavedFileNo);
    // return;

    this.AttendTime = this.all.getTimeWithoutSecound(new Date());
    console.log(this.AttendTime);

    let Query = ``;

    this.getIDMainPatientsAcc().then(IDMainPatientsAcc => {
      // alert(IDMainPatientsAcc);return;
      if (this.Patient.SavedFileNo == 0) {
        let Query0 = `update appointments  set
          AttendTime = '${this.AttendTime}',
          Attend = '1',
          AttendUser = '${this.all.User.IDP}'
          where ID = ${this.Appointments.ID}`;

        let Query1 = `SELECT AttendTime, AttendEnter, AttendOut, Attend, Enter, AOut, AttendUser, EnterUser, OutUser
          FROM appointments
          where ID = ${this.Appointments.ID}`;

        let Query2 = `Call UpdatePatientColorPoints(${this.all.User.IDC} ,${this.Patient.IDP})`;
        let Query3 = `Call CreatePatientFileNo (${this.all.User.IDC},${IDMainPatientsAcc},${this.Patient.IDP})`;
        Query = `[${Query0}];${Query1};[${Query2}];[${Query3}]`;
      } else {
        let Query0 = `update appointments  set
        AttendTime = '${this.AttendTime}',
        Attend = '1',
        AttendUser = '${this.all.User.IDP}'
        where ID = ${this.Appointments.ID}`;

        let Query1 = `SELECT AttendTime, AttendEnter, AttendOut, Attend, Enter, AOut, AttendUser, EnterUser, OutUser
          FROM appointments
          where ID = ${this.Appointments.ID}`;
        Query = `[${Query0}];${Query1}`;
      }

      console.log(`Query= `, Query);

      const body = new HttpParams()
        .set('Mtype', 'A16')
        .set('Query', Query);

      this.all.postData(body).then(res => {
        if (res[`Q0Error`] != "") {
          this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
          console.log(`Q0Error= `, res[`Q0Error`]);
        }
        if (res[`Q1Error`] != "") {
          this.all.ngxToast(`Q1Error= `, res[`Q1Error`], `warning`);
          console.log(`Q1Error= `, res[`Q1Error`]);
        }

        let NewData = res[`Q1`][0];
        console.log(`NewData= `, NewData);
        if (NewData.Attend == 1) {
          this.all.ngxToast(`Saved Successfully`, '', 'success');
          this.modalCtrl.dismiss({ Saved: true }, 'confirm');
        } else {
          this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        }
      });
    });







    // let Query0 = `update appointments  set
    // AttendTime = '${this.AttendTime}',
    // Attend = '1',
    // AttendUser = '${this.all.User.IDP}'
    // where ID = ${this.Appointments.ID}`;

    // let Query1 = `Call UpdatePatientColorPoints(1 ,${this.Patient.IDP})`;
    // let Query2 = `Call CreatePatientFileNo (${this.all.User.IDC},8,${this.Patient.IDP})`;


    // let Query3 = `SELECT AttendTime, AttendEnter, AttendOut, Attend, Enter, AOut, AttendUser, EnterUser, OutUser
    //     FROM appointments
    //     where ID = ${this.Appointments.ID}`;

    // let Query = `[${Query0}];${Query1}`;
    // console.log(`Query= `, Query);

    // const body = new HttpParams()
    //   .set('Mtype', 'A16')
    //   .set('Query', Query);

    // this.all.postData(body).then(res => {
    //   let NewData = res[`Q3`][0];
    //   console.log(`NewData= `, NewData);
    //   if (NewData.Attend == 1) {
    //     this.all.ngxToast(`Saved Successfully`, '', 'success');
    //     this.modalCtrl.dismiss({ Saved: true }, 'confirm');
    //   } else {
    //     this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
    //   }
    // });
  }

  setAttendedEnter() {
    this.AttendEnter = this.all.getTimeWithoutSecound(new Date());

    let Query0 = `update appointments  set
    AttendEnter = '${this.AttendEnter}',
    Enter = '1',
    EnterUser = ${this.all.User.IDP}
    where ${this.Appointments.ID}`;

    let Query1 = `SELECT AttendTime, AttendEnter, AttendOut, Attend, Enter, AOut, AttendUser, EnterUser, OutUser
        FROM appointments
        where ID = ${this.Appointments.ID}`;

    let Query = `[${Query0}];${Query1}`;

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      let NewData = res[`Q1`][0];
      console.log(`NewData= `, NewData);
      if (NewData.Enter == 1) {
        this.all.ngxToast(`Saved Successfully`, '', 'success');
        this.modalCtrl.dismiss({ Saved: true }, 'confirm');
      } else {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
      }
    });
  }

  setAttendedOut() {
    this.AttendOut = this.all.getTimeWithoutSecound(new Date());
    let Query0 = `update appointments  set
      AttendOut = '${this.AttendOut}',
      AOut = '1',
      OutUser = ${this.all.User.IDP}
      where
      ID = ${this.Appointments.ID}`;

    let Query1 = `SELECT AttendTime, AttendEnter, AttendOut, Attend, Enter, AOut, AttendUser, EnterUser, OutUser
        FROM appointments
        where ID = ${this.Appointments.ID}`;

    let Query = `[${Query0}];${Query1}`;

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      let NewData = res[`Q1`][0];
      console.log(`NewData= `, NewData);
      if (NewData.AOut == 1) {
        this.all.ngxToast(`Saved Successfully`, '', 'success');
        this.modalCtrl.dismiss({ Saved: true }, 'confirm');
      } else {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
      }
    });
  }

  delAppt() {
    this.popoverController.dismiss();
    // Are you sure you want to Permanently Restore [UnDelete] this?": "Are you sure you want to Permanently Restore [UnDelete] this?",
    // "Select why you need to Delete this appointment": "Select why you need to Delete this appointment",
    // "Delete and call later": "Delete and call later",
    // "Delete and do not call (Patient request)": "Delete and do not call (Patient request)",
    // "Old software wrong appointment": "Old software wrong appointment",
    // "Duplicate Appointment Patient already": "Duplicate Appointment Patient already",

    // return new Promise(resolve => {
    this.alertController.create({
      header: this.all.translate.instant(`Select why you need to Delete this appointment`),
      // message: this.all.translate.instant(`Select why you need to Delete this appointment`),
      cssClass: `delete-event-alert`,
      inputs: [
        {
          label: this.all.translate.instant(`Delete and call later`),
          type: 'radio',
          value: 4,
        },
        {
          label: this.all.translate.instant(`Delete and do not call (Patient request)`),
          type: 'radio',
          value: 5,
        },
        {
          label: this.all.translate.instant(`Old software wrong appointment`),
          type: 'radio',
          value: 6,
        },
        {
          label: this.all.translate.instant(`Duplicate Appointment Patient already`),
          type: 'radio',
          value: 7,
        },
      ],
      buttons: [
        {
          text: `Cancel`,
          cssClass: 'alert-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            // resolve(false);
          }
        }, {
          cssClass: 'alert-button-confirm',
          text: `OK`,
          handler: (reason) => {
            console.log('reason= ', reason);
            this.delApptExe(reason);


            // resolve(data);
          }
        }
      ]
    }).then((confirm) => {
      confirm.present();
    });
    // });





    // this.all.confirm(this.all.translate.instant(`Are you sure you want to delete?`)).then(yes => {
    //   if (yes) {
    //     let Query = `Update appointments set Deleted=1,ChangeReason=4,IDUser=17 Where (IDC,IDY,IDP)=(${this.all.User.IDC},${this.all.RegisterData.FinancialYear},${this.Appointments.IDP})`;
    //     console.log(`Query= `, Query);

    //     const body = new HttpParams()
    //       .set('Mtype', 'A16')
    //       .set('Query', Query);

    //     this.all.postData(body).then(res => {
    //       // if (res[`Q0Error`] != "") {
    //       //   this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
    //       //   console.log(`Q0Error= `, res[`Q0Error`]);
    //       // }
    //       this.modalCtrl.dismiss({ Deleted: true }, 'confirm');

    //     });
    //   }
    // });
  }

  delApptExe(reason) {
    let Query0 = `Update appointments set Deleted=1,ChangeReason=${reason},IDUser=${this.all.User.IDP} Where (IDC,IDY,IDP)=(${this.all.User.IDC},${this.all.RegisterData.FinancialYear},${this.Appointments.IDP})`;
    let Query = `[${Query0}]`;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      // if (res[`Q0Error`] != "") {
      //   this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
      //   console.log(`Q0Error= `, res[`Q0Error`]);
      // }
      this.modalCtrl.dismiss({ Deleted: true }, 'confirm');

    });
  }

  recoverAppt() {
    this.popoverController.dismiss();
    this.all.confirm(this.all.translate.instant(`Are you sure you want to Permanently Restore [UnDelete] this?`)).then(yes => {
      if (yes) {
        let Query0 = `Update appointments set Deleted=0 Where (IDC,IDY,IDP)=(${this.all.User.IDC},${this.all.RegisterData.FinancialYear},${this.Appointments.IDP})`;
        let Query = `[${Query0}]`;
        console.log(`Query= `, Query);

        const body = new HttpParams()
          .set('Mtype', 'A16')
          .set('Query', Query);

        this.all.postData(body).then(res => {
          // if (res[`Q0Error`] != "") {
          //   this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
          //   console.log(`Q0Error= `, res[`Q0Error`]);
          // }
          this.modalCtrl.dismiss({ Recovered: true }, 'confirm');

        });
      }
    });
  }

  copyConfirmLink() {
    this.popoverController.dismiss();
  }

  isSmsModalOpen = false; isSmsTempModal = false;
  SelectedSms = null;
  SmsTempVar = {
    ADate: ``,
    ATime: ``,
    AType: ``,
    NameA: ``,
    NameE: ``,
    PFirstNameA: ``,
    PFirstNameE: ``,
    PLastNameA: ``,
    PLastNameE: ``,
    DName: ``,
    SName: ``,
    OName: ``,
    User: ``,
    Now: ``,
    DateTime: ``,
    Time: ``,
    Date: ``,
    DayName: ``,
    Phone1: ``,
    Phone2: ``,
    Phone3: ``,
    FileNo: ``,
    IDPatient: ``,
    IDAppointment: ``,
    AddConfirmingWebPage: ``,
  };
  // TemplateSms = ``;

  getOperatingRoom() {
    // Appointments.IDOperatingRoom
    const op = this.tblOR.filter(x => x.IDP == this.Appointments.IDOperatingRoom)[0];
    return op || "";
  }

  sendSmsModal() {
    this.popoverController.dismiss();
    this.isSmsModalOpen = true;
    // alert(JSON.stringify(this.Patient));
    console.log(`this.tblTextTemplate= `, this.tblTextTemplate);
    this.SmsTempVar = {
      ADate: this.datetimeService.formatDateTimeAmPm(this.StartDate),
      ATime: this.datetimeService.formatTimeAmPm(this.StartDate),
      AType: this.AType,
      NameA: this.Patient.NameA,
      NameE: this.Patient.NameE,
      PFirstNameA: this.Patient.NameA.split(` `)[0],
      PFirstNameE: this.Patient.NameE.split(` `)[0],
      PLastNameA: this.Patient.NameA.split(` `)[this.Patient.NameA.split(` `).length - 1],
      PLastNameE: this.Patient.NameE.split(` `)[this.Patient.NameE.split(` `).length - 1],
      DName: this.getDoctor()['Name' + this.all.LangLetter],
      SName: this.getDoctor().SName,
      OName: this.getOperatingRoom()['Name' + this.all.LangLetter],
      User: ``,
      Now: this.datetimeService.formatDateTimeAmPm(new Date()),
      DateTime: this.datetimeService.formatDateTimeAmPm(new Date()),
      Time: this.datetimeService.formatTimeAmPm(new Date()),
      Date: this.datetimeService.formatDateTimeAmPm(new Date()),
      DayName: this.all.getDateNow(`-`),
      Phone1: this.Patient.Phon1,
      Phone2: this.Patient.Phon2,
      Phone3: this.Patient.Phon3,
      FileNo: this.Patient.SavedFileNo,
      IDPatient: this.Patient.IDP,
      IDAppointment: this.Appointments.IDP,
      AddConfirmingWebPage: this.all.RegisterData.DominName + `/?MType=90&HCode=${this.all.User.HCode}&IDAppointment=${this.Appointments.IDP}`,
    };
  }

  SmsTemplate = {
    "ID": 0,
    "Group": "SMS_Appointments",
    "NameE": "",
    "NameA": "",
    "TextTemp": "",
  };
  SmsTempIndex = 0;
  nextTemp(no) {
    if (this.tblTextTemplate.length == 0) return;
    // let index = this.tblTextTemplate.findIndex(item => item.ID == this.SmsTemplate.ID);
    // if (!index) {
    //   index = this.tblTextTemplate.length - 1;
    // }

    switch (no) {
      case 1: // first
        this.SmsTempIndex = 0;
        // this.SmsTemplate = this.tblTextTemplate[0];
        break;
      case 2: // Previous
        this.SmsTempIndex--;
        // this.SmsTemplate = this.tblTextTemplate[--this.SmsTempIndex];
        break;
      case 3: // Next
        this.SmsTempIndex++;
        // this.SmsTemplate = this.tblTextTemplate[++this.SmsTempIndex];
        break;
      case 4: // Last
        this.SmsTempIndex = this.tblTextTemplate.length - 1;
        // this.SmsTemplate = this.tblTextTemplate[this.tblTextTemplate.length - 1];
        break;
    }
    this.SmsTemplate = this.tblTextTemplate[this.SmsTempIndex];
  }

  editSms() {
    this.SmsTemplate = {
      "ID": 0,
      "Group": "SMS_Appointments",
      "NameE": "",
      "NameA": "",
      "TextTemp": "",
    };
    this.SmsTempIndex = 0;
    if (this.SelectedSms) {
      this.SmsTemplate = this.all.deepCopy(this.tblTextTemplate.find(item => item.ID == this.SelectedSms.ID));
      this.SmsTempIndex = this.tblTextTemplate.findIndex(item => item.ID == this.SelectedSms.ID);
    } else if (this.tblTextTemplate.length > 0) {
      this.SmsTemplate = this.all.deepCopy(this.tblTextTemplate[0]);
    }

    this.isSmsTempModal = true;
  }

  newSmsTemp() {
    this.SmsTemplate = {
      "ID": 0,
      "Group": "SMS_Appointments",
      "NameE": "",
      "NameA": "",
      "TextTemp": "",
    };
  }

  sendSMS() {
    let Query = ``;

    let Query0 = ``;
    if (this.SmsTemplate.ID == 0) {
      Query0 = `insert into texttemplate 
      (ID, ${'`Group`'}, NameE, NameA, TextTemp, LastModifyDate, ModifyIDUser, ModifyReason)
      values
      ('0', '${this.SmsTemplate.Group}', '${this.SmsTemplate.NameE}', '${this.SmsTemplate.NameA}', '${this.SmsTemplate.TextTemp}', now(), '0', '')`;
      let Query1 = `SELECT LAST_INSERT_ID()`;

      Query = `[${Query0}];${Query1}`;

    } else {
      Query0 = `update texttemplate  set
        TextTemp = '${this.SmsTemplate.TextTemp}', 
        ${'`Group`'} = '${this.SmsTemplate.Group}',
        NameE = '${this.SmsTemplate.NameE}',
        NameA = '${this.SmsTemplate.NameA}'
        where
        ID = '${this.SmsTemplate.ID}'`;
      Query = `[${Query0}]`;
    }
    console.log(`Query0= `, Query0);

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
        return;
      }
      this.all.ngxToast(`Saved Successfully`, '', 'success');

      if (this.SmsTemplate.ID > 0) {
        let index = this.tblTextTemplate.find(x => x.ID == this.SmsTemplate.ID);
        this.tblTextTemplate[index] = this.SmsTemplate;
      } else {
        let ID = res[`Q1`];
        this.SmsTemplate.ID = ID;
        this.tblTextTemplate.push(this.SmsTemplate);
      }


      this.isSmsTempModal = false;
    });
  }

  delSmsTemp() {
    this.all.confirm(this.translate.instant(`Are you sure you want to do the operation?`)).then(yes => {
      if (yes) {
        let Query0 = `delete from texttemplate  set
        where ID = '${this.SmsTemplate.ID}'`;
        let Query = `[${Query0}]`;

        console.log(`Query= `, Query);

        const body = new HttpParams()
          .set('Mtype', 'A16')
          .set('Query', Query);

        this.all.postData(body).then(res => {
          if (res[`Q0Error`] != "") {
            this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
            console.log(`Q0Error= `, res[`Q0Error`]);
            return;
          }
          this.all.ngxToast(`Deleted Successfully`, '', 'success');

          this.isSmsTempModal = false;
        });
      }
    });
  }

  isMeetModalOpen = false;
  MeetData = {
    Join_Url: ``,
    Host_Email: ``,
    Description: ``,
  };
  meet() {
    this.popoverController.dismiss();
    this.isMeetModalOpen = true;
  }

  replacePlaceholders(template, variables) {
    return template.replace(/%(\w+)/g, (_, key) => {
      return key in variables ? variables[key] : `%${key}`;
    });
  }
}

// حضور لمريض ليس لديه ملف

// update `appointments`  set
//  `AttendTime` = '2:3:35',
//  `Attend` = '1',
//  `AttendUser` = '17'
// where
//  `ID` = '1530491' and
// ; -- ,0,51


// -- _____________________
// Call UpdatePatientColorPoints(1 ,100357138); -- ,0,51
// -- _____________________
// select IDMainPatientsAcc from Branchs b where b.IDC=1 and b.IDP=1; -- ,0,51 ; -- [140]
// -- _____________________
// Call CreatePatientFileNo (1,8,100357138); -- ,0,51 ; -- [1500]
