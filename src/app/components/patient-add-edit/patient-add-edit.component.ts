import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AllService } from 'src/app/services/all.service';
import { RtfService } from 'src/app/services/rtf.service';

@Component({
  selector: 'app-patient-add-edit',
  templateUrl: './patient-add-edit.component.html',
  styleUrls: ['./patient-add-edit.component.scss'],
})
export class PatientAddEditComponent implements OnInit {

  //   WordStr = `{\rtf1\fbidis\ansi\ansicpg1256\deff0\deflang1025{\fonttbl{\f0\froman\fprq2\fcharset178{\*\fname Times New Roman;}Times New Roman (Arabic);}{\f1\froman\fprq2\fcharset0 Times New Roman;}{\f2\fnil\fcharset0 Tahoma;}}
  // {\colortbl ;\red128\green0\blue0;\red0\green0\blue255;}
  // \viewkind4\\uc1\pard\rtlpar\sl360\slmult1\qc\tx3852\cf1\b\f0\rtlch\fs52\'ca\'dc\'d1\'e5\'dc\'dc\'dc\'e1 \'c7\'e1\'c8\'d8\'e4\lang1033\f1\ltrch\par
  // \fs20\par
  // \pard\rtlpar\sl360\slmult1\qr\cf2\lang1025\\ul\f0\rtlch\fs24\'e3\'e4 \'c7\'e1\'e3\'e3\'df\'e4 \'da\'e1\'c7\'cc \'ca\'d1\'e5\'e1\'c7\'ca \'c7\'e1\'c8\'d8\'e4 \'da\'e4 \'d8\'d1\'ed\'de:\par
  // \pard\rtlpar\fi-360\ri611\sl360\slmult1\qr\tx611\\ulnone 1-\tab\cf0\'dd\'ed \'cd\'c7\'e1 \'df\'c7\'e4\'ca \'ca\'d1\'e5\'e1\'c7\'ca \'c7\'e1\'c8\'d8\'e4 \'e4\'c7\'ca\'cc\'c9 \'da\'e4 \'d2\'ed\'c7\'cf\'c9 \'dd\'ed \'c7\'e1\'e6\'d2\'e4 \'c3\'e6 \'e3\'c7 \'c8\'da\'cf \'c7\'e1\'cd\'e3\'e1 \'dd\'c5\'e4 \'c7\'e1\'cd\'e1 \'c7\'e1\'c3\'e3\'cb\'e1 \'c7\'e1\'da\'e1\'c7\'cc \'c8\'da\'e3\'e1\'ed\'c9 \'ca\'cc\'e3\'ed\'e1 \'e1\'d4\'cf \'c7\'e1\'c8\'d8\'e4\lang1033\f1\ltrch\par
  // \pard\rtlpar\fi-360\ri611\sl360\slmult1\qr\cf2\lang1025\f0\rtlch 2-\tab\cf0\'dd\'c8 \'cd\'c7\'e1 \'df\'c7\'e4\'ca \'c7\'e1\'ca\'d1\'e5\'e1\'c7\'ca \'e4\'c7\'ca\'cc\'c9 \'da\'e4 \'ca\'d1\'c7\'df\'e3 \'c7\'e1\'cf\'e5\'e6\'e4 \'dd\'ed \'e3\'e4\'d8\'de\'c9 \'c7\'e1\'c8\'d8\'e4 \'dd\'c5\'e4 \'c7\'e1\'da\'e1\'c7\'cc \'c7\'e1\'c3\'e3\'cb\'e1 \'ed\'df\'e6\'e4 \'c8\'ca\'de\'e4\'ed\'c9 \'c7\'e1\'ca\'d1\'c7\'ed\'e6 (\'d4\'dd\'d8 \'c7\'e1\'cf\'e5\'e6\'e4 \'c8\'c7\'e1\'e1\'ed\'d2\'d1) \'c7\'e1\'ca\'ed \'ca\'da\'e3\'e1 \'da\'e1\'ec \'d4\'dd\'d8 \'c7\'e1\'cf\'e5\'e6\'e4 \'e6\'d4\'cf \'c7\'e1\'c8\'d8\'e4 \'dd\'ed \'c2\'e4 \'e6\'c7\'cd\'cf\lang1033\f1\ltrch\par
  // \pard\rtlpar\sl360\slmult1\qr\lang1025\f0\rtlch\'e6\'ed\'ca\'cd\'cf\'cf \'d0\'e1\'df \'c8\'cd\'d3\'c8 \'c7\'e1\'cd\'c7\'e1\'c9 \'e6\'d4\'cf\'ca\'e5\'c7 \'e6\'ca\'de\'ed\'ed\'e3 \'c7\'e1\'d8\'c8\'ed\'c8 \'c7\'e1\'e3\'da\'c7\'e1\'cc\lang1033\f1\ltrch\par
  // \pard\ltrpar\lang1025\b0\f2\fs18\par
  // }`;

