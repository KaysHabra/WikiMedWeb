import { Component, OnInit } from '@angular/core';
// import { AllService } from '../services/all.service';
// import { LoadingController } from '@ionic/angular';
// import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-patient-file',
  templateUrl: './patient-file.page.html',
  styleUrls: ['./patient-file.page.scss'],
})
export class PatientFilePage implements OnInit {

  // {
  //   في حالة
  //   IDAcc=0  ==>  Make Attend To Appointment  with this parameters : (IDAcc=0,AIDC=1,AIDY=16,AIDDepartment=?,IDAppointment=?,IDPatient=?)

  //   تعيل رقم ملف سابق
  //   FileNo>0   and  NewFileNo>0

  //   }



  isBlackListModal = false;
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



  tblIDype = [
    {
      IDP: 0,
      NameA: `بدون`,
      NameE: `None`,
    },
    {
      IDP: 1,
      NameA: `هوية وطنية`,
      NameE: `National Ide`,
    },
    {
      IDP: 2,
      NameA: `إقامة`,
      NameE: `Iqama`,
    },
    {
      IDP: 3,
      NameA: `جواز سفر`,
      NameE: `Passport`,
    },
    {
      IDP: 4,
      NameA: `هوية خليجية`,
      NameE: `Gulf Identity`,
    },
    {
      IDP: 5,
      NameA: `أخرى`,
      NameE: `Other`,
    },
  ];

  tblReligion = [
    {
      IDP: 0,
      NameA: `بدون`,
      NameE: `None`,
    },
    {
      IDP: 1,
      NameA: `الإسلام`,
      NameE: `Islam`,
    },
    {
      IDP: 2,
      NameA: `المسيحية`,
      NameE: `Christian`,
    },
    {
      IDP: 3,
      NameA: `الهندوسية`,
      NameE: `Hindusim`,
    },
    {
      IDP: 4,
      NameA: `البوذية`,
      NameE: `Buddhism`,
    },
    {
      IDP: 5,
      NameA: `اليهودية`,
      NameE: `Shintosim`,
    },
  ];
  tblMarital = [
    {
      IDP: 0,
      NameA: `أعزب`,
      NameE: `Single`,
    },
    {
      IDP: 1,
      NameA: `متزوج`,
      NameE: `Married`,
    },
    {
      IDP: 2,
      NameA: `مطلق`,
      NameE: `Divorced`,
    },
    {
      IDP: 3,
      NameA: `أرمل`,
      NameE: `Widower`,
    },
    {
      IDP: 4,
      NameA: `طفل`,
      NameE: `Child`,
    },
    {
      IDP: 5,
      NameA: `قاصر`,
      NameE: `Infant`,
    },
  ];
  tblSex = [
    {
      IDP: 1,
      NameA: `ذكر`,
      NameE: `Male`,
    },
    {
      IDP: 0,
      NameA: `أنثى`,
      NameE: `Female`,
    },
  ];
  tblRelativeType = [
    {
      IDP: 0,
      NameA: `الوصي`,
      NameE: `Guardian`,
    },
    {
      IDP: 1,
      NameA: `أب`,
      NameE: `Father`,
    },
    {
      IDP: 2,
      NameA: `أم`,
      NameE: `Mother`,
    },
    {
      IDP: 3,
      NameA: `ابن`,
      NameE: `Son`,
    },
    {
      IDP: 4,
      NameA: `أخ`,
      NameE: `Brother`,
    },
    {
      IDP: 5,
      NameA: `أخت`,
      NameE: `Sister`,
    },
    {
      IDP: 6,
      NameA: `زوج`,
      NameE: `Husband`,
    },
    {
      IDP: 7,
      NameA: `زوجة`,
      NameE: `Wife`,
    },
    {
      IDP: 8,
      NameA: `طوارئ`,
      NameE: `Emergency`,
    },
    {
      IDP: 9,
      NameA: `اخر`,
      NameE: `Other`,
    }
  ];



  // Marital = this.tblMarital[0];
  // Religion = this.tblReligion[0];
  // IDType = this.tblIDype[0];
  // Sex = this.tblSex[0];
  // IDType = 0;
  // Sex = 0;
  // Marital = 0;
  // Religion = 0;
  // Age = 0;
  // Relative1 = {
  //   Name: ``,
  //   RelativeType: 0, // this.tblRelativeType[0],
  //   Phone: ``,
  // };
  // Relative2 = {
  //   Name: ``,
  //   RelativeType: 0, // this.tblRelativeType[0],
  //   Phone: ``,
  // };
  // Relative3 = {
  //   Name: ``,
  //   RelativeType: 0, // this.tblRelativeType[0],
  //   Phone: ``,
  // };

