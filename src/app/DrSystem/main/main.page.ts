import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { NewAppComponent } from 'src/app/components/new-app/new-app.component';
import { AllService } from 'src/app/services/all.service';
import { ApptService } from 'src/app/services/appt.service';
// import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Storage } from '@ionic/storage';
import { DatetimeService } from 'src/app/services/datetime.service';
const DRUG_DATA = `DRUG_DATA`;
const DIAGNOSIS_DATA = `DIAGNOSIS_DATA`
const FIELDS_MAP = `FIELDS_MAP`;

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  IsNew = false;
  // SessionCount = 0;
  IDDoctorCurrent = 0;
  SelectedSessionIndex = 0;
  SelectedSession = null;
  tblSession = [];
  // Call cp(AUserID,'CD_SreviceFilte','6');
  DefaultPackageDiscountPersent = 0;
  // IDDoctor = 0;
  SelectedBtn = `TodayAppts`; // TodayAppts, MyAppts, MyNotDoneAppts, PatientAppts, PatientServices, Messages, MyStatistics
  SelectedTap = `default`; // `default`;
  CurrentDate = this.all.getDateNow(`-`);
  currentDateChanged($event) {
    console.log(this.CurrentDate);
    // alert(2)
    this.getLoad(this.CurrentDate);
  }
  today() {
    this.CurrentDate = this.all.getDateNow(`-`);
    this.getLoad(this.CurrentDate);
  }

  // tblSourceAppts = [];
  tblAppts = [
    // { ATime: '10:00:00 AM', FileNo: 30, PatientNameE: 'Ahmend Abol alool al nagme', Duration: 30 },
    // { ATime: '10:00:00 AM', FileNo: 30, PatientNameE: 'Ahmend Abol', Duration: 30 },
    // { ATime: '10:00:00 AM', FileNo: 30, PatientNameE: 'samer', Duration: 30 },

  ];
  tblConcentration = [
    {
      IDP: 0,
      NameA: `None`,
      NameE: `None`,
    }, {
      IDP: 1,
      NameA: `ML`,
      NameE: `ML`,
    }, {
      IDP: 2,
      NameA: `Gram`,
      NameE: `Gram`,
    }, {
      IDP: 3,
      NameA: `MG`,
      NameE: `MG`,
    }, {
      IDP: 4,
      NameA: `Mcg`,
      NameE: `Mcg`,
    },
  ];
  tblUnit = [
    {
      IDP: 0,
      NameA: `قرص`,
      NameE: `Tablet`,
    },
    {
      IDP: 1,
      NameA: `شراب`,
      NameE: `Syrup`,
    },
    {
      IDP: 2,
      NameA: `حقنة`,
      NameE: `Injection`,
    },
    {
      IDP: 3,
      NameA: `تحاميل`,
      NameE: `Suppositor`,
    },
    {
      IDP: 4,
      NameA: `كبسولات`,
      NameE: `Capsules`,
    },
    {
      IDP: 5,
      NameA: `قطرات`,
      NameE: `Drops`,
    },
    {
      IDP: 6,
      NameA: `كريم`,
      NameE: `Cream`,
    },
    {
      IDP: 7,
      NameA: `مرهم`,
      NameE: `Ointment`,
    },
    {
      IDP: 8,
      NameA: `سائل`,
      NameE: `Liquid`,
    },
    {
      IDP: 9,
      NameA: `جها استنشاق`,
      NameE: `Inhaler`,
    },
    {
      IDP: 10,
      NameA: `رقعة`,
      NameE: `Patch`,
    },
  ];
  tblRoute = [
    {
      IDP: 0,
      NameA: `فموي`,
      NameE: `Oral`,
    }, {
      IDP: 1,
      NameA: `حقنة`,
      NameE: `Injection`,
    }, {
      IDP: 2,
      NameA: `لصقة`,
      NameE: `Patch`,
    }, {
      IDP: 3,
      NameA: `المستقيم`,
      NameE: `Rectal`,
    }, {
      IDP: 4,
      NameA: `المهبل`,
      NameE: `Vaginal`,
    }, {
      IDP: 5,
      NameA: `تحت اللسان`,
      NameE: `Sublingual`,
    }, {
      IDP: 6,
      NameA: `الخدي`,
      NameE: `Buccal`,
    }, {
      IDP: 7,
      NameA: `العضل`,
      NameE: `IM`,
    }, {
      IDP: 8,
      NameA: `الوريد`,
      NameE: `IV`,
    }, {
      IDP: 9,
      NameA: `تحت الجلد`,
      NameE: `SC`,
    }, {
      IDP: 10,
      NameA: `عبر الجلد`,
      NameE: `Transdermal`,
    }, {
      IDP: 11,
      NameA: `الأنف`,
      NameE: `Nasal`,
    }, {
      IDP: 12,
      NameA: `موضعي`,
      NameE: `Topical`,
    }, {
      IDP: 13,
      NameA: `داخل العين`,
      NameE: `Intraocular`,
    },
  ];
  tblTimesDaily = [
    {
      IDP: 0,
      NameA: `يومي`,
      NameE: `Daily`,
    },
    {
      IDP: 1,
      NameA: `اسبوعي`,
      NameE: `Weekly`,
    }, {
      IDP: 2,
      NameA: `شهري`,
      NameE: `Monthly`,
    }, {
      IDP: 3,
      NameA: `مرة واحدة`,
      NameE: `Once`,
    }, {
      IDP: 4,
      NameA: `قبل العملية`,
      NameE: `Befor Pre`,
    }, {
      IDP: 5,
      NameA: `كل`,
      NameE: `Evry`,
    },
  ];

  tblDurationUnit = [
    {
      IDP: 0,
      NameA: `يوم`,
      NameE: `Day`,
    },
    {
      IDP: 1,
      NameA: `اسبوع`,
      NameE: `Week`,
    }, {
      IDP: 2,
      NameA: `شهر`,
      NameE: `Month`,
    }, {
      IDP: 3,
      NameA: `سنة`,
      NameE: `إثشق`,
    },
  ];

  tblDiagnosis = [];

  // CType قيم
  // 0: ChargeSlip,
  // 1: Pre-ChargeSlip,
  // 2: Recommended,
  // 3: Caff,
  // 4: Pharmacy
  tblDoctor = [];
  constructor(public all: AllService, private alertController: AlertController,
    public apptService: ApptService, private modalCtrl: ModalController,
    public storage: Storage, private nav: NavController,
    private datetimeService: DatetimeService,
    private popoverController: PopoverController
  ) { }


  ngOnInit() {
    this.all.getfirstLoad().then(res => {
      if (res) {
        // alert(this.all.RegisterData.CD_SreviceFilter);
        this.CD_SreviceFilter = +this.all.RegisterData.CD_SreviceFilter;
        this.getLoad();
        this.tblDoctor = this.all.tblDoctors.filter(x => x.IsDoctor);
        this.getHiddenData();
      }
    });
  }

  tblFieldsMap = [];
  getHiddenData() {
    this.storage.get(FIELDS_MAP).then(res => {
      if (res) {
        this.tblFieldsMap = res;
      }
    });


    let Query0 = `select * from fieldsmap`;

    let Query = `${Query0}`;
    console.log(Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body, false).then(res => {
      console.log(`res= `, res);
      this.tblFieldsMap = res[`Q0`];

      if (res[`Q0`].length > 0) {
        this.storage.set(FIELDS_MAP, res[`Q0`]);
      }

    });
  }

  IsPrinting = false;
  printForm() {
    let cssRadioList = `
    .radio-header {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 12px;
      color: #333;
    }
    
    .radio-options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .radio-option {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
      background-color: white;
      border: 1px solid #ccc;
    }

    .radio-option:hover {
      background-color: #f0f0f0;
    }

    .radio-option input[type="radio"] {
      display: none;
    }

    .custom-radio {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid #007bff;
      margin-right: 8px;
      position: relative;
    }

    .radio-option input[type="radio"]:checked + .custom-radio::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 8px;
      height: 8px;
      background-color: #007bff;
      border-radius: 50%;
    }

    .option-label {
      font-size: 16px;
      color: #333;
    }
    `;

    let cssCheckList = `
    
    .checkbox-header {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 12px;
      color: #333;
    }
    
    .checkbox-options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .checkbox-option {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background-color 0.2s ease;
      background-color: white;
      border: 1px solid #ccc;
    }
    
    .checkbox-option:hover {
      background-color: #f0f0f0;
    }
    
    .checkbox-option input[type="checkbox"] {
      display: none;
    }
    
    .custom-checkbox {
      width: 16px;
      height: 16px;
      border: 2px solid #007bff;
      border-radius: 4px;
      margin-right: 8px;
      position: relative;
    }
    
    .checkbox-option input[type="checkbox"]:checked + .custom-checkbox::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 5px;
      width: 4px;
      height: 8px;
      border: solid #007bff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
      
    .option-label {
      font-size: 16px;
      color: #333;
    }
    `;

    let cssFormImg = `.area-mouse-over{
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7768ff;
    }
    .found-data{
      color: #f00;
    }
    .img-form {
      max-width: auto;
      width: auto;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    `;

    let cssPanel = `.table-container {
      display: flex; /* لجعل الصفوف بجانب بعضها البعض إذا لزم الأمر (لتخطيط أكثر تعقيدًا) */
      flex-direction: column; /* لترتيب الصفوف عموديًا مثل الجدول */
      width: 100%; /* اجعل الحاوية تأخذ العرض الكامل */
    }

    .table-row {
      display: flex; /* لجعل الخلايا بجانب بعضها البعض في نفس الصف */
      width: 100%;
    }

    .table-cell {
      /* سيتم تحديد العرض ديناميكيًا باستخدام [ngStyle] */
      box-sizing: border-box; /* لتضمين الحواف والpadding في عرض العنصر */
      padding: 4px; /* لإضافة بعض المساحة الداخلية */
      
    }

    .title {
      font-weight: bold; /* لجعل عنوان الجدول بارزًا */
    }

    /* يمكنك إضافة أنماط إضافية للعناصر الداخلية حسب الحاجة */
    select {
      width: 100%; /* اجعل عنصر select يأخذ عرض الخلية */
    }

    input[type="text"] {
      width: 100%; /* اجعل حقل النص يأخذ عرض الخلية */
    }
    `;
    this.IsPrinting = true;

    setTimeout(() => {
      const tableElement = document.getElementById('print-form');
      if (!tableElement) return;

      const printWindow = window.open('', '', 'width=900,height=650');
      if (!printWindow) return;

      const style = `
       <style>
         body { direction: ltr; font-family: Arial, sans-serif; padding: 20px; }
         table { width: 100%; border-collapse: collapse; }
         th, td { border: 1px solid #000; padding: 10px; text-align: left; }
         th { background-color: #f0f0f0; }
         button { display: none; }
         ${cssRadioList}
         ${cssCheckList}
         ${cssFormImg}
         ${cssPanel}
       </style>
     `;

      printWindow.document.write(`
       <html>
         <head>
           <title></title>
           ${style}
         </head>
         <body>
           ${tableElement.outerHTML}
         </body>
       </html>
     `);

      printWindow.document.close();



      printWindow.onload = () => {
        const imgs = printWindow.document.getElementsByClassName('img-form') as HTMLCollectionOf<HTMLImageElement>;
        if (imgs.length > 0 && !imgs[0].complete) {
          imgs[0].onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
            setTimeout(() => {
              this.IsPrinting = false;
            }, 250);
          };
        } else {
          // الصورة محمّلة بالفعل
          printWindow.focus();
          printWindow.print();
          printWindow.close();
          setTimeout(() => {
            this.IsPrinting = false;
          }, 250);
        }
      };





      // printWindow.focus();
      // printWindow.print();
      // printWindow.close();
      // setTimeout(() => {
      //   this.IsPrinting = false;
      // }, 250);
    }, 250);

  }

  getUnit(IDP) {
    return this.tblUnit.find(x => x.IDP == IDP);
  }
  getRoute(IDP) {
    return this.tblRoute.find(x => x.IDP == IDP);
  }
  getTimesDaily(IDP) {
    return this.tblTimesDaily.find(x => x.IDP == IDP);
  }
  getDurationUnit(IDP) {
    return this.tblDurationUnit.find(x => x.IDP == IDP);
  }

  searchForAppts(ev) {
    console.log(ev);
    // search for file no
    let Query0 = `select 
      a.ID, a.IDY,a.IDBranch,
      a.IDP AppointmentNo,
      a.ADate,
      Concat(Date(a.ADate)," ",Hour(a.ADate),":",Minute(a.ADate)) ATime,
      a.IDPatient,
      p.NameE PatientNameE,p.NameA PatientNameA,
      p.IDAcc,
      if(c.ID is null ,0,c.Ac_Num) FileNo,
      a.IDDoctor,e.ID_Acc IDDoctorAcc,
      e.SName,
      e.Full_Name_eng DoctorNameE, e.Full_Name_Ar DoctorNameA,
      a.IDTranDoctor,
      e.IDItem DefaultService,
      a.IDOperatingRoom,ifnull(R.NameE,"") OperNameE,ifNull(R.NameA,"") OperNameA,
      a.AType,a.VisitType,
      a.Duration,
      a.Description,
      a.Invoiced,a.HasMedicalRcord,
      a.IsOnline,a.IsOnCall,
      a.ConfirmStatus,
      a.AttendUser,a.Attend, a.Enter, a.AOut,
      if(a.invoiced>0,0,a.Deleted) Deleted,
      a.AttendTime,
      a.IDProcedure,
      a.CreatedUser,
      p.Classification,
      p.BirthDate, p.Sex,p.SocialID,
      p.Phon1,p.Phon2,p.Phon3,
      p.AttendCount,p.NotAttendAfterConfirm,
      p.MonyStatus, p.PatientPoints, p.FutureAppt,
      p.ApptCount,p.OperatingRoomSessionCount,p.AttendLate,p.NotAttend,p.BlackPoints,p.AttendAndDelayedCount,p.IDCity,
      if((SELECT Sum(Length(TextMessage)) FROM patientcommunication where IDPatient=a.IDPatient and DoneUser<=0)>0,True,False) HasMessages,
      ifnull((SELECT ifnull(Max(ADate),0) FROM Appointments where IDC=a.IDC and IDY>0 and IDP>0 and IDPatient=a.IDPatient and Deleted=0 and Attend=1 and ADate<a.ADate),Date(0)) LastVisit,
      if(p.IDDoctor=0,1,0) IsCurrentDoctor,
      IfNull(O.join_url,"") join_url,
      if(rr.id is null,0,if(rr.IDAppt>0,2,1)) Required
      ,IfNull((Select IfNull(Count(Pi.ID),0) from PatientIllness Pi where PI.IDC=a.IDC and Pi.IDPatient=a.IDPatient Group By Pi.IDPatient),0) IllnessCount
      from (
        Select p.* From patients p
        where p.idc=${this.all.User.IDC} and
              ("0"="0" or p.SocialID="0")    and
              ("0"="0" or p.Phon1 like "0" or p.Phon2 like "0" or p.Phon3 like "0" )
        ) p
      inner join appointments a on a.idpatient=p.idp
      inner join Employees e on a.idc=e.idc and a.idDoctor=e.iDP
      inner join acc c on p.idc=c.idc and p.idAcc=c.idp
      Left Join apptonline O on a.IDC=o.IDC and a.IDY=o.IDY and a.IDP=o.IDAppt
      LEft join OperatingRooms R on R.idc=a.idc and R.idP=a.IDOperatingRoom
      Left join appointmentsrequired rr on a.idc=rr.idc and a.idy=rr.idy and a.idp=rr.idAppointment
      Where a.idc=${this.all.User.IDC} 
      and ((a.Deleted=0) or a.invoiced>0 or a.HasMedicalRcord>0 or (a.ADate>CurDate() and a.Deleted=0) )
      and ( a.ADate<CurDate() or (0=0 or a.IDDoctor=0) )
      and ( (0="0" or a.IDP="0") and (0="${ev}" or c.Ac_Num="${ev}") )
      Order by Date(a.ADate),Hour(A.ADate),Minute(A.ADate), a.Invoiced desc, a.AttendTime, if(if(a.invoiced>0,0,a.Deleted),1000000,null)`;

    // search for appointments
    let Query1 = `select 
      a.ID, a.IDY,a.IDBranch,
      a.IDP AppointmentNo,
      a.ADate,
      Concat(Date(a.ADate)," ",Hour(a.ADate),":",Minute(a.ADate)) ATime,
      a.IDPatient,
      p.NameE PatientNameE,p.NameA PatientNameA,
      p.IDAcc,
      if(c.ID is null ,0,c.Ac_Num) FileNo,
      a.IDDoctor,e.ID_Acc IDDoctorAcc,
      e.SName,
      e.Full_Name_eng DoctorNameE, e.Full_Name_Ar DoctorNameA,
      a.IDTranDoctor,
      e.IDItem DefaultService,
      a.IDOperatingRoom,ifnull(R.NameE,"") OperNameE,ifNull(R.NameA,"") OperNameA,
      a.AType,a.VisitType,
      a.Duration,
      a.Description,
      a.Invoiced,a.HasMedicalRcord,
      a.IsOnline,a.IsOnCall,
      a.ConfirmStatus,
      a.AttendUser,a.Attend, a.Enter, a.AOut,
      if(a.invoiced>0,0,a.Deleted) Deleted,
      a.AttendTime,
      a.IDProcedure,
      a.CreatedUser,
      p.Classification,
      p.BirthDate, p.Sex,p.SocialID,
      p.Phon1,p.Phon2,p.Phon3,
      p.AttendCount,p.NotAttendAfterConfirm,
      p.MonyStatus, p.PatientPoints, p.FutureAppt,
      p.ApptCount,p.OperatingRoomSessionCount,p.AttendLate,p.NotAttend,p.BlackPoints,p.AttendAndDelayedCount,p.IDCity,
      if((SELECT Sum(Length(TextMessage)) FROM patientcommunication where IDPatient=a.IDPatient and DoneUser<=0)>0,True,False) HasMessages,
      ifnull((SELECT ifnull(Max(ADate),0) FROM Appointments where IDC=a.IDC and IDY>0 and IDP>0 and IDPatient=a.IDPatient and Deleted=0 and Attend=1 and ADate<a.ADate),Date(0)) LastVisit,
      if(p.IDDoctor=0,1,0) IsCurrentDoctor,
      IfNull(O.join_url,"") join_url,
      if(rr.id is null,0,if(rr.IDAppt>0,2,1)) Required
      ,IfNull((Select IfNull(Count(Pi.ID),0) from PatientIllness Pi where PI.IDC=a.IDC and Pi.IDPatient=a.IDPatient Group By Pi.IDPatient),0) IllnessCount
      from (
        Select p.* From patients p
        where p.idc=${this.all.User.IDC}  and
              ("0"="0" or p.SocialID="0")    and
              ("0"="0" or p.Phon1 like "0" or p.Phon2 like "0" or p.Phon3 like "0" )
        ) p
      inner join appointments a on a.idpatient=p.idp
      inner join Employees e on a.idc=e.idc and a.idDoctor=e.iDP
      inner join acc c on p.idc=c.idc and p.idAcc=c.idp
      Left Join apptonline O on a.IDC=o.IDC and a.IDY=o.IDY and a.IDP=o.IDAppt
      LEft join OperatingRooms R on R.idc=a.idc and R.idP=a.IDOperatingRoom
      Left join appointmentsrequired rr on a.idc=rr.idc and a.idy=rr.idy and a.idp=rr.idAppointment
      Where a.idc=${this.all.User.IDC} 
      and ((a.Deleted=0) or a.invoiced>0 or a.HasMedicalRcord>0 or (a.ADate>CurDate() and a.Deleted=0) )
      and ( a.ADate<CurDate() or (0=0 or a.IDDoctor=0) )
      and ( (0="${ev}" or a.IDP="${ev}") and (0="0" or c.Ac_Num="0") )
      Order by Date(a.ADate),Hour(A.ADate),Minute(A.ADate), a.Invoiced desc, a.AttendTime, if(if(a.invoiced>0,0,a.Deleted),1000000,null)`;


    let Query = `${Query0};${Query1}`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);

      // if (res[`Q0`].length > 0) {
      //   this.tblAppts = res[`Q0`];
      // } else {
      //   this.tblAppts = res[`Q1`];
      // }

      this.tblAppts = res[`Q0`].concat(res[`Q1`]);


      this.columns = [
        { prop: 'ATime', name: 'ATime' },
        { prop: 'FileNo', name: 'FileNo' },
        { prop: 'PatientNameE', name: 'PatientNameE' },
        { prop: 'SName', name: 'SName' },
        { prop: 'DoctorNameE', name: 'DoctorNameE' },
        { prop: 'Duration', name: 'Duration' },
      ];
      this.Appt = null;
      console.log(`rows= `, this.tblAppts);

    });
  }

  getDataByDate() {
    // alert(2) // TodayAppts, MyAppts, MyNotDoneAppts, PatientAppts, PatientServices, Messages, MyStatistics
    switch (this.SelectedBtn) {
      case `TodayAppts`:
        this.getLoad(this.CurrentDate, false);
        break;

      case `MyAppts`:
        this.getLoad(this.CurrentDate, true);
        break;
      case `MyNotDoneAppts`:
        this.getLoad(this.CurrentDate, true, true);
        break;
      case `PatientAppts`:
        this.getPatientAppts(this.Appt.IDPatient, this.Appt.IDDoctor);
        break;
      case `PatientServices`:
        this.getPatientServices(this.Appt.IDPatient);
        break;
    }
  }

  IllnessColor = false;
  IllnessInterval = null;
  checkIlness() {
    clearInterval(this.IllnessInterval);
    if (!this.Appt || this.Appt.IllnessCount == 0) {
      this.IllnessColor = false;
      return;
    }

    this.IllnessInterval = setInterval(() => {
      this.IllnessColor = !this.IllnessColor;
    }, 500);
  }

  getLoad(QueryDate = `2025-04-14`, IsMyAppt = true, IsMyNotDone = false) { // this.all.getDateNow(`-`)

    let Query0 = `select
      a.ID, a.IDY,a.IDBranch,
      a.IDP AppointmentNo,
      a.ADate,
      Time(a.ADate) ATime,
      a.IDPatient,
      p.NameE PatientNameE,p.NameA PatientNameA,
      p.IDAcc,
      if(c.ID is null ,0,c.Ac_Num) FileNo,
      a.IDDoctor,e.ID_Acc IDDoctorAcc,
      e.SName,
      e.Full_Name_eng DoctorNameE, e.Full_Name_Ar DoctorNameA,
      a.IDTranDoctor,
      e.IDItem DefaultService,
      a.IDOperatingRoom,ifnull(R.NameE,"") OperNameE,ifNull(R.NameA,"") OperNameA,
      a.AType,a.VisitType,
      a.Duration,
      a.Description,
      a.Invoiced,a.HasMedicalRcord,
      a.IsOnline,a.IsOnCall,
      a.ConfirmStatus,
      a.AttendUser,a.Attend, a.Enter, a.AOut,
      if(a.invoiced=1,0,a.Deleted) Deleted,
      a.AttendTime,
      a.IDProcedure,
      a.CreatedUser,
      p.Classification,
      p.BirthDate, p.Sex,p.SocialID,
      p.Phon1,p.Phon2,p.Phon3,
      p.AttendCount,p.NotAttendAfterConfirm,
      p.MonyStatus, p.PatientPoints, p.FutureAppt,
      p.ApptCount,p.OperatingRoomSessionCount,p.AttendLate,p.NotAttend,p.BlackPoints,p.AttendAndDelayedCount,p.IDCity,
      if((SELECT Sum(Length(TextMessage)) FROM patientcommunication where IDPatient=a.IDPatient and DoneUser<=0)>0,True,False) HasMessages,
      IfNull(O.join_url,"") join_url,
      ifnull((SELECT ifnull(Max(ADate),0) FROM Appointments where IDC=a.IDC and IDY>0 and IDP>0 and IDPatient=a.IDPatient and Deleted=0 and Attend=1 and ADate<a.ADate),Date(0)) LastVisit,
      if(rr.id is null,0,if(rr.IDAppt>0,2,1)) Required
      ,IfNull((Select IfNull(Count(Pi.ID),0) from PatientIllness Pi where PI.IDC=a.IDC and Pi.IDPatient=a.IDPatient Group By Pi.IDPatient),0) IllnessCount
      from appointments a
      inner join Employees e on a.idc=e.idc and a.idDoctor=e.iDP
      inner join patients p on a.idc=p.idc and a.idpatient=p.idp
      LEft join acc c on p.idc=c.idc and p.idAcc=c.idp
      Left Join apptonline O on a.IDC=o.IDC and a.IDY=o.IDY and a.IDP=o.IDAppt
      LEft join OperatingRooms R on R.idc=a.idc and R.idP=a.IDOperatingRoom
      Left join appointmentsrequired rr on a.idc=rr.idc and a.idy=rr.idy and a.idp=rr.idAppointment
      where a.idc=${this.all.User.IDC}  
      and (a.Deleted=0 or a.invoiced>0) and
      a.ADate between ("${QueryDate} 00:00:00" +interval +5 hour) and ("${QueryDate} 00:00:00" +interval 24+${this.all.RegisterData.AdditionalHoursForDay} hour)
      ${IsMyAppt ? ` and (0=${this.IDDoctorCurrent} or a.IDDoctor=${this.IDDoctorCurrent})` : ''}
      Group by a.id having HasMedicalRcord<=0
      Order by Date(A.ADate),Hour(A.ADate),Minute(A.ADate), a.Invoiced desc, a.AttendTime, if(if(a.invoiced>0,0,a.Deleted),1000000,null)
      `;

    let Query1 = `Select IDP as IDDoctorCurrent from Employees where idc=${this.all.User.IDC} and idUserConected=${this.all.User.IDP}`;

    let Query = `${Query0};${Query1}`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      let Q0 = res[`Q0`];
      if (res[`Q1`].length > 0) {
        this.IDDoctorCurrent = res[`Q1`][0].IDDoctorCurrent;
      }


      if (IsMyNotDone) {
        this.tblAppts = Q0.filter(x => x.HasMedicalRcord <= 0);
      } else {
        this.tblAppts = Q0;
      }
      // this.tblSourceAppts = Q0;

      // alert(JSON.stringify(Q0.filter(x=>x.IllnessColor>0).length));
      this.Appt = null;

      this.columns = [
        { prop: 'ATime', name: 'ATime' },
        { prop: 'FileNo', name: 'FileNo' },
        { prop: 'PatientNameE', name: 'PatientNameE' },
        { prop: 'Duration', name: 'Duration' },
      ];

      console.log(`rows= `, this.tblAppts);

    });

    this.storage.get(DIAGNOSIS_DATA).then(val => {
      if (val) {
        this.tblDiagnosis = val;
      } else {
        this.syncDiagnosisCode();
      }
    });
  }

  getPatientAppts(IDPatient, IDDoctor = 0) {
    let Query0 = `select
    a.ID,a.IDY,a.IDBranch,
    a.IDP AppointmentNo,
    a.ADate,
    Concat(Date(a.ADate)," ",Hour(a.ADate),":",Minute(a.ADate)) ATime,
    a.IDPatient,
    p.NameE PatientNameE,p.NameA PatientNameA,
    p.IDAcc,
    if(c.ID is null ,0,c.Ac_Num) FileNo,
    a.IDDoctor,e.ID_Acc IDDoctorAcc,
    e.SName,
    e.Full_Name_eng DoctorNameE, e.Full_Name_Ar DoctorNameA,
    a.IDTranDoctor,
    e.IDItem DefaultService,
    a.IDOperatingRoom,ifnull(R.NameE,"") OperNameE,ifNull(R.NameA,"") OperNameA,
    a.AType,a.VisitType,
    a.Duration,
    a.Description,
    a.Invoiced,a.HasMedicalRcord,
    a.IsOnline,a.IsOnCall,
    a.ConfirmStatus,
    a.AttendUser,a.Attend, a.Enter, a.AOut,
    if(a.invoiced>0,0,a.Deleted) Deleted,
    a.AttendTime,
    a.IDProcedure,
    a.CreatedUser,
    p.Classification,
    p.BirthDate, p.Sex,p.SocialID,
    p.Phon1,p.Phon2,p.Phon3,
    p.AttendCount,p.NotAttendAfterConfirm,
    p.MonyStatus, p.PatientPoints, p.FutureAppt,
    p.ApptCount,p.OperatingRoomSessionCount,p.AttendLate,p.NotAttend,p.BlackPoints,p.AttendAndDelayedCount,p.IDCity,
    if((SELECT Sum(Length(TextMessage)) FROM patientcommunication where IDPatient=a.IDPatient and DoneUser<=0)>0,True,False) HasMessages,
    IfNull(O.join_url,"") join_url,
    ifnull((SELECT ifnull(Max(ADate),0) FROM Appointments where IDC=a.IDC and IDY>0 and IDP>0 and IDPatient=a.IDPatient and Deleted=0 and Attend=1 and ADate<a.ADate),Date(0)) LastVisit,
    if(rr.id is null,0,if(rr.IDAppt>0,2,1)) Required
    ,IfNull((Select IfNull(Count(Pi.ID),0) from PatientIllness Pi where PI.IDC=a.IDC and Pi.IDPatient=a.IDPatient Group By Pi.IDPatient),0) IllnessCount
    from appointments a
    inner join Employees e on a.idc=e.idc and a.idDoctor=e.iDP
    inner join patients p on a.idc=p.idc and a.idpatient=p.idp
    LEft join acc c on p.idc=c.idc and p.idAcc=c.idp
    Left Join apptonline O on a.IDC=o.IDC and a.IDY=o.IDY and a.IDP=o.IDAppt
    LEft join OperatingRooms R on R.idc=a.idc and R.idP=a.IDOperatingRoom
    Left join appointmentsrequired rr on a.idc=rr.idc and a.idy=rr.idy and a.idp=rr.idAppointment
    where a.idc=${this.all.User.IDC} and a.idy>0
    and a.IDPatient=${IDPatient} 
    and (a.Deleted=0 or a.invoiced>0 or a.HasMedicalRcord>0 or (a.ADate>=CurDate() and a.Deleted=0) )
    and ((0=${IDDoctor} or a.IDDoctor=${IDDoctor}) or a.ADate<CurDate() )
    Group by a.id
    Order by Date(a.ADate),Hour(A.ADate),Minute(A.ADate), a.Invoiced desc, a.AttendTime, if(if(a.invoiced>0,0,a.Deleted),1000000,null)`;

    let Query = `${Query0}`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      let Q0 = res[`Q0`];
      // this.tblSourceAppts = res[`Q0`];
      this.tblAppts = Q0;
      this.Appt = null;

      this.columns = [
        { prop: 'ATime', name: 'ATime' },
        { prop: 'FileNo', name: 'FileNo' },
        { prop: 'PatientNameE', name: 'PatientNameE' },
        { prop: 'SName', name: 'SName' },
        { prop: 'DoctorNameE', name: 'DoctorNameE' },
        { prop: 'Duration', name: 'Duration' },
      ];

      console.log(`rows= `, this.tblAppts);

    });
  }

  getPatientServices(IDPatient) {
    let Query0 = `SELECT
      d.IDC, d.IDY, d.IDBranch, d.VType, d.IDV, d.ADate, Concat(Date(d.ADate)," ",Hour(d.ADate),":",Minute(d.ADate)) ATime, p.IDP IDPatient,
      p.NameE PatientNameE,p.NameA PatientNameA,
      p.IDAcc,
      if(c.ID is null ,0,c.Ac_Num) FileNo,
      e.IDP IDDoctor,e.ID_Acc IDDoctorAcc,
      e.SName,
      e.Full_Name_eng DoctorNameE, e.Full_Name_Ar DoctorNameA,
      e.IDItem DefaultService,

      I.IDP IDItem,
      I.IDHand, I.PartNo,
      if(trim(I.NameA)="",I.NameE,I.NameA) ServiceNameA,
      if(trim(I.NameE)="",I.NameA,I.NameE) ServiceNameE,
      d.Debit Net
      FROM items i
      inner join journalsD d on (i.IDC,i.IDP)=(d.IDC,d.IDItem)
      inner join journals j on (j.IDC,j.IDY,j.IDBranch,j.Vtype,j.IDV)=(d.IDC,d.IDY,d.IDBranch,d.Vtype,d.IDV)
      inner join Acc a on (a.IDC,a.IDP)=(j.IDC,j.IDDoctorAcc)
      inner join Employees e on (e.IDC,e.ID_Acc)=(a.IDC,a.IDP)
      inner join Patients P on (P.IDC,P.IDAcc)=(d.IDC,d.IDAcc)
      LEft join acc c on p.idc=c.idc and p.idAcc=c.idp
      Where I.IDC=${this.all.User.IDC} and I.IDNature in (13,14) and I.IDAlias<=0 and d.VType=600 and d.Transfered=1
      and p.IDP=${IDPatient}
      Order by d.ADate,d.IDV,i.PartNo`;

    let Query = `${Query0}`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      let Q0 = res[`Q0`];
      // this.tblSourceAppts = res[`Q0`];
      this.tblAppts = Q0;
      this.Appt = null;

      this.columns = [
        { prop: 'ATime', name: 'ATime' },
        { prop: 'PartNo', name: 'PartNo' },
        { prop: 'ServiceNameE', name: 'ServiceNameE' },
        { prop: 'SName', name: 'SName' },
        { prop: 'DoctorNameE', name: 'DoctorNameE' },
      ];

      console.log(`rows= `, this.tblAppts);

    });
  }

  // myAppts() {
  //   this.tblAppts = this.tblSourceAppts;
  // }
  // myNotDoneAppts() {
  //   this.tblAppts = this.tblSourceAppts.filter(x => x.Done == 0);
  // }

  // getLoadData(Query){
  //   console.log(`Query= `, Query);

  //   const body = new HttpParams()
  //     .set('Mtype', 'A16')
  //     .set('Query', Query);

  //   this.all.postData(body).then(res => {
  //     console.log(`res= `, res);
  //     let Q0 = res[`Q0`];
  //     this.rows = Q0;
  //     if (this.tblDiagnosis.length == 0) {
  //       this.tblDiagnosis = res[`Q1`];
  //       this.storage.set(DIAGNOSIS_DATA, res[`Q1`]);
  //       // alert(`saved`)
  //     }
  //     console.log(`rows= `, this.rows);

  //   });
  // }

  syncDiagnosisCode() {
    let Query0 = `Select ID,Code,Diagnosis,DiagnosisA from ICD10 where IsDiagnosis=1`;
    let Query = `${Query0}`;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      this.tblDiagnosis = res[`Q0`];
      this.storage.set(DIAGNOSIS_DATA, res[`Q0`]);

    });
  }

  calculateDaysFromDate(targetDate) {
    // تحويل التاريخ المدخل إلى كائن تاريخ
    const target: any = new Date(targetDate);

    // الحصول على التاريخ الحالي
    const now: any = new Date();

    // حساب الفرق بالملي ثانية
    const differenceMs = now - target;

    // تحويل الفرق من ملي ثانية إلى أيام
    const daysDifference = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

    return daysDifference;
  }

  getIDAppt(appt) {
    let Query0 = `Call OpenMedicalRecord(${this.all.User.IDC},${appt.IDPatient},0,0)`;
    let Query = `${Query0}`;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      let Q0 = res[`Q0`];
      this.tblSession = Q0;
      if (Q0.length == 0) {
        this.tblService = [];
        this.tblMedicine = [];
        return;
      }

      this.SelectedSessionIndex = Q0.length - 1;
      this.SelectedSession = Q0[Q0.length - 1];
      this.getSession();

      // alert(this.tblSession.length)

      this.getFormData(this.tblSession[this.SelectedSessionIndex]);



    });
  }


  isIDFormat(text) {
    return /^ID_\d+$/.test(text);
  }
  tblForms = []; SelectedFormIndex = 0; tblFormItems = [];
  getFormData(data) {
    this.tblForms = []; this.SelectedFormIndex = 0; this.tblFormItems = []; this.SelectedTap = `default`;



    let OpenMedicalRecordSessionData = data;
    // this.FormRows = [];

    for (const key in OpenMedicalRecordSessionData) {
      if (OpenMedicalRecordSessionData.hasOwnProperty(key)) {

        if (this.isIDFormat(key) && OpenMedicalRecordSessionData[key] != 0) {
          let ID = key.split(`_`)[1];
          console.log(ID);
          let IDForm = this.tblFieldsMap.find(x => x.ID == ID).IDForm;

          if (!this.tblForms.find(x => x.IDForm == IDForm)) {
            let copyFieldsMapForm = this.all.deepCopy(this.tblFieldsMap.filter(x => x.IDForm == IDForm));
            this.tblForms.push({
              IDForm: IDForm,
              FieldsGroupA: copyFieldsMapForm[0].FieldsGroupA,
              FieldsGroupE: copyFieldsMapForm[0].FieldsGroupE,
              tblFormItems: copyFieldsMapForm
            });
          }

        }
      }
    }
    for (let form of this.tblForms) {
      for (let item of form.tblFormItems) {
        if (OpenMedicalRecordSessionData[`Report_${item.ID}`]) {
          item[`Report`] = OpenMedicalRecordSessionData[`Report_${item.ID}`]
        } else {
          item[`Report`] = ``;
        }
      }
    }
    // alert(this.tblForms.length);

    this.tblFormItems = this.tblForms[this.SelectedFormIndex].tblFormItems;
    console.log(`wwwww= `, this.tblForms);
    console.log(`qqqqqqqqqqqq= `, this.tblFormItems);
    // alert(JSON.stringify(this.tblFormItems));
  }

  setForm(i) {
    this.popoverController.dismiss();
    this.SelectedFormIndex = i;
    console.log(this.SelectedFormIndex);
    this.tblFormItems = this.tblForms[this.SelectedFormIndex].tblFormItems;
    this.SelectedTap = this.tblForms[this.SelectedFormIndex].IDForm;
  }

  tblService = []; tblSourceService = [];
  tblMedicine = []; tblSourceMedicine = [];
  getSession() {
    this.Appt.IDAppointment = this.SelectedSession.IDAppointment;
    this.Appt.ReportDate = this.SelectedSession.ReportDate;

    let Query0 = `SELECT
      c.ID, c.IDC, c.IDClinicalNote, c.IDAgreement, 0 PackageSerial , c.AsPackage, c.ReportDate, c.CType, c.IDPatient, c.IDDoctor, c.IDAppointment, c.IDUser, c.ADate, c.AgrType, c.IDItem,
      c.Quantity,c.MainPrice,c.Discount, c.DiscountDoctor,c.Price , c.Quantity*c.Price NetPrice ,
      Round(if(d.id is null, ifNull(p.Paid,0) ,abs(d.Debit-d.Credit)),2) PaidAmount,ifNull(j.VType,0) VType,ifNull(j.IDV,0) IDV,
      c.Done , c.Paid, c.Approved, c.Description, c.Name, c.StartDate, c.Dose, c.Duration, c.TimesDaily,c.EvryTime, c.Unit, c.Route, c.DurationUnit, c.PRN, c.Indications, c.Instructions, c.Tooth, c.SurfaceOfTooth, c.DiagnosisCode, c.DiagnosisDesc,
      Mid(c.OtherDiagnosis,1,256) OtherDiagnosis , Mid(c.Actually,1,255)Actually,
      concat(i.PartNo," - ",i.NameE) ServiceNameE ,
      concat(i.PartNo," - ",i.NameA) ServiceNameA,
      Case
      when c.Ctype=0 then "Charge Slip"
      when c.Ctype=1 then "Pre Paid Charge Slip"
      when c.Ctype=2 then "Recommanded"
      when c.Ctype=3 then "Insurance Approval"
      when c.Ctype=4 then "Pharmacy Discraption"
      end CTypeName
      FROM chargeslip c
      Left join Items i on c.idc=i.IDC and c.IDItem>0 and c.IDItem=i.IDP
      Left Join patients ps on ps.idc=c.idc and c.IDPatient>0 and ps.idP=c.IDPatient
      Left join Journals j on c.IDC=j.IDC and j.IDInvoice=c.IDAppointment and ps.IDAcc=j.IDPatientAcc and j.Transfered=1  and ((j.VType=500 and c.CType=1) or (j.VType=600 and c.CType=0))
      Left join JournalsD D on j.idc=d.idc and j.idy=d.idy and j.idbranch=d.idbranch and j.Vtype=d.Vtype and j.idv=d.idv  and d.IDItem=c.IDItem
      Left join patientservices p on j.idc=p.idc and j.idy=p.idy and j.idbranch=p.idbranch and j.Vtype=p.Vtype and j.idv=p.idv  and c.IDItem=p.IDItem and p.VType=500
      where c.IDC=${this.all.User.IDC} and c.CType in (0,1,2,3) and c.IDAppointment=${this.Appt.IDAppointment} and c.ReportDate="${this.Appt.ReportDate}"
      group by c.id`;
    // -- 101181503
    let Query1 = `SELECT c.*,
        if(c.IDItem<=0,c.Name , concat(i.PartNo," - ",i.NameE) ) MedicineNameE ,
        if(c.IDItem<=0,c.Name , concat(i.PartNo," - ",i.NameA) ) MedicineNameA
        FROM Demo.Chargeslip c
        Left join Demo.items i on c.idc=i.idc and c.IDItem=i.IDP
        where c.IDC=${this.all.User.IDC} and IDAppointment=${this.Appt.IDAppointment} and ReportDate="${this.Appt.ReportDate}" and c.CType=4`;
    // alert(4);
    let Query = `${Query0};${Query1}`;
    console.log(Query0);
    console.log(Query1);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      this.tblService = res[`Q0`];//.filter(x => x.CType == 0);
      this.tblSourceService = this.all.deepCopy(this.tblService);

      this.tblMedicine = res[`Q1`];
      this.tblSourceMedicine = this.all.deepCopy(this.tblMedicine);
      console.log(`res= `, res);

      this.getMaxDiscount();
    });
  }

  nextSession(no) {
    // alert(this.tblSession.length + '   |    ' + (this.SelectedSessionIndex + 1));
    if (no == 1 && this.tblSession.length == this.SelectedSessionIndex + 1) {
      return;
    } else if (no == -1 && this.SelectedSessionIndex == 0) {
      return;
    }
    this.SelectedSessionIndex += no;
    this.SelectedSession = this.tblSession[this.SelectedSessionIndex];
    this.getSession();
  }
  // firstSession() {
  //   if (this.SelectedSessionIndex == 0) return;
  //   this.SelectedSessionIndex = 0;
  //   this.getApptServices(this.SelectedSessionIndex);
  // }
  // previousSession() {
  //   if (this.SelectedSessionIndex == 0) return;
  //   this.SelectedSessionIndex--;
  //   this.getApptServices(this.SelectedSessionIndex);
  // }
  // nextSession() {
  //   if (this.SelectedSessionIndex == 0) return;
  //   this.SelectedSessionIndex++;
  //   this.getApptServices(this.SelectedSessionIndex);
  // }
  // lastSession() {
  //   if (this.SelectedSessionIndex == this.tblSession.length - 1) return;
  //   this.SelectedSessionIndex = +this.tblSession.length - 1;
  //   this.getApptServices(this.SelectedSessionIndex);
  // }

  // getApptServices(SessionIndex) {
  //   // alert(this.Appt.AppointmentNo + '   -   ' + Q0[Q0.length - 1].IDAppointment);
  //   this.Appt.IDAppointment = this.tblSession[SessionIndex].IDAppointment;
  //   this.Appt.ReportDate = this.tblSession[SessionIndex].ReportDate;

  //   let Query0 = `SELECT
  //     c.ID, c.IDC, c.IDClinicalNote, c.IDAgreement, 0 PackageSerial , c.AsPackage, c.ReportDate, c.CType, c.IDPatient, c.IDDoctor, c.IDAppointment, c.IDUser, c.ADate, c.AgrType, c.IDItem,
  //     c.Quantity,c.MainPrice,c.Discount, c.DiscountDoctor,c.Price , c.Quantity*c.Price NetPrice ,
  //     Round(if(d.id is null, ifNull(p.Paid,0) ,abs(d.Debit-d.Credit)),2) PaidAmount,ifNull(j.VType,0) VType,ifNull(j.IDV,0) IDV,
  //     c.Done , c.Paid, c.Approved, c.Description, c.Name, c.StartDate, c.Dose, c.Duration, c.TimesDaily,c.EvryTime, c.Unit, c.Route, c.DurationUnit, c.PRN, c.Indications, c.Instructions, c.Tooth, c.SurfaceOfTooth, c.DiagnosisCode, c.DiagnosisDesc,
  //     Mid(c.OtherDiagnosis,1,256) OtherDiagnosis , Mid(c.Actually,1,255)Actually,
  //     concat(i.PartNo," - ",i.NameE) ServiceNameE ,
  //     concat(i.PartNo," - ",i.NameA) ServiceNameA,
  //     Case
  //     when c.Ctype=0 then "Charge Slip"
  //     when c.Ctype=1 then "Pre Paid Charge Slip"
  //     when c.Ctype=2 then "Recommanded"
  //     when c.Ctype=3 then "Insurance Approval"
  //     when c.Ctype=4 then "Pharmacy Discraption"
  //     end CTypeName
  //     FROM chargeslip c
  //     Left join Items i on c.idc=i.IDC and c.IDItem>0 and c.IDItem=i.IDP
  //     Left Join patients ps on ps.idc=c.idc and c.IDPatient>0 and ps.idP=c.IDPatient
  //     Left join Journals j on c.IDC=j.IDC and j.IDInvoice=c.IDAppointment and ps.IDAcc=j.IDPatientAcc and j.Transfered=1  and ((j.VType=500 and c.CType=1) or (j.VType=600 and c.CType=0))
  //     Left join JournalsD D on j.idc=d.idc and j.idy=d.idy and j.idbranch=d.idbranch and j.Vtype=d.Vtype and j.idv=d.idv  and d.IDItem=c.IDItem
  //     Left join patientservices p on j.idc=p.idc and j.idy=p.idy and j.idbranch=p.idbranch and j.Vtype=p.Vtype and j.idv=p.idv  and c.IDItem=p.IDItem and p.VType=500
  //     where c.IDC=${this.all.User.IDC} and c.CType in (0,1,2,3) and c.IDAppointment=${this.Appt.IDAppointment} and c.ReportDate="${this.Appt.ReportDate}"
  //     group by c.id`;
  //   // -- 101181503
  //   let Query1 = `SELECT c.*,
  //       if(c.IDItem<=0,c.Name , concat(i.PartNo," - ",i.NameE) ) MedicineNameE ,
  //       if(c.IDItem<=0,c.Name , concat(i.PartNo," - ",i.NameA) ) MedicineNameA
  //       FROM Demo.Chargeslip c
  //       Left join Demo.items i on c.idc=i.idc and c.IDItem=i.IDP
  //       where c.IDC=${this.all.User.IDC} and IDAppointment=${this.Appt.IDAppointment} and ReportDate="${this.Appt.ReportDate}" and c.CType=4`;
  //   // alert(4);
  //   let Query = `${Query0};${Query1}`;
  //   console.log(Query0);
  //   console.log(Query1);

  //   const body = new HttpParams()
  //     .set('Mtype', 'A16')
  //     .set('Query', Query);

  //   this.all.postData(body).then(res => {
  //     console.log(`res= `, res);
  //     this.tblService = res[`Q0`];//.filter(x => x.CType == 0);
  //     this.tblSourceService = this.all.deepCopy(this.tblService);

  //     this.tblMedicine = res[`Q1`];
  //     this.tblSourceMedicine = this.all.deepCopy(this.tblMedicine);
  //     console.log(`res= `, res);

  //     this.getMaxDiscount();
  //   });
  // }

  tblDiscount = [{ IDItem: 0, MaxDiscount: 0, MinDiscount: 0, AvgDiscount: 0 }];
  getMaxDiscount() {
    this.tblDiscount = [];
    if (this.tblService.length == 0) {
      return;
    }
    let IDItems = '';
    for (let s of this.tblService) {
      if (IDItems != ``) {
        IDItems += ',';
      }
      IDItems += `${s.IDItem}`;
    }
    let Query0 = `Select IDItem,
        Max(if(Discount>0 and UnitPrice>0,(Discount+DiscountDoctor)/UnitPrice *100,0)) MaxDiscount,
        ifnull(Min(if(Discount>0 and UnitPrice>0,(Discount+DiscountDoctor)/UnitPrice *100,null)),0) MinDiscount,
        avg(if(Discount>0 and UnitPrice>0,(Discount+DiscountDoctor)/UnitPrice *100,0)) AvgDiscount
        from journalsd
        where idc=${this.all.User.IDC}
        and ADate between curdate()+interval -2 year and Now()
        and transfered=1 and vtype=600 and iditem>0 and quantity>0
        and IDItem in('${IDItems}')
        Group by idc,iditem`;

    // AdditionalDiscountPersent   hbhbhb 
    let Query1 = `select PR(0,'Additional.Discount.Persent') DefaultPackageDiscountPersent`;


    let Query = `${Query0};${Query1}`;
    console.log(Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body, false).then(res => {
      console.log(`res= `, res);
      this.tblDiscount = res[`Q0`];
      this.DefaultPackageDiscountPersent = res[`Q1`][`DefaultPackageDiscountPersent`];
      // alert(1);
    });
  }

  columns = [
    { prop: 'ATime', name: 'ATime' },
    { prop: 'FileNo', name: 'FileNo' },
    { prop: 'PatientNameE', name: 'PatientNameE' },
    { prop: 'Duration', name: 'Duration' },
  ];

  ItemOptions = [
    {
      ID: 1,
      Label: `Show Appointment`,
      Icon: `eye`,
      Color: `primary`
    },
    {
      ID: 2,
      Label: `Request for Appointment`,
      Icon: `calendar`,
      Color: `primary`
    },
    {
      ID: 3,
      Label: `Create New Appointment`,
      Icon: ``,
      Color: `primary`,
      Src: `calendar-add-bold.svg`
    },
    {
      ID: 4,
      Label: `Go To Appointments`,
      Icon: `calendar`,
      Color: `primary`
    },
    {
      ID: 5,
      Label: `Open Meet Session`,
      Icon: `camera`,
      Color: `warning`,
      ExtraText: `(فتح دعوة عل برنامج الميت او الزوم و خلافه)`
    }
  ];

  // doAction(row: any) {
  //   alert('تم الضغط على: ' + row.name);
  // }
  // printTable() {

  // }

  // jsonData = [
  //   { name: 'أحمد', age: 30, date: '2023-06-15' },
  //   { name: 'سارة', age: 25, date: '2023-05-01' },
  //   { name: 'ليلى', age: 40, date: '2023-07-10' }
  // ];

  Appt = null;
  selectItem(ev) {
    console.log(`ev= `, ev);

    if (this.SelectedServiceIndex >= 0) {
      if (JSON.stringify(this.tblService[this.SelectedServiceIndex]) != JSON.stringify(this.tblSourceService.find(x => x.ID == this.tblService[this.SelectedServiceIndex].ID))) {
        this.all.confirm(this.all.translate.instant(`You will lose the information you modified. Do you want to continue?`)).then(yes => {
          if (yes) {
            this.getSelectItem(ev);
          } else {
            this.Appt = null;
            setTimeout(() => {
              console.log(`wwwwwwww`);
              this.Appt = this.LastSelectedAppt;
            }, 100);
            return;
          }
        });
      }
    } else if (this.SelectedMedicineIndex >= 0) {
      if (JSON.stringify(this.tblMedicine[this.SelectedMedicineIndex]) != JSON.stringify(this.tblSourceMedicine.find(x => x.ID == this.tblMedicine[this.SelectedMedicineIndex].ID))) {
        this.all.confirm(this.all.translate.instant(`You will lose the information you modified. Do you want to continue?`)).then(yes => {
          if (yes) {
            this.getSelectItem(ev);
          } else {
            this.Appt = null;
            setTimeout(() => {
              console.log(`eeeeeeee`);
              this.Appt = this.LastSelectedAppt;
            }, 100);

            return;
          }
        });
      }
    } else {
      this.getSelectItem(ev);
      this.checkIlness();
    }

    // 
    // this.Appt = ev;
    // this.SelectedMedicine = null;
    // this.SelectedService = null;
    // this.getIDAppt(ev);///////////////////////
  }
  LastSelectedAppt = null;
  getSelectItem(ev) {
    this.Appt = ev;
    this.LastSelectedAppt = ev;
    this.SelectedMedicineIndex = -1;
    this.SelectedServiceIndex = -1;
    this.getIDAppt(ev);
  }

  newApp(IsNew, IsOnCall = 0, ApptData = null, IDDoctor = 0, IsWalk = 0, IDOperatingRoom = 0) {
    // -- __________ الخدمة أو الاجر  tblService ___________
    let Query0 = `Select 0 IDP,1 IDC,0 IDNature,0 It_Level,0 PartNo,0 IDHand,"Any" NameE,"Any" NameA,"" NickName,0 DurationTime union all Select IDP,IDC,IDNature,It_Level,PartNo,IDHand,NameE,NameA,NickName,DurationTime from Items where IDC=${this.all.User.IDC} AND IDNature in (13,14,15,16)`;
    // -- __________ غ.غ ____ O.R _______
    let Query1 = `Select 0 ID,0 IDP,"Any OperatingRoom" NameE,"Any OperatingRoom" NameA,0 IDBranch,0 RoomType union all Select ID,IDP,NameE,NameA,IDBranch,RoomType from OperatingRooms where IDC=${this.all.User.IDC}`;
    // -- ___________ الغرض / الحزمة ___ Offer / Pkg _______
    let Query2 = `SELECT 0 ID,0 IDP,"None" NameE,"None" NameA,2 AgrType Union All SELECT ID,IDP,NameE,NameA,AgrType FROM agreements a where IDC=${this.all.User.IDC} and AgrType in (2,3,4)`;
    // -- ___________ الأفرع ____Branch______
    let Query3 = `Select 0 ID,0 IDP,"Any Branch" NameE,"Any Branch" NameA UNION ALL Select ID,IDP,NameE,NameA from branchs where IDC=${this.all.User.IDC}`;
    // -- ___________ المريض ____patients______
    let Query4 = `Select * from patients where idc=${this.all.User.IDC} and idP=${this.all.Patient.IDP}`;
    // -- ___________ التخدير ____ Anesthetist ______
    let Query5 = `select ID, NameE, NameA from AnesthetistDoctors where IDC=${this.all.User.IDC} and Active=1`;

    let Query = `${Query0};${Query1};${Query2};${Query3};${Query4};${Query5}`;

    if (IsNew == false) {
      Query4 = `Select * from patients where IDC=${this.all.User.IDC} and idP=${ApptData.IDPatient}`;

      let Query6 = `SELECT * FROM Appointments where IDC=${this.all.User.IDC} and IDY=${this.all.RegisterData.FinancialYear} and IDP in (${ApptData.AppointmentNo}) order by ADate desc`;
      let Query7 = `SELECT * FROM MedicalProcedures where IDC=${this.all.User.IDC} and IDAppointment=${ApptData.AppointmentNo}`;
      let Query8 = `Select count(*) v from patientsblacklist where IDC=${this.all.User.IDC} and IDPatient=${ApptData.IDPatient} and (0=0 or IDDoctor in (0,0) )`;
      let Query9 = `SELECT TextMessage FROM patientcommunication where IDPatient=${ApptData.IDPatient} and DoneUser<=0`;
      // let Query001 = `Select 0 IDP,1 IDC,0 IDNature,0 It_Level,0 PartNo,0 IDHand,"Any" NameE,"Any" NameA,"" NickName union all Select IDP,IDC,IDNature,It_Level,PartNo,IDHand,NameE,NameA,NickName from Items where IDC=${this.all.User.IDC} AND IDNature in (13,14,15,16)`;

      Query = `${Query0};${Query1};${Query2};${Query3};${Query4};${Query5};${Query6};${Query7};${Query8};${Query9}`;
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
      if (res[`Q2Error`] != "") {
        this.all.ngxToast(`Q2Error= `, res[`Q2Error`], `warning`);
        console.log(`Q2Error= `, res[`Q2Error`]);
      }
      if (res[`Q3Error`] != "") {
        this.all.ngxToast(`Q3Error= `, res[`Q3Error`], `warning`);
        console.log(`Q3Error= `, res[`Q3Error`]);
      }
      if (res[`Q4Error`] != "") {
        this.all.ngxToast(`Q4Error= `, res[`Q4Error`], `warning`);
        console.log(`Q4Error= `, res[`Q4Error`]);
      }
      if (res[`Q5Error`] != "") {
        this.all.ngxToast(`Q5Error= `, res[`Q5Error`], `warning`);
        console.log(`Q5Error= `, res[`Q5Error`]);
      }
      if (IsNew == false) {
        if (res[`Q6Error`] != "") {
          this.all.ngxToast(`Q6Error= `, res[`Q6Error`], `warning`);
          console.log(`Q6Error= `, res[`Q6Error`]);
        }
        if (res[`Q7Error`] != "") {
          this.all.ngxToast(`Q7Error= `, res[`Q7Error`], `warning`);
          console.log(`Q7Error= `, res[`Q7Error`]);
        }
        if (res[`Q8Error`] != "") {
          this.all.ngxToast(`Q8Error= `, res[`Q8Error`], `warning`);
          console.log(`Q8Error= `, res[`Q8Error`]);
        }
        if (res[`Q9Error`] != "") {
          this.all.ngxToast(`Q9Error= `, res[`Q9Error`], `warning`);
          console.log(`Q9Error= `, res[`Q9Error`]);
        }
      }

      let tblService = res[`Q0`];
      let tblOR = res[`Q1`];
      let tblOfferPkg = res[`Q2`];
      let tblBranch = res[`Q3`];
      let tblPatients = res[`Q4`];
      let tblAnesthetist = res[`Q5`];


      let Appointments = null;
      let tblMedicalProcedures = []; //---- 
      let tblPatientsblacklist = []; //--- كيف استخدمها
      let tblPatientcommunication = [];

      if (IsNew == false) {

        Appointments = res[`Q6`][0];
        tblMedicalProcedures = res[`Q7`]; //---- 
        tblPatientsblacklist = res[`Q8`]; //--- كيف استخدمها
        tblPatientcommunication = res[`Q9`];// ----
      }

      let jsonData = {
        IsNew: IsNew,
        tblService: tblService,
        tblOR: tblOR,
        tblOfferPkg: tblOfferPkg,
        tblBranch: tblBranch,
        Patient: IsNew ? this.all.Patient : tblPatients[0],
        tblAnesthetist: tblAnesthetist,
        IsOnCall: IsOnCall,
        IsWalk: IsWalk,
        Appointments: Appointments,
        tblMedicalProcedures: tblMedicalProcedures,
        tblPatientsblacklist: tblPatientsblacklist,
        tblPatientcommunication: tblPatientcommunication,
      };
      let AType = 0;
      // let IDDoctor = 0;
      let IDRoom = ApptData.IDOperatingRoom;

      AType = ApptData.AType;
      IDDoctor = ApptData.IDDoctor;

      this.apptModal(jsonData, AType, IDDoctor, IDRoom, ApptData);
    });
  }

  async apptModal(jsonData, AType, IDDoctor, IDRoom, ApptData) {
    console.log(`jsonData= `, jsonData);
    let Duration = ApptData.Duration;
    // alert(this.SelectedSlot.resource.id.split(`-`)[0]);

    const modal = await this.modalCtrl.create({
      component: NewAppComponent,
      componentProps: {
        IsNew: jsonData.IsNew,
        StartDate: ApptData.ADate,
        tblService: jsonData.tblService,
        tblOR: jsonData.tblOR,
        tblOfferPkg: jsonData.tblOfferPkg,
        tblBranch: jsonData.tblBranch,
        Patient: jsonData.Patient,
        Duration: Duration,
        AType: AType,//this.SelectedSlot.resource.id.includes(`Real`) ? 0 : 1,
        IDDoctor: IDDoctor,// this.SelectedSlot.resource.id.split(`-`)[0],
        IDRoom: IDRoom,
        IsOnCall: jsonData.IsOnCall,
        IsWalk: jsonData.IsWalk,

        Appointments: jsonData.Appointments,
        tblMedicalProcedures: jsonData.tblMedicalProcedures,
        tblPatientsblacklist: jsonData.tblPatientsblacklist,
        tblPatientcommunication: jsonData.tblPatientcommunication,
      },
      backdropDismiss: false,
      cssClass: 'newapp-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`role= `, data);
      if (data.Deleted) {
        this.tblAppts = this.tblAppts.filter(x => x.ID != ApptData.ID);

      } else if (data.Recovered) {


      } else if (data.Saved) {
        this.getLoad(this.CurrentDate);
      } else {

      }
    }
  }

  tblRequestServices = [];
  async menuBtn(ev) {
    console.log(`ev= `, ev);

    if (ev.Cmd.ID == 1) {
      this.newApp(false, 0, ev.Item);
    } else if (ev.Cmd.ID == 2 || ev.Cmd.ID == 3) {


      this.AppointmentRequest = { // IDPatient, PatientNameA, PatientNameE
        AppointmentNo: ev.Item.AppointmentNo,
        User: ``,
        IDBranch: ev.Item.IDBranch,
        IDDoctor: ev.Item.IDDoctor,
        IDOperatingRoom: ev.Item.IDOperatingRoom,
        Patient: {
          IDP: ev.Item.IDPatient,
          NameE: ev.Item.PatientNameE,
          NameA: ev.Item.PatientNameA,
        },
        AType: ev.Item.AType,
        DateFrom: this.all.getDateNow(`-`),
        WithinDaysCount: 5,
        Duration: ev.Item.Duration,
        IDService: 0,
        Description: ``,
      };

      this.IsRequestModal = true;
      if (ev.Cmd.ID == 2) {
        this.RequestModalTab = 0;
      } else {
        this.RequestModalTab = 1;
        this.getNextAvailable();
      }

      this.tblNextAppt = [];
      this.SelectedNextAppt = null;

      if (this.tblRequestServices.length == 0) {
        // -- __________ الخدمة أو الاجر  tblService ___________
        let Query0 = `Select 0 IDP,1 IDC,0 IDNature,0 It_Level,0 PartNo,0 IDHand,"Any" NameE,"Any" NameA,"" NickName,0 DurationTime union all Select IDP,IDC,IDNature,It_Level,PartNo,IDHand,NameE,NameA,NickName,DurationTime from Items where IDC=${this.all.User.IDC} AND IDNature in (13,14,15,16)`;
        let Query = `${Query0}`;
        console.log(`Query= `, Query);

        const body = new HttpParams()
          .set('Mtype', 'A16')
          .set('Query', Query);

        this.all.postData(body).then(res => {
          console.log(`res= `, res);
          this.tblRequestServices = res[`Q0`];
        });
      }





    } else if (ev.Cmd.ID == 4) {
      window.open(`${this.all.Domain}appointmen1`, '_blank').focus();
    }
  }

  changeQtyService() {
    setTimeout(() => {
      this.Service.NetPrice = +this.Service.Price * +this.Service.Quantity;
    }, 100);
  }
  changeDiscountService() {
    setTimeout(() => {
      // this.Service.NetPrice = +this.Service.Price * +this.Service.Quantity;
      this.Service.Price = +this.Service.MainPrice - +this.Service.Discount - +this.Service.DiscountDoctor;
      this.Service.NetPrice = +this.Service.Price * +this.Service.Quantity;
    }, 100);
  }
  changePriceService() {
    setTimeout(() => {
      this.Service.NetPrice = +this.Service.Price * +this.Service.Quantity;
    }, 100);
  }

  CreatedFromDate = this.all.getDateNow(`-`);
  IsServiceModal = false;
  IsMedicinModal = false;
  IsDiscountModal = false; CustomDiscountForAllService = false;
  DisacountModalData = {
    Amount: 0,
    Discount: 0, Discount100: 0,
    DiscountByDr: 0, DiscountByDr100: 0,
  };
  discountModal() {
    this.DisacountModalData = {
      Amount: this.Service.MainPrice,
      Discount: this.Service.Discount,
      Discount100: this.Service.MainPrice == 0 || this.Service.Discount == 0 ? 0 : this.Service.Discount * 100 / this.Service.MainPrice,
      DiscountByDr: this.Service.DiscountDoctor,
      DiscountByDr100: this.Service.MainPrice == 0 || this.Service.DiscountDoctor == 0 ? 0 : this.Service.DiscountDoctor * 100 / this.Service.MainPrice,
    };
    this.IsDiscountModal = true;
  }
  setDiscount() {
    setTimeout(() => {
      this.DisacountModalData.Discount = this.DisacountModalData.Amount == 0 ? 0 : this.DisacountModalData.Amount * this.DisacountModalData.Discount100 / 100;
    }, 100);
  }
  setDiscount100() {
    setTimeout(() => {
      this.DisacountModalData.Discount100 = this.DisacountModalData.Amount == 0 ? 0 : this.DisacountModalData.Discount * 100 / this.DisacountModalData.Amount;
    }, 100);
  }
  setDiscountByDr() {
    setTimeout(() => {
      this.DisacountModalData.DiscountByDr = this.DisacountModalData.Amount == 0 ? 0 : this.DisacountModalData.Amount * this.DisacountModalData.DiscountByDr100 / 100;
    }, 100);
  }
  setDiscountByDr100() {
    setTimeout(() => {
      this.DisacountModalData.DiscountByDr100 = this.DisacountModalData.Amount == 0 ? 0 : this.DisacountModalData.DiscountByDr * 100 / this.DisacountModalData.Amount;
    }, 100);
  }
  saveModalDiscount() {
    if (this.CustomDiscountForAllService) {
      for (let s of this.tblService) {
        s.Discount = s.MainPrice * this.DisacountModalData.Discount100 / 100;
        s.DiscountDoctor = s.MainPrice * this.DisacountModalData.DiscountByDr100 / 100;

        s.Price = s.MainPrice - s.Discount - +s.DiscountDoctor;
        s.NetPrice = +s.Price * +s.Quantity;
      }
    } else {
      // this.Service.MainPrice = this.DisacountModalData.Amount;
      this.Service.Discount = this.DisacountModalData.Discount;
      this.Service.DiscountDoctor = this.DisacountModalData.DiscountByDr;
      this.Service.Price = +this.Service.MainPrice - +this.Service.Discount - +this.Service.DiscountDoctor;
      this.Service.NetPrice = +this.Service.Price * +this.Service.Quantity;
    }

    this.IsDiscountModal = false;
    this.CustomDiscountForAllService = false;
  }
  saveServiceModal() {
    // this.Service.MainPrice = this.Service.Price;
    console.log(this.Service);
    let tmpQty = this.Service.Quantity;

    const index = this.tblService.findIndex(item => item.ID === this.Service.ID);
    if (index !== -1) {
      if (this.Service.AsPackage) {
        this.Service.Quantity = 1;
        for (let i = 0; i < tmpQty; i++) {
          this.tblService.splice(index + i, i == 0 ? 1 : 0, this.Service);
        }
      } else {
        this.tblService.splice(index, 1, this.Service); // استبدال العنصر
      }
    }

    // this.tblService.filter(x => x.ID == this.Service.ID)[0] = this.SelectedService;
    // this.SelectedService = item;
    this.IsServiceModal = false;
  }
  addServiceModal() {
    console.log(this.Service);
    this.Service.Done = this.Service.Done ? 1 : 0;
    if (this.Service.AsPackage) {
      let Qty = this.Service.Quantity;
      for (let i = 0; i < Qty; i++) {
        this.Service.Quantity = 1;
        this.tblService.push(this.Service);
      }
    } else {
      this.tblService.push(this.Service);
    }

    this.emptyService();
  }
  addMedicinModal() {
    this.tblMedicine.push(this.Medicine);
    this.emptyMedicin();
  }
  tmpID = 0;
  tblItem = [
    {
      IDP: 1,
      NameA: `Examination test Enter`,
      NameE: `Examination test Enter`,
    },
    {
      IDP: 2,
      NameA: `Examination test Enter`,
      NameE: `Examination test Enter`,
    },
  ];

  tblDiscountForServices = [
    { // IDItem, MaxDiscount, MinDiscount, AvgDiscount
      IDP: 0,
      NameA: `Maximum Discount`,
      NameE: `Maximum Discount`,
      Att: `MaxDiscount`
    },
    {
      IDP: 1,
      NameA: `Medium Discount`,
      NameE: `Medium Discount`,
      Att: `AvgDiscount`,
    },
    {
      IDP: 2,
      NameA: `Min Discount`,
      NameE: `Min Discount`,
      Att: `MinDiscount`,
    },
    {
      IDP: 3,
      NameA: `Package Discount?`,
      NameE: `Package Discount?`,
      Att: ``,
    },
    {
      IDP: 4,
      NameA: `Customize Discount`,
      NameE: `Customize Discount`,
      Att: ``,
    },
  ];
  tblSessoinType = [
    {
      IDP: 0,
      NameA: `All (No Filter)`,
      NameE: `All (No Filter)`,
    }, {
      IDP: 1,
      NameA: `Medical Procedure`,
      NameE: `Medical Procedure`,
    }, {
      IDP: 2,
      NameA: `Surgery Procedure`,
      NameE: `Surgery Procedure`,
    }, {
      IDP: 3,
      NameA: `Lab Analysis`,
      NameE: `Lab Analysis`,
    }, {
      IDP: 4,
      NameA: `X-Ray`,
      NameE: `X-Ray`,
    }, {
      IDP: 5,
      NameA: `First Visit`,
      NameE: `First Visit`,
    }, {
      IDP: 6,
      NameA: `Follow up`,
      NameE: `Follow up`,
    }, {
      IDP: 7,
      NameA: `Return`,
      NameE: `Return`,
    }, {
      IDP: 8,
      NameA: `Procedure Room`,
      NameE: `Procedure Room`,
    }, {
      IDP: 9,
      NameA: `Clinic Procedure`,
      NameE: `Clinic Procedure`,
    },
  ];
  CD_SreviceFilter = 0;
  Service = {
    "ID": 0,
    "IDC": 1,
    "IDClinicalNote": 0,
    "IDAgreement": 0,
    "PackageSerial": 0,
    "AsPackage": 0,
    "ReportDate": "",
    "CType": 0,
    "IDPatient": 0,
    "IDDoctor": 0,
    "IDAppointment": 0,
    "IDUser": 0,
    "ADate": "",
    "AgrType": 0,
    "IDItem": 0,
    "Quantity": 1,
    "MainPrice": 0,
    "Discount": 0,
    "DiscountDoctor": 0,
    "Price": 0,
    "NetPrice": 0,
    "PaidAmount": 0,
    "VType": 0,
    "IDV": 0,
    "Done": 0,
    "Paid": 0,
    "Approved": 0,
    "Description": "",
    "Name": "",
    "StartDate": "",
    "Dose": "0",
    "Duration": 0,
    "TimesDaily": 0,
    "EvryTime": "0",
    "Unit": 0,
    "Route": 0,
    "DurationUnit": 0,
    "PRN": 0,
    "Indications": "",
    "Instructions": "",
    "Tooth": "0",
    "SurfaceOfTooth": "",
    "DiagnosisCode": "",
    "DiagnosisDesc": "",
    "OtherDiagnosis": "",
    "Actually": "",
    "ServiceNameE": "",
    "ServiceNameA": "",
    "CTypeName": ""
  };


  ServiceModalCheckboxes = {
    Recommended: false,
    PrePaid: false,
  }
  emptyService() {
    this.Service = {
      "ID": 0,
      "IDC": 1,
      "IDClinicalNote": 0,
      "IDAgreement": 0,
      "PackageSerial": 0,
      "AsPackage": 0,
      "ReportDate": "",
      "CType": 0,
      "IDPatient": 0,
      "IDDoctor": 0,
      "IDAppointment": 0,
      "IDUser": 0,
      "ADate": "",
      "AgrType": 0,
      "IDItem": 0,
      "Quantity": 1,
      "MainPrice": 0,
      "Discount": 0,
      "DiscountDoctor": 0,
      "Price": 0,
      "NetPrice": 0,
      "PaidAmount": 0,
      "VType": 0,
      "IDV": 0,
      "Done": 0,
      "Paid": 0,
      "Approved": 0,
      "Description": "",
      "Name": "",
      "StartDate": "",
      "Dose": "0",
      "Duration": 0,
      "TimesDaily": 0,
      "EvryTime": "0",
      "Unit": 0,
      "Route": 0,
      "DurationUnit": 0,
      "PRN": 0,
      "Indications": "",
      "Instructions": "",
      "Tooth": "0",
      "SurfaceOfTooth": "",
      "DiagnosisCode": "",
      "DiagnosisDesc": "",
      "OtherDiagnosis": "",
      "Actually": "",
      "ServiceNameE": "",
      "ServiceNameA": "",
      "CTypeName": ""
    };
  }
  newServiceModal() {
    this.emptyService();
    this.IsServiceModal = true;
    this.getServices();
  }

  Medicine = {
    "ID": 361034,
    "IDC": 1,
    "IDClinicalNote": 0,
    "IDAgreement": 0,
    "ReportDate": "2024-12-01 19:30:00",
    "CType": 4,
    "AsPackage": 0,
    "IDPatient": 12672,
    "IDDoctor": 92,
    "IDAppointment": 101181503,
    "IDUser": 17,
    "ADate": "2025-04-14 21:34:11",
    "AgrType": 0,
    "IDItem": 4534,
    "MainPrice": 80,
    "Quantity": 1,
    "Discount": 0,
    "DiscountDoctor": 0,
    "Price": 80,
    "Done": 0,
    "Paid": 0,
    "Approved": 0,
    "Description": "",
    "Name": "APAT0026 - Vasopressin 20u",
    "StartDate": "2025-04-14",
    "Dose": "1",
    "Duration": 1,
    "TimesDaily": 0,
    "EvryTime": "0",
    "Unit": 0,
    "DrugUnit": 0,
    "Route": 0,
    "DurationUnit": 0,
    "PRN": 0,
    "Indications": "",
    "Instructions": "",
    "Tooth": "",
    "SurfaceOfTooth": "",
    "DiagnosisCode": "",
    "DiagnosisDesc": "",
    "OtherDiagnosis": "",
    "Actually": "",
    "MedicineNameE": "APAT0026 - Vasopressin 20u",
    "MedicineNameA": "APAT0026 - فاسوبريسين 20U"
  }


  discountAlert() {
    // this.popoverController.dismiss();
    let alertInputs = [];
    for (let b of this.tblDiscountForServices) {
      alertInputs.push({
        label: b["Name" + this.all.LangLetter],
        type: 'radio',
        // type: 'checkbox',
        value: b.IDP,
      });
    }

    this.alertController.create({
      header: this.all.translate.instant(`Apply discount for all services`),
      message: ``,
      cssClass: `custom-confirm`,
      inputs: alertInputs,
      buttons: [
        {
          text: `Cancel`,
          cssClass: 'alert-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          cssClass: 'alert-button-confirm',
          text: `Yes`,
          handler: (data) => {
            console.log('Confirm Okay= ', data);
            this.applyDiscountForAllServices(data)
          }
        }
      ]
    }).then((confirm) => {
      confirm.present();
    });
  }


  applyDiscountForAllServices(data) {
    let Att = ``;
    if (data <= 2) {
      Att = this.tblDiscountForServices.find(x => x.IDP == data).Att;
      for (let service of this.tblService) {
        if (this.tblDiscount.filter(x => x.IDItem == service.IDItem).length > 0) {
          let d = this.tblDiscount.find(x => x.IDItem == service.IDItem)[Att];
          // alert(d);
          service.Discount = (+service.MainPrice * +this.tblDiscount.find(x => x.IDItem == service.IDItem)[Att] / 100).toFixed(2);
          // alert(service.Discount);
        }
      }
    } else if (data == 3) {
      // alert(data);
      let d = 0;
      for (let s of this.tblService) {
        d += +s.MainPrice * +this.DefaultPackageDiscountPersent / 100;
        // d = Math.round(d * 100) / 100;
        // alert('Musef : DefaultPackageDiscountPersent ?'); // select PR(0,'Additional.Discount.Persent') DefaultPackageDiscountPersent;

        s.Discount = d;
        s.Price = +s.MainPrice - +s.Discount + +s.DiscountDoctor;
        s.NetPrice = s.Quantity * s.Price;
      }
    } else if (data == 4) {
      let Amount = 0, Discount = 0, DocDiscount = 0;
      for (let service of this.tblService) {
        Amount += service.MainPrice;
        Discount += service.Discount;
        DocDiscount += service.DiscountDoctor;
      }

      this.DisacountModalData = {
        Amount: Amount,
        Discount: Discount,
        Discount100: Amount != 0 ? (Discount / Amount * 100) : 0,
        DiscountByDr: DocDiscount,
        DiscountByDr100: Amount != 0 ? (DocDiscount / Amount * 100) : 0,
      };
      this.IsDiscountModal = true;
      this.CustomDiscountForAllService = true;
    }
    // alert(Att);

  }

  tblOrderInstructions = [
    {
      IDP: 0,
      NameA: `BID x 3 days`,
      NameE: `BID x 3 days`,
    },
    {
      IDP: 1,
      NameA: `Test by musef`,
      NameE: `Test by musef`,
    }, {
      IDP: 2,
      NameA: `BID for 5days`,
      NameE: `BID for 5days`,
    }, {
      IDP: 3,
      NameA: `BID x 3-5 DAYS`,
      NameE: `BID x 3-5 DAYS`,
    }, {
      IDP: 4,
      NameA: `OD evening for Face`,
      NameE: `OD evening for Face`,
    }, {
      IDP: 5,
      NameA: `Minoxidil 2.5mg for`,
      NameE: `Minoxidil 2.5mg for`,
    }, {
      IDP: 6,
      NameA: `fucicort cream BID x 3days`,
      NameE: `fucicort cream BID x 3days`,
    }, {
      IDP: 7,
      NameA: `minoxidil 5mg`,
      NameE: `minoxidil 5mg`,
    }, {
      IDP: 8,
      NameA: `BID x 10 days`,
      NameE: `BID x 10 days`,
    }, {
      IDP: 9,
      NameA: `BID for face and Neck`,
      NameE: `BID for face and Neck`,
    },
  ];

  orderInstructionsAlert() {
    let alertInputs = [];
    for (let b of this.tblOrderInstructions) {
      alertInputs.push({
        label: b["Name" + this.all.LangLetter],
        type: 'radio',
        // type: 'checkbox',
        value: b.IDP,
      });
    }

    this.alertController.create({
      header: this.all.translate.instant(`Choose the appropriate instructions`),
      message: ``,
      cssClass: `custom-confirm`,
      inputs: alertInputs,
      buttons: [
        {
          text: `Cancel`,
          cssClass: 'alert-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          cssClass: 'alert-button-confirm',
          text: `Yes`,
          handler: (data) => {
            console.log('Confirm Okay= ', data);
          }
        }
      ]
    }).then((confirm) => {
      confirm.present();
    });
  }

  setDiagnosis(ev) {
    console.log(`ev= `, ev);
    this.Service.DiagnosisDesc = ev.Diagnosis;
  }
  // SelectedService = null;
  SelectedServiceIndex = -1;
  selectService(ServiceIndex) {
    // console.log(ServiceIndex);
    if (this.SelectedServiceIndex == ServiceIndex) {
      this.SelectedServiceIndex = -1;
      return;
    }
    // this.tblService = this.all.deepCopy(this.tblSourceService);
    // if (this.SelectedServiceIndex > -1) {
    //   // let tmpID = this.SelectedService.ID;
    //   let tmpID = this.tblService[this.SelectedServiceIndex].ID;
    //   const index = this.tblService.findIndex(item => item.ID === tmpID);
    //   if (index !== -1) {
    //     this.tblService.splice(index, 1, this.tblSourceService.find(item => item.ID === tmpID)); // استبدال العنصر
    //   }
    // }

    setTimeout(() => {
      this.SelectedServiceIndex = ServiceIndex;
    }, 50);


  }
  dblclickService(ServiceIndex) {
    setTimeout(() => {
      this.SelectedServiceIndex = ServiceIndex;
    }, 50);
    this.editService(this.tblService[ServiceIndex]);
  }
  addServiceQty(Qty) {
    if (Qty == -1 && this.tblService[this.SelectedServiceIndex].Quantity == 1) return;
    if (this.tblService[this.SelectedServiceIndex].AsPackage && Qty > 0) {
      this.tblService.push(this.tblService[this.SelectedServiceIndex]);
    } else {
      this.tblService[this.SelectedServiceIndex].Quantity += Qty;
    }

  }
  delService() {
    this.all.confirm(this.all.translate.instant(`Are you sure you want to delete?`)).then(yes => {
      if (yes) {
        // this.tblService = this.tblService.filter(x => x.ID != this.tblService[this.SelectedServiceIndex].ID);
        this.tblService = this.tblService.filter((item, index) => index !== this.SelectedServiceIndex);
      }
    });
  }

  editService(item) {
    console.log(item);
    this.Service = this.all.deepCopy(item);


    this.ServiceModalCheckboxes.PrePaid = this.Service.CType == 1 ? true : false;
    this.ServiceModalCheckboxes.Recommended = this.Service.CType == 2 ? true : false;
    // this.ServiceModalCheckboxes.InsuranceApproval = this.Service.CType == 3 ? true : false;

    this.IsServiceModal = true;
    this.getServices();
  }

  recommendedChange() {
    if (this.ServiceModalCheckboxes.Recommended) {
      this.Service.Done = 0;
      this.ServiceModalCheckboxes.PrePaid = false;
      this.Service.AsPackage = 0;
      // Ch_InsuranceApproval.Checked:=False;
    }
  }
  doneChange() {
    if (this.Service.Done > 0) {
      this.ServiceModalCheckboxes.Recommended = false;
    }
  }
  asPackageChange() {
    if (this.Service.AsPackage > 0) {
      this.ServiceModalCheckboxes.PrePaid = true;
      this.ServiceModalCheckboxes.Recommended = false;
      // Ch_InsuranceApproval.Checked:=False;
    }
  }
  prePaidChange() {
    if (this.ServiceModalCheckboxes.PrePaid) {
      this.ServiceModalCheckboxes.Recommended = false;
      // Ch_InsuranceApproval.Checked:=False;
    } else {
      this.Service.AsPackage = 0;
    }
  }

  // SelectedMedicine = null;
  SelectedMedicineIndex = -1;
  editMedicine(item) {
    if (item == null) {
      return;
    }
    this.Medicine = this.all.deepCopy(item);

    this.IsMedicinModal = true;
  }
  emptyMedicin() {
    this.Medicine = {
      ID: 0,
      "IDC": 1,
      "IDClinicalNote": 0,
      "IDAgreement": 0,
      "ReportDate": "",
      "CType": 4,
      "AsPackage": 0,
      "IDPatient": 0,
      "IDDoctor": 0,
      "IDAppointment": 0,
      "IDUser": 17,
      "ADate": "",
      "AgrType": 0,
      "IDItem": 0,
      "MainPrice": 0,
      "Quantity": 1,
      "Discount": 0,
      "DiscountDoctor": 0,
      "Price": 0,
      "Done": 0,
      "Paid": 0,
      "Approved": 0,
      "Description": "",
      "Name": "",
      "StartDate": "",
      "Dose": "1",
      "Duration": 1,
      "TimesDaily": 0,
      "EvryTime": "0",
      "Unit": 0,
      "DrugUnit": 0,
      "Route": 0,
      "DurationUnit": 0,
      "PRN": 0,
      "Indications": "",
      "Instructions": "",
      "Tooth": "",
      "SurfaceOfTooth": "",
      "DiagnosisCode": "",
      "DiagnosisDesc": "",
      "OtherDiagnosis": "",
      "Actually": "",
      "MedicineNameE": "",
      "MedicineNameA": ""
    };
  }
  newMedicinModal() {
    this.emptyMedicin();
    this.IsMedicinModal = true;
  }
  selectMedicine(MedicineIndex) {
    console.log(MedicineIndex);
    if (this.SelectedMedicineIndex == MedicineIndex) {
      this.SelectedMedicineIndex = -1;
      return;
    }

    setTimeout(() => {
      this.SelectedMedicineIndex = MedicineIndex;
    }, 50);





    // if (this.SelectedMedicine == item) {
    //   this.SelectedMedicine = null;
    //   return;
    // }
    // if (this.SelectedMedicine != null) {
    //   let tmpID = this.SelectedMedicine.ID;
    //   const index = this.tblMedicine.findIndex(item => item.ID === tmpID);
    //   if (index !== -1) {
    //     this.tblMedicine.splice(index, 1, this.tblSourceMedicine.find(item => item.ID === tmpID)); // استبدال العنصر
    //   }
    // }

    // setTimeout(() => {
    //   this.SelectedMedicine = item;
    // }, 50);
  }

  selectDrug(ev) {
    console.log(`ev= `, ev);
    this.Medicine.MedicineNameE = ev.NameE;
    this.Medicine.MedicineNameA = ev.NameA;
  }

  tblDrugs = [];
  medicineModalOpened() {
    if (this.tblDrugs.length > 0) {
      return;
    }
    this.storage.get(DRUG_DATA).then(val => {
      if (val) {
        this.tblDrugs = val;
      } else {
        this.getDrugData();
      }
    });
  }

  getDrugData() {
    let Query0 = `Select  M.ID,M.IDC,M.IDP, M.IDF, M.ID_Dept , IDNature, M.IDHand, M.BarCode, IDPlace, It_Type, M.PartNo,
    M.NameE,M.NameA, NickName, M.IsMedicine, M.IsMedical, M.UnitName, M.UnitConvert, M.QDefault,
    M.SalePrice1, M.SoundNameA, M.SoundNameE, M.ScientificName, M.Strength, M.StrengthUnit,       
      IfNull(DF.NameE,"") DosageForm, IfNull(AR.NameE,"")
      AdministrationRoute, M.Size, M.SizeUnit,M.ID IDPharma From (Select ID,IDC,IDItem IDP,
      MarketingCompany IDF, DrugType ID_Dept , 13 IDNature, ATCCode1 IDHand, ATCCode2 BarCode,
      0 IDPlace, 0 It_Type, RegisterNumber PartNo,         TradeName NameE,ScientificName NameA,
      "" NickName, 1 IsMedicine, 1 IsMedical, StrengthUnit UnitName, 1 UnitConvert, 1 QDefault,
      PublicPrice SalePrice1, SoundNameA, SoundNameE, Mid(IfNull(ScientificName,""),1,100) ScientificName, Strength, StrengthUnit,  
      AdministrationRoute,Size, SizeUnit From PharmacyMedicines where IDC=${this.all.User.IDC}) M
      Left join itemmedicinerelations AR on AR.IDR=M.AdministrationRoute and AR.Rtype="AdministrationRoute" 
      Left join itemmedicinerelations DF on DF.IDR=M.AdministrationRoute and DF.Rtype="PharmaceuticalForm"
      Where M.IDC=${this.all.User.IDC}  And M.IDC=${this.all.User.IDC}   union All Select  M.ID,M.IDC,M.IDP, M.IDF, M.ID_Dept , M.IDNature, M.IDHand,
      M.BarCode, M.IDPlace, M.It_Type, M.PartNo,   M.NameE,M.NameA, M.NickName, M.IsMedicine, M.IsMedical,
      u.NameE UnitName, M.UnitConvert, M.QDefault,   M.SalePrice1, M.SoundNameA, M.SoundNameE, 
      Mid(IfNull(P.ScientificName,""),1,100) ScientificName, P.Strength, P.StrengthUnit,   IfNull(DF.NameE,"") DosageForm,
      IfNull(AR.NameE,"") AdministrationRoute, P.Size, P.SizeUnit,ifNull(P.ID,0) IDPharma From Demo.Items M
      left join Demo.Units u on (M.IDC,M.IDUnit)=(u.IDC,u.IDP) Left join Demo.PharmacyMedicines P 
      on M.IDC=P.IDC and p.IDItem>0 and M.IDP=P.IDItem Left join Demo.itemmedicinerelations AR 
      on AR.IDR=P.AdministrationRoute and AR.Rtype="AdministrationRoute" Left join
      Demo.itemmedicinerelations DF on DF.IDR=P.AdministrationRoute and DF.Rtype="DosageForm"
      Where M.IDC=${this.all.User.IDC} and M.IsBlocking<>1 and M.IDAlias<=0 and M.IDNature in (4,5,6,7,8,9,10)  
      And M.IDC=${this.all.User.IDC}   Order by PartNo`;
    let Query = `${Query0}`;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      this.tblDrugs = res[`Q0`];
      this.storage.set(DRUG_DATA, res[`Q0`]);
    });
  }

  dblclickMedicine(MedicineIndex) {
    // setTimeout(() => {
    //   this.SelectedMedicine = item;
    // }, 50);
    // this.editMedicine(item);

    setTimeout(() => {
      this.SelectedMedicineIndex = MedicineIndex;
    }, 50);
    this.editMedicine(this.tblMedicine[MedicineIndex]);
  }

  addMedicineQty(Qty) {
    // if (Qty == -1 && this.SelectedMedicine.Quantity == 1) return;
    // this.SelectedMedicine.Quantity += Qty;

    if (Qty == -1 && this.tblMedicine[this.SelectedMedicineIndex].Quantity == 1) return;
    if (this.tblMedicine[this.SelectedMedicineIndex].AsPackage && Qty > 0) {
      this.tblMedicine.push(this.tblMedicine[this.SelectedMedicineIndex]);
    } else {
      this.tblMedicine[this.SelectedMedicineIndex].Quantity += Qty;
    }
  }

  delMedicine() {
    // console.log(this.Medicine);
    this.all.confirm(this.all.translate.instant(`Are you sure you want to delete?`)).then(yes => {
      if (yes) {
        // this.tblMedicine = this.tblMedicine.filter(x => x.ID != this.SelectedMedicine.ID);
        this.tblService = this.tblService.filter((item, index) => index !== this.SelectedServiceIndex);
      }
    });
  }

  LastServiceFilter = 0;
  serviceFilterChange(ev) {
    console.log(ev.detail.value, this.CD_SreviceFilter);
    if (this.LastServiceFilter != ev.detail.value) {
      this.LastServiceFilter = ev.detail.value;
      this.getServices();
      this.saveCD_SreviceFilter();
    }
  }

  saveCD_SreviceFilter() {
    let Query0 = `Call cp(${this.all.User.IDP},'CD_SreviceFilter','${this.CD_SreviceFilter}')`;
    let Query = `${Query0}`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body, false).then(res => {
      console.log(`res= `, res);

    });
  }

  tblServiceCodeName = [];
  getServices() {
    // console.log(` sdsadasdsads`);
    let QueryFilter = ``;
    let SreviceFilter = -1;
    switch (this.CD_SreviceFilter) {
      case 1:
        SreviceFilter = 13;  //Medical Procedures
        QueryFilter = ` and M.IDNature=13`;
        break;
      case 2:
        SreviceFilter = 14; //Surgery Procedures
        QueryFilter = ` and M.IDNature=14`;
        break;
      case 3:
        SreviceFilter = 15; //Lab Analysis
        QueryFilter = ` and M.IDNature=15`;
        break;
      case 4:
        SreviceFilter = 16; //X-Ray
        QueryFilter = ` and M.IDNature=16`;
        break;
      case 5:
        SreviceFilter = 0; //First Visit
        QueryFilter = ` and M.VisitType=0`;
        break;
      case 6:
        SreviceFilter = 1; //Follow up
        QueryFilter = ` and M.VisitType=1`;
        break;
      case 7:
        SreviceFilter = 2; //Return
        QueryFilter = ` and M.VisitType=2`;
        break;
      case 8:
        SreviceFilter = 3; //Procedure Room
        QueryFilter = ` and M.VisitType=3`;
        break;
      case 9:
        SreviceFilter = 4; //Clinic Procedure
        QueryFilter = ` and M.VisitType=4`;
        break;
      default:
        SreviceFilter = -1;
        break;
    }

    let Query0 = `Select  M.ID,M.IDP, M.IDF, M.ID_Dept , M.IDNature, M.IDHand, M.BarCode, M.It_Type, M.PartNo,         M.NameE,M.NameA, M.NickName, M.IsMedicine, M.IsMedical,         M.SalePrice1, M.SoundNameA, M.SoundNameE
      From Items M
      Where M.IsBlocking<>1 and M.IDAlias<=0 and M.IDNature in (13,14,15,16) 
        And M.IDC=${this.all.User.IDC} 
        ${QueryFilter} 
        Order by PartNo`;
    let Query = `${Query0}`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`res= `, res);
      this.tblServiceCodeName = res[`Q0`];

    });
  }

  IsRequestModal = false;
  AppointmentRequest = { // IDPatient, PatientNameA, PatientNameE
    AppointmentNo: 0,
    User: ``,
    IDBranch: 0,
    IDDoctor: 0,
    IDOperatingRoom: 0,
    // Patient: this.all.Patient,
    Patient: {
      IDP: 0,
      NameE: '',
      NameA: '',
    },
    AType: 0,
    DateFrom: '',
    WithinDaysCount: 5,
    Duration: 10,
    IDService: 0,
    Description: ``,
  }
  saveModalRequest() {

  }
  RequestModalTab = 0;
  tblNextAppt = [];
  SelectedNextAppt = null;
  getNextAvailable() {
    this.tblNextAppt = [];
    let StartSearchAt = this.all.getDateNow(`-`) + " 00:00:00";
    // alert(this.SearchDate);
    // return;
    let Query = `Call AppointmentNextAvailable(${this.all.User.IDC},${this.all.RegisterData.Branch},${this.AppointmentRequest.IDDoctor},${this.AppointmentRequest.IDOperatingRoom},"${StartSearchAt}",${this.AppointmentRequest.Duration},${this.AppointmentRequest.AType},2,0,1,0)`;
    // alert(Query);
    console.log(`Query= `, Query);
    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }

      console.log(`res= `, res);
      // alert(res[`Q0`].length)
      this.tblNextAppt = res[`Q0`];
      // this.modalCtrl.dismiss({ Patient: Patient }, 'confirm');
    });
  }

  requestDurationAdd(min) {
    if (min == -5 && this.AppointmentRequest.Duration == 5) {
      return;
    }
    this.AppointmentRequest.Duration += min;
  }

  requestWithinDaysCountAdd(no) {
    if (no == -1 && this.AppointmentRequest.WithinDaysCount == 1) {
      return;
    }
    this.AppointmentRequest.WithinDaysCount += no;
  }

  saveMedicine() {
    // let AppointmentNo = this.Appt.AppointmentNo;
    // let ReportDate = this.Appt.ADate;
    let ReportDate = this.Appt.ReportDate;


    // let qqd = 'Delete From Chargeslip where IDC=%d and IDAppointment=%d and ReportDate="%s" and CType in(%s)';
    // let qqi = 'Insert into Chargeslip(IDC, IDClinicalNote, CType, IDPatient, IDDoctor, IDAppointment, ReportDate, ' +
    //   'IDAgreement,AsPackage,IDUser, ADate,IDItem, Duration, MainPrice, Price, Quantity, Discount, DisCountDoctor, Description,Name,Dose, TimesDaily,EvryTime, StartDate,' +
    //   'Done, Unit, Route, DurationUnit, PRN, Indications, Instructions,' +
    //   'Tooth,SurfaceOfTooth,DiagnosisCode,DiagnosisDesc,OtherDiagnosis,Actually) ' +
    //   'VALUES ' +
    //   '(%IDC, 0, %CType,%IDPatient, %IDDoctor, %IDAppointment, "%ReportDate",%IDAgreement,%AsPackage,%IDUser, "%ADate",' +
    //   '%IDItem,%Duration,%MainPrice,%Price,%Quantity,%Discount,%DisCountDoctor,"%Description","%Name","%Dose", "%TimesDaily","%EvryTime", "%StartDate",' +
    //   '%Done, %Unit, %Route, %DurationUnit, %PRN, "%Indications", "%Instructions",' +
    //   '"%Tooth","%SurfaceOfTooth","%DiagnosisCode","%DiagnosisDesc","%OtherDiagnosis","%Actually" )';


    let PDelete = `Delete From Chargeslip where IDC=${this.all.User.IDC} and IDAppointment=${this.Appt.IDAppointment} and ReportDate="${ReportDate}" and CType in("4")`;
    let PInsert = '';
    for (let medicine of this.tblMedicine) {
      PInsert += PInsert.length > 0 ? `|` : ``;

      medicine.ADate = medicine.ADate == "" ? this.all.getDateNow(`-`) : medicine.ADate;
      medicine.StartDate = medicine.StartDate == "" ? this.all.getDateNow(`-`) : medicine.StartDate;

      PInsert += this.qqi.replace(/%IDC/, this.all.User.IDC.toString())
        .replace(/%CType/, "4")
        .replace(/%IDPatient/, medicine.IDPatient)
        .replace(/%IDDoctor/, medicine.IDDoctor)
        .replace(/%IDAppointment/, this.Appt.IDAppointment)
        .replace(/%ReportDate/, ReportDate)
        .replace(/%IDAgreement/, "0")
        .replace(/%AsPackage/, "0")
        .replace(/%IDUser/, medicine.IDUser)
        .replace(/%ADate/, medicine.ADate)
        .replace(/%IDItem/, medicine.IDItem)
        .replace(/%Duration/, medicine.Duration)
        .replace(/%MainPrice/, medicine.MainPrice.toString())
        .replace(/%Price/, medicine.Price.toString())
        .replace(/%Quantity/, medicine.Quantity.toString())
        .replace(/%Discount/, medicine.Discount)
        .replace(/%DisCountDoctor/, medicine.DiscountDoctor)
        .replace(/%Description/, medicine.Description)
        .replace(/%Name/, medicine.Name)
        .replace(/%Dose/, medicine.Dose)
        .replace(/%TimesDaily/, medicine.TimesDaily.toString())
        .replace(/%EvryTime/, medicine.EvryTime)
        .replace(/%StartDate/, medicine.StartDate)
        .replace(/%Done/, medicine.Done.toString())
        .replace(/%Unit/, medicine.Unit.toString())
        .replace(/%Route/, medicine.Route.toString())
        .replace(/%DurationUnit/, medicine.DurationUnit.toString())
        .replace(/%PRN/, medicine.PRN.toString())
        .replace(/%Indications/, medicine.Indications)
        .replace(/%Instructions/, medicine.Instructions)
        .replace(/%Tooth/, "")
        .replace(/%SurfaceOfTooth/, "")
        .replace(/%DiagnosisCode/, "")
        .replace(/%DiagnosisDesc/, "")
        .replace(/%OtherDiagnosis/, "")
        .replace(/%Actually/, "");
    }

    // console.log(`PDelete= `, PDelete);
    // console.log(`PInsert= `, PInsert);
    let Query = `[Call RunTranMulti('${PDelete}|${PInsert}')]`;
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

  qqi = 'Insert into Chargeslip(IDC, IDClinicalNote, CType, IDPatient, IDDoctor, IDAppointment, ReportDate, ' +
    'IDAgreement,AsPackage,IDUser, ADate,IDItem, Duration, MainPrice, Price, Quantity, Discount, DisCountDoctor, Description,Name,Dose, TimesDaily,EvryTime, StartDate,' +
    'Done, Unit, Route, DurationUnit, PRN, Indications, Instructions,' +
    'Tooth,SurfaceOfTooth,DiagnosisCode,DiagnosisDesc,OtherDiagnosis,Actually) ' +
    'VALUES ' +
    '(%IDC, 0, %CType,%IDPatient, %IDDoctor, %IDAppointment, "%ReportDate",%IDAgreement,%AsPackage,%IDUser, "%ADate",' +
    '%IDItem,%Duration,%MainPrice,%Price,%Quantity,%Discount,%DisCountDoctor,"%Description","%Name","%Dose", "%TimesDaily","%EvryTime", "%StartDate",' +
    '%Done, %Unit, %Route, %DurationUnit, %PRN, "%Indications", "%Instructions",' +
    '"%Tooth","%SurfaceOfTooth","%DiagnosisCode","%DiagnosisDesc","%OtherDiagnosis","%Actually" )';

  saveServices() {
    // let AppointmentNo = this.Appt.AppointmentNo;
    // let ReportDate = this.Appt.ADate;
    let ReportDate = this.Appt.ReportDate;

    let CDelete = `Delete From Chargeslip where IDC=${this.all.User.IDC} and IDAppointment=${this.Appt.IDAppointment} and ReportDate="${ReportDate}" and CType in('0,1,2,3')`;

    let CInsert = ``;
    for (let service of this.tblService) {
      CInsert += CInsert.length > 0 ? `|` : ``;

      service.ADate = service.ADate == "" ? "now()" : service.ADate;

      CInsert += this.qqi.replace(/%IDC/, this.all.User.IDC.toString())
        .replace(/%CType/, service.CType)
        .replace(/%IDPatient/, service.IDPatient)
        .replace(/%IDDoctor/, service.IDDoctor)
        .replace(/%IDAppointment/, this.Appt.IDAppointment)
        .replace(/%ReportDate/, ReportDate)
        .replace(/%IDAgreement/, service.IDAgreement)
        .replace(/%AsPackage/, service.AsPackage)
        .replace(/%IDUser/, service.IDUser)
        .replace(/%ADate/, service.ADate)
        .replace(/%IDItem/, service.IDItem)
        .replace(/%Duration/, service.Duration)
        .replace(/%MainPrice/, service.MainPrice.toString())
        .replace(/%Price/, service.Price.toString())
        .replace(/%Quantity/, service.Quantity.toString())
        .replace(/%Discount/, service.Discount)
        .replace(/%DisCountDoctor/, service.DiscountDoctor)
        .replace(/%Description/, service.Description)
        .replace(/%Name/, '') // ----- musef ''
        .replace(/%Dose/, '0') // ----- musef 0
        .replace(/%TimesDaily/, '0') // ----- musef 0
        .replace(/%EvryTime/, '0') // ----- musef 0
        .replace(/%StartDate/, service.StartDate)
        .replace(/%Done/, service.Done.toString())
        .replace(/%Unit/, '0') // ----- musef 0
        .replace(/%Route/, '0') // ----- musef 0
        .replace(/%DurationUnit/, '0') // ----- musef 0
        .replace(/%PRN/, '0') // ----- musef 0
        .replace(/%Indications/, '')  // ----- musef ''
        .replace(/%Instructions/, '')  // ----- musef ''
        .replace(/%Tooth/, '') // ----- musef
        .replace(/%SurfaceOfTooth/, '') // ----- musef
        .replace(/%DiagnosisCode/, service.DiagnosisCode) // ----- musef
        .replace(/%DiagnosisDesc/, service.DiagnosisDesc) // ----- musef
        .replace(/%OtherDiagnosis/, service.OtherDiagnosis) // ----- musef
        .replace(/%Actually/, service.Actually); // ----- musef
    }

    console.log(`PDelete= `, CDelete);
    console.log(`PInsert= `, CInsert);
    let Query = `[Call RunTranMulti('${CDelete}|${CInsert}')]`;

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

  serviceQtyAdd(no) {
    if (no == -1 && this.Service.Quantity == 1) {
      return;
    }
    this.Service.Quantity += no;
  }

  illnessPage() {
    this.nav.navigateForward(`dr-system/patient-illness/${this.Appt.IDPatient}`);
  }

  getNextDay(no) {
    this.CurrentDate = this.datetimeService.getAdjacentDate(this.CurrentDate, no);
    this.getDataByDate();
  }
}