  hideDetials(){
    this.TreatmentDetails = ``;
  }
  TreatmentDetails = ``;
  showStream(ev) {
    this.TreatmentDetails = ``;
    if (ev.DataStream.length > 0) {
      this.rtf.convertRtfToHtml(ev.DataStream).then(html => {
        // this.all.alert(html);
        this.TreatmentDetails = html;
      });
    }
    console.log(ev);
  }
  // tblTretment = [
  //   {
  //     ID: 1, IDP: 1, IDF: 0, NameA: 'Plastic Surgery', No: `1531`, Progress: 0.3
  //   },
  //   {
  //     ID: 2, IDP: 3, IDF: 1, NameA: 'Dr.Alatawe', No: `97541`, Progress: 0.5
  //   },
  //   {
  //     ID: 4, IDP: 4, IDF: 1, NameA: 'Dr.Samer', No: `0025`, Progress: 0.9
  //   },
  //   {
  //     ID: 5, IDP: 5, IDF: 1, NameA: 'Dental', No: `0015`, Progress: 0.2
  //   },
  //   {
  //     ID: 6, IDP: 6, IDF: 5, NameA: 'Dr.maher', No: `0015`, Progress: 0.2
  //   },
  // ];
  tblSelectedItem = [];
  Setp = `first`;

  tblTretment = [];
  tblInvitedByPatient = [];
  tblSpecifitedDoctor = [];

  Patient = {
    NameE: ``,
    NameA: ``,
    FNameE: ``,
    FNameA: ``,
    GFNameE: ``,
    GFNameA: ``,
    LastNameE: ``,
    LastNameA: ``,
    Age: 0,
    Phon1: ``,
    Phon2: ``,
    ByFrind: false, ByInternet: false, ByTwitter: false,
    BySnapchat: false, BySMS: false, ByFacebook: false,
    ByInstagram: false, ByShow: false,

    // ByTV: false, ByNewspaper: false, ByMagazine: false, ByRadio: false
  };
  tblDoctors = this.all.tblDoctors.filter(x => x.IsDoctor == 1);
  constructor(public all: AllService, private modalCtrl: ModalController,
    private alertController: AlertController,
    private rtf: RtfService
  ) { }

  ngOnInit() {
    this.getLoad();
  }