  // RelativeType2 = this.tblRelativeType[0];
  // RelativeType3 = this.tblRelativeType[0];
  // PatientClassification = 0;

  // tblSelectedItem = [];
  // Setp = `first`;
  Age = 0;
  Patient = {
    ID: 0, IDC: 0,
    IDP: 0, IDF: 0,

    Relative: 0,
    IDBranch: 2,
    IDMainAcc: 0,
    IDUser: 0,
    IDAcc: 153140,
    IDInvitedBy: 0,
    ADate: "",
    ID_Emp: 0,
    PricePolicy: 0,
    Active: 0,
    NameE: "",
    NameA: "",

    SoundNameA: "",
    SoundNameE: "",
    Classification: 0,
    Description: "",
    BirthDate: "1995-02-22",
    Marital_State: "0",
    Sex: 1,
    SocialID: "",
    SocialIDType: 0,
    ID_Nationality: 0,
    ID_Religion: 0,

    RelativeName1: "",
    RelativePhon1: "",
    RelativeType1: 0,
    RelativeName2: "",
    RelativePhon2: "",
    RelativeType2: 0,
    RelativeName3: "",
    RelativePhon3: "",
    RelativeType3: 0,



    PoBOX: "",
    IDCity: 23,
    Postal_Code: "",
    PhonType1: 8,
    Phon1: "",
    PhonType2: 1,
    Phon2: "",
    PhonType3: 1,
    Phon3: "",
    Enable_SMS: 1,
    EMail: "",

    IDAgreement: 0,
    CreatedDate: "2025-02-23",
    IDPTemp: 0,
    ByFrind: 0,
    ByFacebook: 0,
    ByTwitter: 0,
    ByInstagram: 1,
    BySnapchat: 1,
    BySMS: 0,
    ByInternet: 0,
    ByShow: 0,
    ApptCount: 0,
    TotalDuration: 0,
    TotalAttendDuration: 0,
    TotalNotAttendDuration: 0,
    OperatingRoomSessionCount: 0,
    AttendCount: 0,
    AttendEarly: 0,
    AttendOnTime: 0,
    AttendLate: 0,
    NotAttend: 0,
    NotAttendAfterConfirm: 0,
    BlackPoints: 0,
    AttendAndDelayedCount: 0,
    AttendAndDelayedInMenutes: 0,
    FirstVisitCount: 0,
    FollowUpVisitCount: 0,
    ReturnVisitCount: 0,
    ProcedureRoomVisitCount: 0,
    ClinicProcedureVisitCount: 0,
    NotAttendStatus: 0,
    LateStatus: 0,
    DelayStatus: 0,
    MonyStatus: 0,
    PatientPoints: 0,
    FutureAppt: 0,
    SavedFileNo: 66414,
    PPassword: "",
    SecureCode: 0,
    IDDoctor: 0,
    Status: 0,
    Occupation: "", // المهنة
    Employer: "",
    LastModifyDate: "2025-02-23 13:49:05",
    ModifyIDUser: 0,
    ModifyReason: "",
    IDPeriod: 1,
    SoundName: "",
    ByTV: 0,
    ByNewspaper: 0,
    ByMagazine: 0,
    ByRadio: 0
  };
  PatientBeforUpdate = null;

  // PatientFile = {
  //   "IDP": 300125555,
  //   "PatientNameE": "Musef Habra",
  //   "PatientNameA": "مسعف هبرة",
  //   "IDAcc": 153138,
  //   "FileNo": 66412,
  //   "Classification": 0,
  //   "BirthDate": "1975-01-09",
  //   "Sex": 1,
  //   "SocialID": "2035397799",
  //   "Phon1": "966503114364",
  //   "Phon2": "0",
  //   "Phon3": "",
  //   "AttendCount": 0,
  //   "NotAttendAfterConfirm": 0,
  //   "MonyStatus": 0,
  //   "PatientPoints": 0,
  //   "FutureAppt": 0,
  //   "Description": "",
  //   IDReligion: 0,
  //   RelativePhone: ``,
  //   CreationDate: this.all.getDateNow(`-`),
  // };