  getLoad() {
    // ____  Patient Complaint or Diagnosis  ____ شكوى أو تشخيص أولي  _________ tblTretment
    let Query0 = `Select ID, IDC, IDP,IDF, Active,
      if(Trim(NameE)="",NameA,NameE) NameE,
      if(Trim(NameA)="",NameE,NameA) NameA,
      Description, DataStream, DoctorPriority1, DoctorPriority2, DoctorPriority3  
      from Diagnosis 
      where IDC=${this.all.User.IDC} and Active=True`;

    // ____ Invited By Patient ____ دعي عن طريق المريض ____________ tblSpecifitedDoctor
    let Query1 = `select 0 IDP,0 IDBranch, "Any Doctor" Full_Name_Eng, "Any Doctor" Full_Name_Ar, "0000" SName, 0 Ac_Num, 0 IDAgreement, "00000000" AccountNo,0 ID_Job_Iqamah
      union All 
      Select E.IDP,a.IDBranch,e.Full_Name_Eng,e.Full_Name_Ar,e.SName,a.Ac_Num,g.IDP IDAgreement,GetAccountNo(a.Ac_PNum,a.Ac_Num,8) AccountNo,e.ID_Job_Iqamah 
      from Employees E
      inner join Acc a on (E.IDC,E.ID_Acc)=(a.IDC,a.IDP) 
      Left Join Agreements g on (e.IDC,e.IDP,0)=(g.IDC,g.ID_Emp,g.AgrType) 
      where e.IDC=${this.all.User.IDC} and e.ID_Job=7 and E.ID_Acc>0`;

    let Query = `${Query0};${Query1}`;

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

      let tretments = res[`Q0`];
      // alert(res[`Q0`].filter(x=>x.ID));
      // tretments = tretments.filter(x => x.NameA.length > 0 && x.NameE.length > 0);
      // tretments = tretments.filter(x => x.IDF==0);

      // for (let itm of tretments) {
      //   tretments = tretments.concat(res[`Q0`].filter(x=>x.IDF == itm.IDP) );
      // }
      // for (let itm of tretments) {
      //   tretments = tretments.concat(res[`Q0`].filter(x=>x.IDF == itm.IDP) );
      // }
      let tmp = [];
      for (let itm of tretments) {
        if ((itm.IDP != itm.IDF) && itm.IDF == 0 && itm.NameA != "" && itm.NameE != "") {
          tmp.push(itm);
        }
        if ((itm.IDP != itm.IDF) && itm.IDF > 0 && itm.NameA != "" && itm.NameE != "" && tretments.filter(x => x.IDP == itm.IDF).length > 0) {
          tmp.push(itm);
        }
      }
      // let gggggg= this.arrayToTree(tretments);
      console.log(`tretments= `, tmp);

      this.tblTretment = tmp; //.slice(0, 30);


      // alert(this.tblTretment.length);
      this.tblSpecifitedDoctor = res[`Q1`];
    });
  }

  arrayToTree(data) {
    const itemMap = {}; // خريطة لتخزين العناصر باستخدام IDP كمفتاح
    const rootItems = []; // مصفوفة لتخزين العناصر الجذرية (التي ليس لها أب)

    // 1. إنشاء خريطة للعناصر
    data.forEach((item) => {
      itemMap[item.IDP] = { ...item, children: [] }; // إضافة children لكل عنصر
    });

    // 2. بناء الشجرة
    data.forEach((item) => {
      if (item.IDF !== 0) {
        // إذا كان للعنصر أب (IDF !== 0)، أضفه كطفل للعنصر الأب
        if (itemMap[item.IDF]) {
          itemMap[item.IDF].children.push(itemMap[item.IDP]);
        }
      } else {
        // إذا كان العنصر جذر (IDF === 0)، أضفه إلى rootItems
        rootItems.push(itemMap[item.IDP]);
      }
    });

    return rootItems; // إرجاع العناصر الجذرية مع أطفالها
  }

  changeStep(ev) {
    console.log(ev);
    this.Setp = ev.detail.value;

  }

  getInvitedPatient(ev) {

  }

  cancel() {
    this.modalCtrl.dismiss();
  }


  save() {
    // console.log(this.textToHex(this.Patient.NameA));
    // return;


    if (this.Patient.NameA == '' || this.Patient.LastNameA == '' || this.Patient.NameE == '' || this.Patient.LastNameE == '') {
      this.all.ngxToast(`Enter Patient Name`, ``, `warning`);
      return;
    }
    if (!this.all.isPositiveNumber(this.Patient.Age)) {
      this.all.ngxToast(`Enter Patient Age`, ``, `warning`);
      return;
    }
    if (!this.all.isPhoneNumber(this.Patient.Phon1)) {
      this.all.ngxToast(`Enter Patient Phone Correctly`, ``, `warning`);
      return;
    }
    if (this.Patient.ByFacebook == false
      && this.Patient.ByFrind == false
      && this.Patient.ByInstagram == false
      && this.Patient.ByInternet == false
      && this.Patient.BySMS == false
      && this.Patient.ByShow == false
      && this.Patient.BySnapchat == false
      && this.Patient.ByTwitter == false
    ) {
      this.all.ngxToast(`Select Patient Invitation Method`, ``, `warning`);
      return;
    }

    if (this.tblSelectedItem.length == 0) {
      this.all.ngxToast(`Specify the complaint or initial diagnosis.`, ``, `warning`);
      return;
    }

    // let Query = `Select IDP,IDBranch,IDAcc,NameE,NameA,Phon1,Phon2,Phon3 from Patients 
    let Query = `Select * from Patients 
    Where 
    IDC=${this.all.User.IDC} 
    and IDBranch=${this.all.RegisterData.Branch} 
    and ID<>0 
    and (Phon1 like "%${this.Patient.Phon1}%" or Phon2 like "%${this.Patient.Phon1}%" or Phon1 like "%${this.Patient.Phon1}%") 
    Order by IDBranch,Adate Desc`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }

      if (res[`Q0`].length > 0) {
        // alert(`Repeated`);

        this.confirmAdding(`لدينا بالفعل نفس رقم الهاتف في ملف اخر, هل تريد الانتقال إليه مع إلغاء الحالي؟`).then(yes => {
          if (yes == 1) {

            this.modalCtrl.dismiss({ Patient: res[`Q0`][0] }, 'confirm');

          } else if (yes == 2) {
            this.addPatient();
          }
        });


      } else {
        this.addPatient();
      }

    });
  }

  addPatient() {
    //Select IDP,IDBranch,IDAcc,NameE,NameA,Phon1,Phon2,Phon3 from Patients Where IDC=1 and IDBranch=0 and ID<>0 and (Phon1 like "%521111111%" or Phon2 like "%521111111%" or Phon1 like "%521111111%") Order by IDBranch,Adate Desc;

    //   insert into `patients`
    //   (`ID`, `IDC`, `IDP`, `IDF`, `Relative`, `IDBranch`, `IDMainAcc`, `IDUser`, `IDAcc`, `IDInvitedBy`, `ADate`, `ID_Emp`, `PricePolicy`, `Active`, 
    // `NameE`, `NameA`, `SoundNameA`, `SoundNameE`, `Classification`, `Description`, `BirthDate`, `Marital_State`, `Sex`, `SocialID`, `SocialIDType`, `ID_Nationality`, `ID_Religion`, `PoBOX`, `IDCity`, `Postal_Code`, `PhonType1`, `Phon1`, `PhonType2`, `Phon2`, `PhonType3`, `Phon3`, `Enable_SMS`, `EMail`, `RelativeName1`, `RelativePhon1`, `RelativeType1`, `RelativeName2`, `RelativePhon2`, `RelativeType2`, `RelativeName3`, `RelativePhon3`, `RelativeType3`, `IDAgreement`, `CreatedDate`, `IDPTemp`, `ByFrind`, `ByFacebook`, `ByTwitter`, `ByInstagram`, `BySnapchat`, `BySMS`, `ByInternet`, `ByShow`, `ApptCount`, `TotalDuration`, `TotalAttendDuration`, `TotalNotAttendDuration`, `OperatingRoomSessionCount`, `AttendCount`, `AttendEarly`, `AttendOnTime`, `AttendLate`, `NotAttend`, `NotAttendAfterConfirm`, `BlackPoints`, `AttendAndDelayedCount`, `AttendAndDelayedInMenutes`, `FirstVisitCount`, `FollowUpVisitCount`, `ReturnVisitCount`, `ProcedureRoomVisitCount`, `ClinicProcedureVisitCount`, `NotAttendStatus`, `LateStatus`, `DelayStatus`, `MonyStatus`, `PatientPoints`, `FutureAppt`, `SavedFileNo`, `PPassword`, `SecureCode`, `IDDoctor`, `Status`, `Occupation`, `Employer`, `LastModifyDate`, `ModifyIDUser`, `ModifyReason`, `IDPeriod`, `SoundName`, `ByTV`, `ByNewspaper`, `ByMagazine`, `ByRadio`)
    // values
    //   ('0', '1', '0', '0', '0', '0', '0', '17', '0', '0', '2025-2-22 16:48:28', '0', '0', '0', 
    // 'NameE FahthgerE GfatherE SurnameE', 'NameA FahthgerA GFatherA SurNameA', '', '', '0', '', '1992-3-2', '0', '1', '', '0', '0', '0', '', '23', '', '8', '0553921133', '1', '011111111', '1', '', '1', '', '', '', '0', '', '', '0', '', '', '0', '0', '2025-2-22', '0', '0', '0', '1', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '', '0', '0', '0', '', '', '2025-2-22 16:48:28', '0', '', '1', '', '0', '0', '0', '0')
    // ; 

    // Select IDP from Patients where IDC=1 order by ID desc limit 1;
    // select * from Patients where IDC=1 and IDP=300125556; -- ,0,51 ;
    let NameA = this.Patient.NameA;
    if (this.Patient.FNameA != ``) {
      NameA += ` ` + this.Patient.FNameA;
    }
    if (this.Patient.GFNameA != ``) {
      NameA += ` ` + this.Patient.GFNameA;
    }
    NameA += ` ` + this.Patient.LastNameA;

    let NameE = this.Patient.NameE;
    if (this.Patient.FNameE != ``) {
      NameE += ` ` + this.Patient.FNameE;
    }
    if (this.Patient.GFNameE != ``) {
      NameE += ` ` + this.Patient.GFNameE;
    }
    NameE += ` ` + this.Patient.LastNameE;


    // let Query0 = `insert into patients 
    // (ID, IDC, IDP, IDF, Relative, IDBranch, IDMainAcc, IDUser, IDAcc, IDInvitedBy, ADate, ID_Emp, PricePolicy, Active, NameE, NameA, 
    // SoundNameA, SoundNameE, Classification, Description, 
    // BirthDate, Marital_State, Sex, SocialID, SocialIDType, ID_Nationality, ID_Religion,
    // PoBOX, IDCity, Postal_Code, PhonType1, Phon1, PhonType2, Phon2, PhonType3, Phon3, 
    // Enable_SMS, EMail, RelativeName1, RelativePhon1, RelativeType1, RelativeName2, 
    // RelativePhon2, RelativeType2, RelativeName3, RelativePhon3, RelativeType3, 
    // IDAgreement, CreatedDate, IDPTemp, ByFrind, ByFacebook, ByTwitter, ByInstagram, 
    // BySnapchat, BySMS, ByInternet, ByShow, ApptCount, TotalDuration, TotalAttendDuration, 
    // TotalNotAttendDuration, OperatingRoomSessionCount, AttendCount, AttendEarly, 
    // AttendOnTime, AttendLate, NotAttend, NotAttendAfterConfirm, BlackPoints, 
    // AttendAndDelayedCount, AttendAndDelayedInMenutes, FirstVisitCount, 
    // FollowUpVisitCount, ReturnVisitCount, ProcedureRoomVisitCount, ClinicProcedureVisitCount, 
    // NotAttendStatus, LateStatus, DelayStatus, MonyStatus, PatientPoints, FutureAppt, 
    // SavedFileNo, PPassword, SecureCode, IDDoctor, Status, Occupation, Employer, 
    // LastModifyDate, ModifyIDUser, ModifyReason, IDPeriod, ByTV, 
    // ByNewspaper, ByMagazine, ByRadio)
    // values
    // ('0', ${this.all.User.IDC}, 
    // '0', -- IDP
    // '0', -- IDF
    // '0', -- Relative
    // ${this.all.RegisterData.Branch}, 
    // '0', -- IDMainAcc
    // ${this.all.User.IDP}, 
    // '0', -- IDAcc
    // '0', -- IDInvitedBy
    // now(), -- ADate
    // '0', --  ID_Emp
    // '0', -- PricePolicy 
    // '0', -- Active
    // '${NameE}', 
    // '${NameA}', 
    // '', -- SoundNameA
    // '', -- SoundNameE
    // '0', -- Classification
    // '', -- Description
    // '${this.getBirthDate(this.Patient.Age)}', -- BirthDate
    // '0', -- Marital_State
    // '1', -- Sex
    // '', -- SocialID
    // '0', -- SocialIDType
    // '0', -- ID_Nationality
    // '0', -- ID_Religion
    // '', -- PoBOX
    // '23', -- IDCity
    // '', -- Postal_Code
    // '8', -- PhonType1
    // '${this.Patient.Phon1}', -- Phon1
    // '1', -- PhonType2
    // '${this.Patient.Phon2}', -- Phon2
    // '1', -- PhonType3
    // '', -- Phon3
    // '1', -- Enable_SMS
    // '', -- EMail
    // '', -- RelativeName1
    // '', -- RelativePhon1
    // '0', -- RelativeType1
    // '', -- RelativeName2
    // '', -- RelativePhon2
    // '0', -- RelativeType2
    // '', -- RelativeName3
    // '', -- RelativePhon3
    // '0', -- RelativeType3
    // '0', -- IDAgreement
    // now(), -- CreatedDate 
    // '0', -- IDPTemp
    // ${this.Patient.ByFrind ? '1' : '0'}, 
    // ${this.Patient.ByFacebook ? '1' : '0'}, 
    // ${this.Patient.ByTwitter ? '1' : '0'},
    // ${this.Patient.ByInstagram ? '1' : '0'},
    // ${this.Patient.BySnapchat ? '1' : '0'}, 
    // ${this.Patient.BySMS ? '1' : '0'},
    // ${this.Patient.ByInternet ? '1' : '0'},
    // ${this.Patient.ByShow ? '1' : '0'},
    // '0', -- ApptCount
    // '0', -- TotalDuration
    // '0', -- TotalAttendDuration
    // '0', -- TotalNotAttendDuration
    // '0', -- OperatingRoomSessionCount
    // '0', -- AttendCount
    // '0', -- AttendEarly
    // '0', -- AttendOnTime
    // '0', -- AttendLate
    // '0', -- NotAttend
    // '0', -- NotAttendAfterConfirm
    // '0', -- BlackPoints
    // '0', -- AttendAndDelayedCount
    // '0', -- AttendAndDelayedInMenutes
    // '0', -- FirstVisitCount
    // '0', -- FollowUpVisitCount
    // '0', -- ReturnVisitCount
    // '0', -- ProcedureRoomVisitCount
    // '0', -- ClinicProcedureVisitCount
    // '0', -- NotAttendStatus
    // '0', -- LateStatus
    // '0', -- DelayStatus
    // '0', -- MonyStatus
    // '0', -- PatientPoints
    // '0', -- FutureAppt
    // '0', -- SavedFileNo
    // '', -- PPassword
    // '0', -- SecureCode
    // '0', -- IDDoctor
    // '0', -- Status
    // '', -- Occupation
    // '', -- Employer
    // now(), -- LastModifyDate
    // '0', -- ModifyIDUser
    // '', -- ModifyReason
    // '1', -- IDPeriod
    // '0', -- ByTV
    // '0', -- ByNewspaper
    // '0', -- ByMagazine
    // '0' -- ByRadio
    // )`;


    let Query0 = `insert into patients 
    (ID, IDC, IDP, IDF, Relative, IDBranch, IDMainAcc, IDUser, IDAcc, IDInvitedBy, ADate, ID_Emp, PricePolicy, Active, NameE, NameA, 
    SoundNameA, SoundNameE, Classification, Description, 
    BirthDate, Marital_State, Sex, SocialID, SocialIDType, ID_Nationality, ID_Religion,
    PoBOX, IDCity, Postal_Code, PhonType1, Phon1, PhonType2, Phon2, PhonType3, Phon3, 
    Enable_SMS, EMail, RelativeName1, RelativePhon1, RelativeType1, RelativeName2, 
    RelativePhon2, RelativeType2, RelativeName3, RelativePhon3, RelativeType3, 
    IDAgreement, CreatedDate, IDPTemp, ByFrind, ByFacebook, ByTwitter, ByInstagram, 
    BySnapchat, BySMS, ByInternet, ByShow, ApptCount, TotalDuration, TotalAttendDuration, 
    TotalNotAttendDuration, OperatingRoomSessionCount, AttendCount, AttendEarly, 
    AttendOnTime, AttendLate, NotAttend, NotAttendAfterConfirm, BlackPoints, 
    AttendAndDelayedCount, AttendAndDelayedInMenutes, FirstVisitCount, 
    FollowUpVisitCount, ReturnVisitCount, ProcedureRoomVisitCount, ClinicProcedureVisitCount, 
    NotAttendStatus, LateStatus, DelayStatus, MonyStatus, PatientPoints, FutureAppt, 
    SavedFileNo, PPassword, SecureCode, IDDoctor, Status, Occupation, Employer, 
    LastModifyDate, ModifyIDUser, ModifyReason, IDPeriod, ByTV, 
    ByNewspaper, ByMagazine, ByRadio)
    values
    ('0', ${this.all.User.IDC}, 
    '0',
    '0',
    '0',
    ${this.all.RegisterData.Branch}, 
    '0',
    ${this.all.User.IDP}, 
    '0', 
    '0', 
    now(),
    '0', 
    '0',
    '0',
    '${NameE}', 
    '${NameA}', 
    '', 
    '', 
    '0', 
    '',
    '${this.getBirthDate(this.Patient.Age)}',
    '0',
    '1',
    '',
    '0', 
    '0',
    '0', 
    '',
    '23', 
    '', 
    '8',
    '${this.Patient.Phon1}',
    '1',
    '${this.Patient.Phon2}', 
    '1', 
    '',
    '1',
    '',
    '',
    '',
    '0',
    '',
    '',
    '0', 
    '',
    '', 
    '0',
    '0', 
    now(),
    '0',
    ${this.Patient.ByFrind ? '1' : '0'}, 
    ${this.Patient.ByFacebook ? '1' : '0'}, 
    ${this.Patient.ByTwitter ? '1' : '0'},
    ${this.Patient.ByInstagram ? '1' : '0'},
    ${this.Patient.BySnapchat ? '1' : '0'}, 
    ${this.Patient.BySMS ? '1' : '0'},
    ${this.Patient.ByInternet ? '1' : '0'},
    ${this.Patient.ByShow ? '1' : '0'},
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
    '0', 
    '0', 
    '0',
    '0',
    '0', 
    '0', 
    '0', 
    '0',
    '0', 
    '0',
    '0', 
    '0',
    '0', 
    '', 
    '0', 
    '0', 
    '0', 
    '', 
    '', 
    now(), 
    '0', 
    '', 
    '1', 
    '0', 
    '0', 
    '0', 
    '0' 
    )`;

    console.log(`Query0= `, Query0);
    let Query1 = `Select * from Patients where IDC=${this.all.User.IDC} order by ID desc limit 1`;
    let Query = `[${Query0}];${Query1}`;

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

      let Patient = res[`Q1`][0];
      this.addPatientsDiagnosis(Patient.IDP);
      this.modalCtrl.dismiss({ Patient: Patient }, 'confirm');
    });

  }

  addPatientsDiagnosis(IDPatient) {
    let Query0 = `Insert into PatientsDiagnosis 
      (IDC, IDPatient, ID_Diagnosis, IDUser, ADate) 
      values `;
    let IsFirst = 0;
    for (let Diag of this.tblSelectedItem) {
      if (IsFirst > 0) {
        Query0 += `,`;
      }
      IsFirst++;
      Query0 += `(${this.all.User.IDC},${IDPatient},${Diag},${this.all.User.IDP},Now())`;
    }

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
    });
  }


  getBirthDate(age) {
    // الحصول على التاريخ الحالي
    const currentDate = new Date();

    // حساب سنة الميلاد
    const birthYear = currentDate.getFullYear() - age;

    // إنشاء تاريخ الميلاد (نفس اليوم والشهر من السنة الحالية)
    const birthDate = new Date(currentDate.setFullYear(birthYear));

    // إعادة تاريخ الميلاد بتنسيق yyyy-mm-dd
    const year = birthDate.getFullYear();
    const month = String(birthDate.getMonth() + 1).padStart(2, '0'); // إضافة صفر إذا كان الشهر أقل من 10
    const day = String(birthDate.getDate()).padStart(2, '0'); // إضافة صفر إذا كان اليوم أقل من 10

    return `${year}-${month}-${day}`;
  }


  confirmAdding(message: any, header = `Attention`) {
    return new Promise(resolve => {
      this.alertController.create({
        header: header,
        message: message,
        cssClass: `custom-confirm3`,
        buttons: [
          {
            text: `Cancel`,
            cssClass: 'confirm-button3-cancel',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
              resolve(0);
            }
          }, {
            cssClass: 'confirm-button3-yes1',
            text: `نعم افتح الملف القديم وألغي إدهالي هذا`,
            handler: (data) => {
              console.log('Confirm Okay');
              resolve(1);
            }
          },
          {
            cssClass: 'confirm-button3-yes2',
            text: `لا أنشئ ملفاً جديداً رغم تكرار رقم الهاتف`,
            handler: (data) => {
              console.log('Confirm Okay');
              resolve(1);
            }
          }
        ]
      }).then((confirm) => {
        confirm.present();
      });
    });
  }
}