  tblDoctors = [];
  tblDoctorsTmp = [];
  constructor(public all: AllService,
    // private loadingController: LoadingController, 
    // private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.all.getfirstLoad().then(res => {
      if (res) {
        console.log(`this.all.Patient= `, this.all.Patient);
        this.PatientBeforUpdate = this.all.deepCopy(this.all.Patient);
        this.Patient = this.all.deepCopy(this.all.Patient);
        this.Age = this.calculateAge(this.Patient.BirthDate);
        // this.getPatientFile();
        this.getPageData();
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) {
          this.changePatient({ IDP: id });
        }

        this.tblDoctors = this.all.deepCopy(this.all.tblDoctors.filter(x => x.IsDoctor == 1));
        this.getPatientBlacklist();
        // for (let d of this.tblDoctors) {
        //   d[`Checked`] = false;
        // }

      }
    });
  }
  tblNationality = [];
  tblCity = [];
  tblEmployee = [];
  tblUser = [];

  newPatientFile() {
    this.Age = 0;
    this.Patient = {
      ID: 0, IDC: 0,
      IDP: 0, IDF: 0,

      Relative: 0,
      IDBranch: this.all.RegisterData.Branch,
      IDMainAcc: 0,
      IDUser: 0,
      IDAcc: 0,
      IDInvitedBy: 0,
      ADate: "",
      ID_Emp: 0,
      PricePolicy: 0,
      Active: 0,
      NameE: "",
      NameA: "",

      SoundNameA: "",
      SoundNameE: "",
      Classification: 0,
      Description: "",
      BirthDate: "1995-02-22",
      Marital_State: "0",
      Sex: 1,
      SocialID: "",
      SocialIDType: 0,
      ID_Nationality: 0,
      ID_Religion: 0,

      RelativeName1: "",
      RelativePhon1: "",
      RelativeType1: 0,
      RelativeName2: "",
      RelativePhon2: "",
      RelativeType2: 0,
      RelativeName3: "",
      RelativePhon3: "",
      RelativeType3: 0,



      PoBOX: "",
      IDCity: 0,
      Postal_Code: "",
      PhonType1: 8,
      Phon1: "",
      PhonType2: 1,
      Phon2: "",
      PhonType3: 1,
      Phon3: "",
      Enable_SMS: 1,
      EMail: "",

      IDAgreement: 0,
      CreatedDate: "",
      IDPTemp: 0,
      ByFrind: 0,
      ByFacebook: 0,
      ByTwitter: 0,
      ByInstagram: 1,
      BySnapchat: 1,
      BySMS: 0,
      ByInternet: 0,
      ByShow: 0,
      ApptCount: 0,
      TotalDuration: 0,
      TotalAttendDuration: 0,
      TotalNotAttendDuration: 0,
      OperatingRoomSessionCount: 0,
      AttendCount: 0,
      AttendEarly: 0,
      AttendOnTime: 0,
      AttendLate: 0,
      NotAttend: 0,
      NotAttendAfterConfirm: 0,
      BlackPoints: 0,
      AttendAndDelayedCount: 0,
      AttendAndDelayedInMenutes: 0,
      FirstVisitCount: 0,
      FollowUpVisitCount: 0,
      ReturnVisitCount: 0,
      ProcedureRoomVisitCount: 0,
      ClinicProcedureVisitCount: 0,
      NotAttendStatus: 0,
      LateStatus: 0,
      DelayStatus: 0,
      MonyStatus: 0,
      PatientPoints: 0,
      FutureAppt: 0,
      SavedFileNo: 0,
      PPassword: "",
      SecureCode: 0,
      IDDoctor: 0,
      Status: 0,
      Occupation: "", // المهنة
      Employer: "",
      LastModifyDate: "",
      ModifyIDUser: 0,
      ModifyReason: "",
      IDPeriod: 1,
      SoundName: "",
      ByTV: 0,
      ByNewspaper: 0,
      ByMagazine: 0,
      ByRadio: 0
    };
  }

  getPageData() {
    let Query0 = `SELECT * FROM coding c where idc=${this.all.User.IDC} and Code_Type="nat"`;
    let Query1 = `SELECT * FROM citys c`;
    let Query2 = `Select ID,IDP,Full_Name_Ar,Full_Name_Eng,Emp_Status from employees where IDC=${this.all.User.IDC}`;
    let Query = `${Query0};${Query1};${Query2}`;

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
      if (res[`Q2Error`] != "") {
        this.all.ngxToast(`Q2Error= `, res[`Q2Error`], `warning`);
        console.log(`Q2Error= `, res[`Q2Error`]);
      }
      console.log(res);
      this.tblNationality = res[`Q0`];
      this.tblCity = res[`Q1`];
      this.tblEmployee = res[`Q2`];
      for (let e of this.tblEmployee) {
        e[`NameA`] = e.Full_Name_Ar;
        e[`NameE`] = e.Full_Name_Eng;
      }


    });
  }

  getBranchName() {
    if (this.all.tblBranch.filter(x => x.IDP == this.Patient.IDBranch).length == 0) {
      return "";
    }
    return this.all.tblBranch.filter(x => x.IDP == this.Patient.IDBranch)[0]["Name" + this.all.LangLetter];
  }

  // getPatientFile() {
  //   this.all.getData(`?MType=300&HCode=2827045&SocialID=2035397799&FileNo=66412&Phon=0503114364`).then(res => {
  //     console.log(`res= `, res);
  //     console.log(`res= `, res[0].PatientNameE);
  //     this.PatientFile = res[0];
  //   });
  // }

  async delPatient() {
    // const loading = await this.loadingController.Dcreate({
    //   spinner: `bubbles`, //
    //   duration: 5000, //
    //   message: this.translate.instant(`Loading`)+ '...',
    //   translucent: true,
    //   cssClass: 'custom-loading'
    // });
    // loading.present();




    this.all.confirm(this.all.translate.instant('Are you sure you want to delete?'), this.all.translate.instant('Attention')).then(yes => {
      if (yes) {
        let Query0 = `Call CanDelete("acc",${this.all.User.IDC},"${this.Patient.IDAcc}")`;
        let Query = `${Query0}`;
        console.log(`Query= `, Query);
        const body = new HttpParams()
          .set('Mtype', 'A16')
          .set('Query', Query);

        this.all.postData(body).then(res => {
          if (res[`Q0Error`] != "") {
            this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
            console.log(`Q0Error= `, res[`Q0Error`]);
          }
          if (res[`Q0`].length == 0) {

          } else {

          }
        });

      }
    });
  }
  // changeStep(ev) {
  //   console.log(ev);
  //   this.Setp = ev.detail.value;
  // }

  getInvitedPatient(ev) {
    console.log(`ev= `, ev);
  }

  cancel() {

  }

  save() {
    console.log(this.Patient);
    // Call ModifyTable("Patients", "203091", Now(), 17,"","Modify", 0);

    // update patients  set
    //  ID_Nationality = '2'
    // where
    //  ID = '203092' ;

    
    if (this.Patient.ID == 0) {

    } else {
      let Query0 = `Call ModifyTable("Patients", "${this.Patient.ID}", Now(), ${this.all.User.IDP},"","Modify", 0);`;
      let Query1 = ``;

      if (JSON.stringify(this.Patient) == JSON.stringify(this.PatientBeforUpdate)) {
        console.log('no change');
      } else {
        Query1 = `update patients  set `;

        // Patient = {     
        //   // IDBranch: 2,
        //   SocialIDType: 0,
        //   RelativeType1: 0,
        //   RelativeType2: 0,
        //   RelativeType3: 0,

        //   PhonType1: 8,
        //   PhonType2: 1,
        //   PhonType3: 1,

        //   // IDMainAcc: 0,
        //   // PoBOX: "",
        //   // IDAgreement: 0,
        //   // CreatedDate: "2025-02-23",
        //   // IDPTemp: 0,
        //   // ByFrind: 0,
        //   // ByFacebook: 0,
        //   // ByTwitter: 0,
        //   // ByInstagram: 1,
        //   // BySnapchat: 1,
        //   // BySMS: 0,
        //   // ByInternet: 0,
        //   // ByShow: 0,
        //   // ApptCount: 0,
        //   // TotalDuration: 0,
        //   // TotalAttendDuration: 0,
        //   // TotalNotAttendDuration: 0,
        //   // OperatingRoomSessionCount: 0,
        //   // AttendCount: 0,
        //   // AttendEarly: 0,
        //   // AttendOnTime: 0,
        //   // AttendLate: 0,
        //   // NotAttend: 0,
        //   // NotAttendAfterConfirm: 0,
        //   // BlackPoints: 0,
        //   // AttendAndDelayedCount: 0,
        //   // AttendAndDelayedInMenutes: 0,
        //   // FirstVisitCount: 0,
        //   // FollowUpVisitCount: 0,
        //   // ReturnVisitCount: 0,
        //   // ProcedureRoomVisitCount: 0,
        //   // ClinicProcedureVisitCount: 0,
        //   // NotAttendStatus: 0,
        //   // LateStatus: 0,
        //   // DelayStatus: 0,
        //   // MonyStatus: 0,
        //   // PatientPoints: 0,
        //   // FutureAppt: 0,
        //   // SavedFileNo: 66414,
        //   // PPassword: "",
        //   // SecureCode: 0,
        //   // IDDoctor: 0,
        //   // Status: 0,
        //   // LastModifyDate: "2025-02-23 13:49:05",
        //   // ModifyIDUser: 0,
        //   // ModifyReason: "",
        //   // IDPeriod: 1,
        //   // SoundName: "",
        //   // ByTV: 0,
        //   // ByNewspaper: 0,
        //   // ByMagazine: 0,
        //   // ByRadio: 0
        //   // SoundNameA: "",
        //   // SoundNameE: "",
        //   // Relative: 0,
        //   // IDUser: 0,
        //   // IDAcc: 153140,
        //   // IDInvitedBy: 0,
        //   // ADate: "",
        //   // ID_Emp: 0,
        //   // PricePolicy: 0,
        //   // Active: 0,
        // };



        let Query1Sub = `ID_Nationality = '${this.Patient.ID_Nationality}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} SocialID = '${this.Patient.SocialID}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Phon1 = '${this.Patient.Phon1}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Phon2 = '${this.Patient.Phon2}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Phon3 = '${this.Patient.Phon3}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Enable_SMS = '${this.Patient.Enable_SMS ? '1' : '0'}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} EMail = '${this.Patient.EMail}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Postal_Code = '${this.Patient.Postal_Code}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} IDCity = '${this.Patient.IDCity}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} RelativeName1 = '${this.Patient.RelativeName1}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} RelativePhon1 = '${this.Patient.RelativePhon1}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} RelativeName2 = '${this.Patient.RelativeName2}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} RelativePhon2 = '${this.Patient.RelativePhon2}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} RelativeName3 = '${this.Patient.RelativeName3}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} RelativePhon3 = '${this.Patient.RelativePhon3}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Employer = '${this.Patient.Employer}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Occupation = '${this.Patient.Occupation}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} ID_Religion = '${this.Patient.ID_Religion}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Sex = '${this.Patient.Sex}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Marital_State = '${this.Patient.Marital_State}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Description = '${this.Patient.Description}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} Classification = '${this.Patient.Classification}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} NameE = '${this.Patient.NameE}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} NameA = '${this.Patient.NameA}' `;
        Query1Sub = `${Query1Sub == '' ? '' : ','} BirthDate = '${this.Patient.BirthDate}' `;

        Query1 += Query1Sub;
        Query1 += `where ID = '${this.Patient.ID}'`;

        console.log(Query1);
      }

      
      let Query = `[${Query0}]`;
      if (Query1 != ''){
        Query += `;[${Query1}]`;
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
        this.all.ngxToast(`Saved Successfully`, ``, `success`);
      });

    }

    



  }





  calculateBirthDate(age) {
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    const birthMonth = today.getMonth() + 1; // الأشهر تبدأ من 0
    const birthDay = today.getDate();

    // تنسيق التاريخ كـ yyyy-MM-dd
    return `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
  }

  calculateAge(birthDateStr) {
    const birthDate = new Date(birthDateStr);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    // التحقق من الأشهر والأيام لتصحيح العمر إذا لم يكتمل العام
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  changeBirthDate(ev) {

  }

  changePatient(ev) {
    console.log(`ev= `, ev);
    let Query = `SELECT * FROM Patients WHERE IDC = ${this.all.User.IDC} AND IDP=${ev.IDP} ORDER BY IDP DESC LIMIT 1`;

    console.log(`Query= `, Query);
    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }
      if (res[`Q0`].length == 0) {

      } else {
        this.all.Patient = this.all.deepCopy(res[`Q0`][0]);
        this.Patient = this.all.Patient;
        this.Age = this.calculateAge(this.Patient.BirthDate);
      }
    });
  }

  nextPatient(search) {
    // alert(search);
    let Query = ``;
    switch (search) {
      case 1: // First
        Query = `SELECT * FROM Patients WHERE IDC = ${this.all.User.IDC} ORDER BY IDP ASC LIMIT 1`
        break;
      case 2: // Back
        Query = `select * from Patients where IDC=${this.all.User.IDC} and IDP<${this.Patient.IDP} Order by IDP desc limit 1`
        break;
      case 3: // Next
        Query = `select * from Patients where IDC=${this.all.User.IDC} and IDP>${this.Patient.IDP} Order by IDP desc limit 1`
        break;
      case 4: // Last
        Query = `SELECT * FROM Patients WHERE IDC = ${this.all.User.IDC} ORDER BY IDP DESC LIMIT 1`
        break;

      default:
        break;
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
      if (res[`Q0`].length == 0) {

      } else {
        this.all.Patient = this.all.deepCopy(res[`Q0`][0]);
        this.PatientBeforUpdate = this.all.deepCopy(res[`Q0`][0]);
        this.Patient = this.all.deepCopy(res[`Q0`][0]);
        this.Age = this.calculateAge(this.Patient.BirthDate);
      }
    });

  }


  newFileNo() {
    console.log(`this.Patient= `, this.Patient);
    // alert(this.all.RegisterData.FinancialYear + ` - `+ this.all.RegisterData.Branch);
    const body = new HttpParams()
      .set('Mtype', 'A18')
      .set('IDBranch', this.all.RegisterData.Branch)
      .set('IDY', this.all.RegisterData.FinancialYear)
      // .set('IDDepartment', 0)
      // .set('IDAppointment', 0)
      .set('IDPatient', this.Patient.IDP)
      .set('IDAcc', this.Patient.IDAcc)
    // .set("FileNo", 0)
    // .set('NewFileNo', 0);

    this.all.postData(body).then(res => {

      console.log(`res= `, res);

    });

  }

  IsFileNoModal = false;
  NewFileNo = 0;
  updateFilNo() {

    const body = new HttpParams()
      .set('Mtype', 'A18')
      .set('IDBranch', this.all.RegisterData.Branch)
      .set('IDDepartment', 0)
      .set('IDAppointment', 0)
      .set('IDPatient', this.Patient.IDP)
      .set('IDAcc', this.Patient.IDAcc)
      .set("FileNo", this.NewFileNo)
      .set('NewFileNo', 0);


    this.all.postData(body).then(res => {

      console.log(`res= `, res);

    });


    // // Update Acc Set AccOld=Ac_Num,IDF=4,Ac_Num=788 where (IDC,IDP)=(1,153140); -- ,0,51 
    // // Update Patients Set Description=concat_ws(",",Description,"OldFileNo=789") where (IDC,IDP)=(1,300125565); -- ,0,51 
    // // select * from Patients where IDC=1 and IDP=300125565; -- ,0,51 ; -- [203]
    // let Query0 = `Update Acc Set AccOld=Ac_Num,IDF=4,Ac_Num=${this.NewFileNo} where (IDC,IDP)=(${this.all.User.IDC},${this.Patient.IDAcc})`;
    // let Query1 = `Update Patients Set Description=concat_ws(",",Description,"OldFileNo=${this.Patient.SavedFileNo}") where (IDC,IDP)=(${this.all.User.IDC},${this.Patient.IDP})`;
    // let Query2 = `select * from Patients where IDC=${this.all.User.IDC} and IDP=${this.Patient.IDP}`;
    // let Query = `${Query0};${Query1};${Query2}`;

    // console.log(`Query= `, Query);
    // const body = new HttpParams()
    //   .set('Mtype', 'A16')
    //   .set('Query', Query);

    // this.all.postData(body).then(res => {
    //   if (res[`Q0Error`] != "") {
    //     this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
    //     console.log(`Q0Error= `, res[`Q0Error`]);
    //   }
    //   if (res[`Q0`].length == 0) {

    //   } else {
    //     this.all.Patient = this.all.deepCopy(res[`Q0`][0]);
    //     this.Patient = this.all.Patient;
    //     this.Age = this.calculateAge(this.Patient.BirthDate);
    //   }
    // });
  }

  SocialIDError = ``;
  checkSocialID() {
    // alert(this.Patient.SocialID);
    const body = new HttpParams()
      .set('Mtype', 'A19')
      .set('SocialID', this.Patient.SocialID);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      this.SocialIDError = res[`Message`];
    });
  }

  saveBlackList() {
    // console.log(`tblBlacklistDoctor= `, this.tblBlacklistDoctor);
    let Query0 = `Delete p from Patientsblacklist p where IDC=${this.all.User.IDC} and IDPatient=${this.Patient.IDP}`;
    let Query = Query0;


    // for (let d of this.tblDoctorsTmp.filter(x => x.Checked == true)) {
    //   Query += `;
    //   insert into patientsblacklist 
    //     (IDC, IDUser, ADate, Active, IDPatient, IDDoctor, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description) 
    //     Select IDC, IDUser, now(), 1, IDP, ${d.IDP}, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description from patients where IDC=${this.all.User.IDC} and IDP=${this.Patient.IDP}`;
    // }
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(res);
      // this.tblDoctors = this.all.deepCopy(this.tblDoctorsTmp);
      // this.all.ngxToast(`Saved Successfully`, ``, `success`);
      // this.isBlackListModal = false;
      this.insertToPlacklist();
    });

  }

  insertToPlacklist() {
    let Query = ``;

    for (let d of this.tblDoctorsTmp.filter(x => x.Checked == true)) {
      if (Query.length > 0) {
        Query += `;`;
      }
      Query += `[insert into patientsblacklist 
        (IDC, IDUser, ADate, Active, IDPatient, IDDoctor, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description) 
        Select IDC, IDUser, now(), 1, IDP, ${d.IDP}, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description from patients where IDC=${this.all.User.IDC} and IDP=${this.Patient.IDP}]`;
    }

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(res);
      this.tblDoctors = this.all.deepCopy(this.tblDoctorsTmp);
      this.all.ngxToast(`Saved Successfully`, ``, `success`);
      this.isBlackListModal = false;

    });
  }


  // tblBlacklistDoctor = [];
  setBlacklistDoctor(ev, doctor) {
    // console.log(ev.detail.checked);
    console.log(this.tblDoctors.filter(x => x.Checked == true));
    // if (ev.detail.checked == false) {
    //   this.tblBlacklistDoctor = this.tblBlacklistDoctor.filter(item => item != doctor.IDDoctor);
    // }
    // else (this.tblBlacklistDoctor.filter(x => x == doctor.IDDoctor).length == 0 )
    // {
    //   this.tblBlacklistDoctor.push(doctor.IDDoctor);
    // }
  }

  getPatientBlacklist() {
    let Query = `select ID,IDDoctor,IDPatient from patientsblacklist where ${this.all.User.IDC} and IDPatient=${this.Patient.IDP}`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body, false).then(res => {
      console.log(res);

      let BlackList = res[`Q0`];
      for (let b of BlackList) {
        if (this.tblDoctors.filter(x => x.IDP == b.IDDoctor).length > 0) {
          this.tblDoctors.filter(x => x.IDP == b.IDDoctor)[0][`Checked`] = true;
        }
      }
      console.log(this.tblDoctors.filter(x => x.Checked == true));
      // tblDoctors
    });
  }

}



// Delete p from Patientsblacklist p where IDC=1 and IDPatient=100357137; -- ,0,51
// -- _____________________
// insert into patientsblacklist (IDC, IDUser, ADate, Active, IDPatient, IDDoctor, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description) Select IDC, IDUser, "2025-03-16 15:43:07", 1, IDP, 2, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description from patients where IDC=1 and IDP=100357137; -- ,0,51
// -- _____________________
// insert into patientsblacklist (IDC, IDUser, ADate, Active, IDPatient, IDDoctor, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description) Select IDC, IDUser, "2025-03-16 15:43:08", 1, IDP, 20, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description from patients where IDC=1 and IDP=100357137; -- ,0,51
// -- _____________________
// insert into patientsblacklist (IDC, IDUser, ADate, Active, IDPatient, IDDoctor, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description) Select IDC, IDUser, "2025-03-16 15:43:08", 1, IDP, 87, SocialID, Phon1, Phon2, Phon3, NameE, NameA, Classification, Description from patients where IDC=1 and IDP=100357137; -- ,0,51 
