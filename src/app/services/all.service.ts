import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { DatetimeService } from './datetime.service';
// import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AllService {
  // Database password Demo1234
  USER_LOG = `WIKI_USER_LOG`;
  Domain = `http://localhost:8100/#/`;
  BaseUrl = `http://wikimed.selfip.com:64384`;
  imgUrl = ``;
  IsFirstLoaded = false;
  User = {
    ID: 0,
    IDC: 1,
    IDB: 0,
    IDP: 17,
    HCode: `2827045`,
    Token: ``,
    Name: `Kays`
  }

  tblPatient = [
    { IDP: 1, NameA: 'Apple' },
    { IDP: 2, NameA: 'Banana' },
    { IDP: 3, NameA: 'Cherry' },
    { IDP: 4, NameA: 'Date' },
    { IDP: 5, NameA: 'Fig' },
  ];
  MenuSplitPane = false;

  // PatientApptWindow = false;
  SubScheduleWindows = {
    No: 1,
    Visible: false,
    tblItem: [],
    Footer: {}
  }
  tblSubWinItems: any = [];
  SelectedLang = `ar`;
  LangLetter = `E`;

  tblBranch = [
    {
      IDP: 1,
      NameA: `فرع 1`,
      NameE: `Branch1`
    },
    {
      IDP: 2,
      NameA: `فرع 2`,
      NameE: `Branch2`
    },
  ];

  Shift1Color = "#f6e58d";
  // Shift2Color = "#6c5ce7";
  Shift2Color = "#10ac84";
  Shift3Color = "#00b894";
  ExtraShiftColor = "#0abde3";
  BlockColor = "#ff7675";

  //   Real,Waiting,All,WalkIn,OnLine,OnCall,Multi
  // فعلي,إنتظار,كل,حاضر,إنترنت,تحت الإتصال,متعدد
  tblAType = [
    { ID: 0, NameA: 'حقيقي', NameE: 'Real' },
    { ID: 1, NameA: 'انتظار', NameE: 'Wait' },
    { ID: 2, NameA: 'All', NameE: 'كل' },
    { ID: 3, NameA: 'WalkIn', NameE: 'حاضر' },
    { ID: 4, NameA: 'OnLine', NameE: 'إنترنت' },
    { ID: 5, NameA: 'OnCall', NameE: 'تحت الإتصال' },
    { ID: 6, NameA: 'Multi', NameE: 'متعدد' },
  ];
  IsFirstNote = true;
  constructor(private alertController: AlertController, private loadingController: LoadingController,
    public translate: TranslateService, public http: HttpClient,
    private toastController: ToastController,
    public storage: Storage, private datetimeService: DatetimeService) {
    // alert( this.calculateDaysSince2020(new Date()) );
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  getColumns(item: any): string[] {
    return Object.keys(item);
  }

  getfirstLoad() {
    return new Promise(resolve => {

      if (this.IsFirstLoaded == true) {
        resolve(true);

      } else {
        this.storage.get(this.USER_LOG).then(res => {
          if (res) {
            this.User = res;
          }
          // else {
          //   if (!isLogin) { this.nav.navigateRoot(`admin/login`); resolve(false); }
          // }
        });

        // this.getDoctorsAndRooms();

        this.firstLoadData().then(v => {
          this.getPatients();
          this.getDoctorsAndRooms().then(vv => {
            resolve(v && vv);
          });

        });
      }

    });
  }

  RegisterData;

  // data1 = [
  //   {
  //     "LogoFlip": "False"
  //   },
  //   {
  //     "Registration.NewLicense": ""
  //   }
  // ];
  // data2={
  //   "LogoFlip": "False",
  //   "Registration.NewLicense": ""
  // }

  convertArrayToObject(data) {
    return data.reduce((acc, item) => {
      const key = Object.keys(item)[0]; // الحصول على المفتاح (Key)
      const value = item[key]; // الحصول على القيمة (Value)
      acc[key] = value; // إضافة المفتاح والقيمة إلى الكائن النهائي
      return acc;
    }, {});
  }

  firstLoadData() {
    // alert(2);
    return new Promise(resolve => {
      // this.getData(`?Mtype=A15&HCode=2827045`).then(res => {
      //   this.IsFirstLoaded = true;
      //   this.RegisterData = this.convertArrayToObject(res);
      //   console.log(this.RegisterData);
      //   resolve(true);
      // });

      const body = new HttpParams()
        .set('Mtype', 'A15')
      this.postData(body).then(res => {
        // alert(JSON.stringify(res));
        this.IsFirstLoaded = true;
        this.RegisterData = this.convertArrayToObject(res);
        console.log(`RegisterData = `, this.RegisterData);
        resolve(true);
      });

    });
  }


  updateArray(originalArray, newArray, key) {
    // إنشاء خريطة لتسهيل البحث عن العناصر بواسطة المفتاح
    const map = new Map(originalArray.map(item => [item[key], item]));

    // تحديث أو إضافة العناصر الجديدة
    newArray.forEach(newItem => {
      if (map.has(newItem[key])) {
        // إذا كان العنصر موجودًا، نقوم بتحديثه
        Object.assign(map.get(newItem[key]), newItem);
      } else {
        // إذا كان العنصر غير موجود، نضيفه
        originalArray.push(newItem);
      }
    });

    return originalArray;
  }

  getPatients() {
    let DateTimeNow = this.datetimeService.getCurrentDateTime();

    // alert(this.datetimeService.getCurrentDateTime());
    // return;
    // alert((new Date()).toISOString().split(`T`)[0] +' '+(new Date()).toISOString().split(`T`)[1].split(`.`)[0]);
    // return;
    // let Query = `select
    // IDP, IDBranch, IDAcc, NameE, NameA, SocialID, Phon1, Phon2, Phon3, LastModifyDate
    // from patients`;

    // this.storage.remove(`PATIENT_LIST`);

    this.storage.get(`PATIENT_LIST`).then(val => {
      if (val) {
        console.log(val);

        this.tblPatient = val.tblPatient;
        // alert(val.tblPatient);
        // alert(val.LastModifyDate);
        // 

        let Query = `select p.IDP, p.IDBranch, ifnull(a.Ac_Num,0) FileNo ,p.NameE, p.NameA, p.SocialID, p.Phon1, p.Phon2, p.Phon3, p.LastModifyDate
        from patients p
        Left join acc a on p.idc=a.idc and p.idAcc=a.IDP
        WHERE p.LastModifyDate>"${val.LastModifyDate}" `;

        console.log(`Query= `, Query);
        const body = new HttpParams()
          .set('Mtype', 'A16')
          .set('Query', Query);

        this.postData(body, false).then(res => {
          console.log(res[`Q0`]);
          let tblPatient = res[`Q0`];
          // this.alert(JSON.stringify(tblPatient));

          this.tblPatient = this.updateArray(this.tblPatient, tblPatient, 'IDP');



          // this.tblPatient = this.tblPatient.concat(res[`Q0`]);
          // console.log(`res= `, res);
          // // if (res[`Q0`].length > 0) this.storage.set(`PATIENT_LIST`, this.tblPatient );

          if (res[`Q0`].length > 0) this.storage.set(`PATIENT_LIST`, {
            LastModifyDate: DateTimeNow,
            tblPatient: this.tblPatient
          });

        });

      } else {

        let Query = `select p.IDP, p.IDBranch, ifnull(a.Ac_Num,0) FileNo ,p.NameE, p.NameA, p.SocialID, p.Phon1, p.Phon2, p.Phon3, p.LastModifyDate
        from patients p
        Left join acc a on p.idc=a.idc and p.idAcc=a.IDP`;
        // alert(0)
        console.log(`Query= `, Query);

        const body = new HttpParams()
          .set('Mtype', 'A16')
          .set('Query', Query);

        this.postData(body, false).then(res => {
          console.log(res[`Q0`]);
          // this.alert(res[`Q0`].length);
          this.tblPatient = res[`Q0`];
          // this.tblfilterPatient = res[`Q0`].slice(0, 10);
          console.log(`res= `, res);
          if (res[`Q0`].length > 0) this.storage.set(`PATIENT_LIST`, {
            LastModifyDate: DateTimeNow,
            tblPatient: res[`Q0`]
          });
        });
      }
    });



  }

  getDoctorsAndRooms() {
    return new Promise(resolve => {
      // جلب الأطباء 
      let Query0 = `Call DoctorsList(1,"","","0")`;
      // يجلب السيرة الذاتية للطبيب
      let Query1 = `SELECT ID,IDP,IDC,Datastream FROM employees e where e.ID_Job=7 and e.IDC=${this.User.IDC} and not (e.Emp_Status in (2,3))`;
      // جلب الغرف
      let Query2 = `Select * from ( select distinct 0 RType,b.IDC,10000*b.IDP IDP,0 IDF,b.IDP IDBranch,0 ID_Dept,b.NameA, b.NameE,"" SName,0 DurationTime, 0 IDAttendance,b.Serial IDSort ,0 RoomType,0 IDDoctor,0 Checked from Branchs b inner join OperatingRooms o on b.idc=o.idc and b.idp=o.idbranch where b.IDC=${this.User.IDC} and O.Active=1 union All SELECT 2 RType,O.IDC,O.IDP          ,10000*O.IDBranch IDF,O.IDBranch    ,O.ID_Dept,if(Trim(O.NameA)="",O.NameE,O.NameA) NameA, O.NameE,"" SName,O.DurationTime, O.IDAttendance,O.IDSort ,O.RoomType,O.IDDoctor ,0 Checked FROM OperatingRooms o where O.Active=1 and O.IDC=${this.User.IDC} ) a Order by Rtype,if(IDBranch=2,IDBranch,IDBranch+100),IDSort`;
      // جلب بعض المرضى
      let Query3 = `select * from Patients where IDC=${this.User.IDC} order by IDP desc limit 1`;
      // let Query3 = `select * from Patients where IDC=${this.User.IDC} and IDP=(Select Max(IDP) as MaxID from Patients)`;
      let Query4 = `Select 0 ID,0 IDP,"Any Branch" NameE,"Any Branch" NameA UNION ALL Select ID,IDP,NameE,NameA from branchs where IDC=${this.User.IDC}`;

      const body = new HttpParams()
        .set('Mtype', 'A16')
        .set('Query', `${Query0};${Query1};${Query2};${Query3};${Query4}`);

      this.postData(body).then(res => {

        if (res[`Q0Error`] != "") {
          this.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
          console.log(`Q0Error= `, res[`Q0Error`]);
        }
        if (res[`Q1Error`] != "") {
          this.ngxToast(`Q1Error= `, res[`Q1Error`]), `warning`;
          console.log(`Q1Error= `, res[`Q1Error`]);
        }
        if (res[`Q2Error`] != "") {
          this.ngxToast(`Q2Error= `, res[`Q2Error`], `warning`);
          console.log(`Q2Error= `, res[`Q2Error`]);
        }
        if (res[`Q3Error`] != "") {
          this.ngxToast(`Q3Error= `, res[`Q3Error`], `warning`);
          console.log(`Q3Error= `, res[`Q3Error`]);
        }
        if (res[`Q4Error`] != "") {
          this.ngxToast(`Q4Error= `, res[`Q4Error`], `warning`);
          console.log(`Q4Error= `, res[`Q4Error`]);
        }
        this.tblBranch = res[`Q4`];
        // alert(this.tblBranch.length);
        // let DDD = this.deepCopy(res[`Q0`]);
        // console.log(`DDD= `, DDD);
        this.tblDoctors = res[`Q0`];
        this.tblDoctorsInfo = res[`Q1`];
        // console.log(`DoctorsList,  Q0= `, res[`Q0`]);
        // console.log(`Q1= `, res[`Q1`]);

        // console.log(`Q2= `, res[`Q2`]);
        this.tblRooms = res[`Q2`];
        if (res[`Q3`].length > 0) { this.Patient = res[`Q3`][0]; }
        // tblRooms = Array.from(
        //   new Set(tblRooms.map(item => JSON.stringify(item)))
        // ).map(item => JSON.parse(item as string));
        // this.tblRooms = tblRooms;
        resolve(true);
      });
    });
  }

  // async postData2(data: any,) {
  //   // cmd: 3:Update, 2:Add, 1: Get
  //   let startDate = new Date();

  //   const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

  //   const loading = await this.loadingController.create({
  //     translucent: true,
  //   });
  //   return new Promise(resolve => {

  //     loading.present().then(() => {
  //       this.http.post(`/api/`, data, { headers }).subscribe((Response: any) => {
  //         console.log(Response);
  //         let endDate = new Date();
  //         let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  //         console.log(`Period= `, seconds);
  //         loading.dismiss();
  //         if (Response['Login'] == false) {
  //           resolve(0);
  //           return false;
  //         }
  //         if (Response['ErrorNumber'] != 0) {
  //           this.ngxToast(`ReturnError`, `warning`);
  //           resolve(0);
  //           return false;
  //         }
  //         if (Response[`ClosedPeriod`] == true) {
  //           this.ngxToast('The operation cannot be carried out, because the invoice or bond is within a closed tax period', ``, `warning`);
  //           resolve(0);
  //         }
  //         resolve(Response);
  //       }, (err) => {
  //         loading.dismiss();
  //         console.log(err);
  //         this.ngxToast(`ConnectionError`, ``, `warning`);
  //         resolve(0);
  //       });
  //     });
  //   });
  // }

  async postData(body: HttpParams, isLoading = true) {
    body = body.set("IDC", this.User.IDC);
    body = body.set("HCode", this.User.HCode);
    // cmd: 3:Update, 2:Add, 1: Get
    let startDate = new Date();

    if (this.User.IDC) body = body.set("IDC", this.User.IDC.toString()); // data.append("IDC", this.User.IDC.toString());
    if (this.User.IDB) body = body.set("IDB", this.RegisterData.Branch);
    if (this.User.IDP) body = body.set("IDUser", this.User.IDP.toString());

    console.log(`body= `, body);


    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    const loading = await this.loadingController.create({
      translucent: true,
    });
    return new Promise(resolve => {
      if (isLoading) { loading.present().then(() => { }); }


      this.http.post(this.BaseUrl, body.toString(), { headers }).subscribe((Response: any) => {
        // alert(`urlssss`);
        // console.log(Response);
        // alert(4)
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        console.log(`getDataTime= `, seconds, `Response= `, Response);
        loading.dismiss();

        resolve(Response);
      }, (err) => {
        // alert(`dddd`);
        console.log(err);
        if (isLoading) {
          loading.dismiss();
          this.ngxToast(`ConnectionError`, ``, `warning`);
        }

        resolve(0);
      });

    });
  }

  async ngxToast(msgKeyLng, ErrNO = '', color = 'dark') {
    console.log(msgKeyLng);
    const toast = await this.toastController.create({
      message: this.translate.instant(msgKeyLng) + ' ' + ErrNO,
      duration: 2000,
      position: 'middle',
      // showCloseButton: true,
      // closeButtonText: 'X',
      cssClass: 'normalToast',
      color: color
    });
    toast.present();
  }
  // confirm(message: any, header = `Attention`) {
  //   return new Promise(resolve => {
  //     this.alertController.create({
  //       header: header,
  //       message: message,
  //       buttons: [
  //         {
  //           text: `Cancel`,
  //           role: 'cancel',
  //           cssClass: 'btn-alert-success',
  //           handler: (blah) => {
  //             console.log('Confirm Cancel: blah');
  //             resolve(false);
  //           }
  //         }, {
  //           text: `Yes`,
  //           cssClass: 'btn-alert-cancel',
  //           handler: (data) => {
  //             console.log('Confirm Okay');
  //             resolve(true);
  //           }
  //         }
  //       ]
  //     }).then((confirm) => {
  //       confirm.present();
  //     });
  //   });
  // }

  checkPhoneNumber(phoneNumber) {
    // تعبير نمطي للتحقق من رقم الموبايل (يبدأ بـ 05 ويتبعه 8 أرقام)
    const mobileRegex = /^05\d{8}$/;

    // تعبير نمطي للتحقق من رقم الهاتف الثابت (يبدأ بـ 01 ويتبعه 7 أرقام)
    const landlineRegex = /^01\d{7}$/;

    // تعبير نمطي للتحقق من رقم الهاتف الخارجي (يبدأ بـ + أو 00 أو بدون أي منهما)
    const internationalRegex = /^(\+|00)?\d{1,4}\d{7,14}$/;

    if (mobileRegex.test(phoneNumber)) {
      // return "رقم موبايل صحيح";
      return "Mobile";
    } else if (landlineRegex.test(phoneNumber)) {
      return "Local";
    } else if (internationalRegex.test(phoneNumber)) {
      return "External";
    } else {
      return "Wrong";
    }
  }

  isPhoneNumber(text) {
    // تعريف التعبير المنتظم لرقم الهاتف
    // const phonePattern = /^(?:\+?\d{1,3})?[-.\s]?(?:\(\d{1,4}\))?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    // return phonePattern.test(text);
    const phonePattern = /^0\d{9}$/; // يبدأ بـ 0 ويتبعه 9 أرقام (إجمالي 10 خانات)
    return phonePattern.test(text);
  }

  isEmailAddress(text) {
    // تعريف التعبير المنتظم للبريد الإلكتروني
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(text);
  }

  confirm(message: any, header = `Attention`) {
    return new Promise(resolve => {
      this.alertController.create({
        header: header,
        message: message,
        cssClass: `custom-confirm`,
        buttons: [
          {
            text: `Cancel`,
            cssClass: 'alert-button-cancel',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
              resolve(false);
            }
          }, {
            cssClass: 'alert-button-confirm',
            text: `Yes`,
            handler: (data) => {
              console.log('Confirm Okay');
              resolve(true);
            }
          }
        ]
      }).then((confirm) => {
        confirm.present();
      });
    });
  }



  getDateNow(Char: any) {
    let d = new Date();
    let yy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();

    let day: string = dd.toString();
    let month: string = mm.toString();
    if (+day < 10) { day = "0" + dd; }
    if (+month < 10) { month = "0" + mm; }

    return `${yy}${Char}${month}${Char}${day}`;
  }


  async getData(url: any) {
    const loading = await this.loadingController.create({
      spinner: `bubbles`, //
      duration: 5000, //
      message: this.translate.instant(`Loading`) + '...',
      translucent: true,
      cssClass: 'custom-loading'
    });
    return new Promise(resolve => {
      loading.present().then(() => {
        url = this.BaseUrl + url;
        // url = `/` + url;

        console.log(url);

        this.http.get(url).subscribe(Response => {
          console.log(`Response= `, Response);
          loading.dismiss();
          resolve(Response);
        }, (err) => {
          console.log(`err= `, err);
          loading.dismiss();
          resolve(0);
        });
      });
    });
  }

  getDateFromDatetime(dateTimeString) {
    // استخدم تعبير منتظم لاستخراج التاريخ فقط
    const match = dateTimeString.match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : null;
  }

  // getDateTimeWithoutSecound(isoDateTime) {
  //   // تحويل النص إلى كائن Date
  //   const date = new Date(isoDateTime);

  //   // استخراج التاريخ والوقت باستخدام دوال UTC
  //   const year = date.getUTCFullYear();
  //   const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // إضافة الصفر إلى الشهر إذا كان أقل من رقمين
  //   const day = String(date.getUTCDate()).padStart(2, '0');
  //   const hours = String(date.getUTCHours()).padStart(2, '0');
  //   const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  //   // تنسيق النص الجديد
  //   return `${year}-${month}-${day} ${hours}:${minutes}`;
  // }

  getTimeWithoutSecound(isoDateTime) {
    // تحويل النص إلى كائن Date
    const date = new Date(isoDateTime);

    // استخراج التاريخ والوقت باستخدام دوال UTC
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // إضافة الصفر إلى الشهر إذا كان أقل من رقمين
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // تنسيق النص الجديد
    return `${hours}:${minutes}`;
  }

  getTimeFromDateTime(isoDateTime) {
    // تحويل النص إلى كائن Date
    const date = new Date(isoDateTime);

    // استخراج الوقت باستخدام الدوال المحلية
    const hours = String(date.getHours()).padStart(2, '0'); // الساعات
    const minutes = String(date.getMinutes()).padStart(2, '0'); // الدقائق
    const seconds = String(date.getSeconds()).padStart(2, '0'); // الثواني

    // تنسيق النص الجديد
    return `${hours}:${minutes}:${seconds}`;
  }

  getMiladyFromHijri(hijriDate: string): string {
    const hijriOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // calendar: 'islamic-umalqura',
    };

    const hijri = new Intl.DateTimeFormat('en-SA-u-ca-islamic-umalqura', hijriOptions).format(new Date(hijriDate));

    const gregorianOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      // calendar: 'gregory',
    };

    const gregorianDate = new Intl.DateTimeFormat('en-US-u-ca-gregory', gregorianOptions).format(new Date(hijri));
    const [month, day, year] = gregorianDate.split('/');

    return `${year}-${month}-${day}`;
  }

  getHijriDate(gregorianDate: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };

    const hijriDate = new Intl.DateTimeFormat('en-SA-u-ca-islamic-umalqura', options).format(new Date(gregorianDate));
    const [hijriMonth, hijriDay, hijriYear] = hijriDate.split('/');
    return `${hijriYear.split(' ')[0]}-${hijriMonth.length == 2 ? hijriMonth : `0${hijriMonth}`}-${hijriDay.length == 2 ? hijriDay : `0${hijriDay}`}`;
  }

  deepCopy(obj: any) {
    var copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.deepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  isDate_YYYY_MM_DD(dateStr) {
    // تعبير منتظم للتحقق من تنسيق YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    // التحقق من التنسيق
    if (!regex.test(dateStr)) {
      return false;
    }

    // تحويل النص إلى كائن Date
    const date = new Date(dateStr);

    // التحقق من أن التاريخ صالح
    const isDateValid =
      date.getFullYear() === parseInt(dateStr.slice(0, 4)) &&
      date.getMonth() + 1 === parseInt(dateStr.slice(5, 7)) &&
      date.getDate() === parseInt(dateStr.slice(8, 10));

    return isDateValid;
  }

  isDate_YYYY_MM_DD_HH_MM(dateString) {
    // التعبير العادي للتحقق من الصيغة yyyy-MM-dd HH:mm
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    return regex.test(dateString);
  }

  


  sortJsonArray(array, key, order = 'asc') {
    return array.sort((a, b) => {
      if (a[key] < b[key]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  toLocalISOString(date) {
    const offset = date.getTimezoneOffset(); // الحصول على الإزاحة الزمنية بالدقائق
    const offsetHours = Math.abs(Math.floor(offset / 60)).toString().padStart(2, '0');
    const offsetMinutes = Math.abs(offset % 60).toString().padStart(2, '0');
    const sign = offset > 0 ? '-' : '+';

    // بناء الصيغة مع الإزاحة الزمنية
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  }

  generateRandomNumber(n) {
    if (n <= 0) {
      throw new Error("عدد الخانات يجب أن يكون أكبر من الصفر.");
    }

    let result = '';
    for (let i = 0; i < n; i++) {
      // إضافة رقم عشوائي من 0 إلى 9
      result += Math.floor(Math.random() * 10);
    }

    return result;
  }

  async alert(message: any, header = ``, subHeader = ``, buttons = ['OK']) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons,
      cssClass: 'alert-class',
    });
    await alert.present();
  }

  tblDoctorsInfo = [];
  tblDoctors = [];
  tblRooms = [];
  Patient;
  CurrentDate = this.toLocalISOString(new Date()).split(`T`)[0];
  // tblDoctors = [
  //   {
  //     "ID": 265, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 1, "IDNature": 0,
  //     "IDAcc": 137850, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 0, "WaitOver": 3, "IDP": 1265,
  //     "NameA": "Dr. لآينيتت", "NameE": "Dr.lynette", "sName": "0000", "Emp_Status": "0", "Last_Update":
  //       "2022-01-26 16:24:22", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "",
  //     "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 9, "IDAgreement": 0, "InsuranceEnable": 1,
  //     "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 300, "DoctorOnDuty": 1, "DoctorBranches":
  //       "2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0,
  //     "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0
  //   },
  //   { "ID": 10, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 1, "IDNature": 0, "IDAcc": 72787, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1010, "NameA": "Dr. آلمالكي", "NameE": "Dr.almalki", "sName": "0000", "Emp_Status": "0", "Last_Update": "2019-06-22 11:41:32", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 9, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 1320, "DoctorOnDuty": 1, "DoctorBranches": "2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 270, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 141012, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1270, "NameA": "TC. آلدوسار", "NameE": "TC.ALDOSARE", "sName": "0000", "Emp_Status": "0", "Last_Update": "2022-06-21 16:37:23", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 1, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 2880, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 271, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 141013, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1271, "NameA": "TC. آلدوساري", "NameE": "TC.aldossari", "sName": "0000", "Emp_Status": "0", "Last_Update": "2022-06-21 16:36:56", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 4680, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 40, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 72817, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1042, "NameA": "TC. آلميوتايري", "NameE": "TC.almutairi", "sName": "0000", "Emp_Status": "0", "Last_Update": "2017-08-13 00:41:34", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 4680, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 303, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 3, "IDNature": 0, "IDAcc": 0, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 0, "WaitOver": 3, "IDP": 1303, "NameA": "آلسالمان", "NameE": "ALSALMAN", "sName": "0000", "Emp_Status": "0", "Last_Update": "2023-11-28 12:28:16", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 19, "IDAgreement": 0, "InsuranceEnable": 1, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 4680, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 304, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 1, "IDNature": 0, "IDAcc": 153137, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 0, "WaitOver": 3, "IDP": 1304, "NameA": "كايس هبرة", "NameE": "kais habra", "sName": "", "Emp_Status": "0", "Last_Update": "2024-12-27 14:15:30", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 19, "IDAgreement": 0, "InsuranceEnable": 1, "Invoiceable": 1, "ShowByInternet": 0, "TimeSchedule": 1080, "DoctorOnDuty": 1, "DoctorBranches": "2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 73, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 72850, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1089, "NameA": "TC. آلابباد", "NameE": "TC.ALABBAD", "sName": "0000", "Emp_Status": "0", "Last_Update": "2017-08-13 00:06:53", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 2880, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 81, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 3, "IDNature": 0, "IDAcc": 72858, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1112, "NameA": "Dr. آلاتو", "NameE": "Dr.ALATAWE", "sName": "0000", "Emp_Status": "0", "Last_Update": "2024-03-26 01:23:28", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 9, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 6480, "DoctorOnDuty": 1, "DoctorBranches": "1,2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 146, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 1, "IDNature": 0, "IDAcc": 78467, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1177, "NameA": "Dr. آلباكير", "NameE": "Dr.albaker", "sName": "0000", "Emp_Status": "0", "Last_Update": "2024-01-15 17:25:33", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 9, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 480, "DoctorOnDuty": 1, "DoctorBranches": "2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 218, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 102871, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1222, "NameA": "TC. آلجيذ", "NameE": "TC.algeeth", "sName": "0000", "Emp_Status": "0", "Last_Update": "2018-11-04 12:02:10", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 1, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 4680, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }];

  // tblRooms = [
  //   {
  //     "ID": 265, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 1, "IDNature": 0,
  //     "IDAcc": 137850, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 0, "WaitOver": 3, "IDP": 1265,
  //     "NameA": "Dr. لآينيتت", "NameE": "Dr.lynette", "sName": "0000", "Emp_Status": "0", "Last_Update":
  //       "2022-01-26 16:24:22", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "",
  //     "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 9, "IDAgreement": 0, "InsuranceEnable": 1,
  //     "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 300, "DoctorOnDuty": 1, "DoctorBranches":
  //       "2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0,
  //     "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0
  //   },
  //   { "ID": 10, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 1, "IDNature": 0, "IDAcc": 72787, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1010, "NameA": "Dr. آلمالكي", "NameE": "Dr.almalki", "sName": "0000", "Emp_Status": "0", "Last_Update": "2019-06-22 11:41:32", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 9, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 1320, "DoctorOnDuty": 1, "DoctorBranches": "2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 270, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 141012, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1270, "NameA": "TC. آلدوسار", "NameE": "TC.ALDOSARE", "sName": "0000", "Emp_Status": "0", "Last_Update": "2022-06-21 16:37:23", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 1, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 2880, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 271, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 141013, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1271, "NameA": "TC. آلدوساري", "NameE": "TC.aldossari", "sName": "0000", "Emp_Status": "0", "Last_Update": "2022-06-21 16:36:56", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 4680, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 40, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 72817, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1042, "NameA": "TC. آلميوتايري", "NameE": "TC.almutairi", "sName": "0000", "Emp_Status": "0", "Last_Update": "2017-08-13 00:41:34", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 4680, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 303, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 3, "IDNature": 0, "IDAcc": 0, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 0, "WaitOver": 3, "IDP": 1303, "NameA": "آلسالمان", "NameE": "ALSALMAN", "sName": "0000", "Emp_Status": "0", "Last_Update": "2023-11-28 12:28:16", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 19, "IDAgreement": 0, "InsuranceEnable": 1, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 4680, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 304, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 1, "IDNature": 0, "IDAcc": 153137, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 0, "WaitOver": 3, "IDP": 1304, "NameA": "كايس هبرة", "NameE": "kais habra", "sName": "", "Emp_Status": "0", "Last_Update": "2024-12-27 14:15:30", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 19, "IDAgreement": 0, "InsuranceEnable": 1, "Invoiceable": 1, "ShowByInternet": 0, "TimeSchedule": 1080, "DoctorOnDuty": 1, "DoctorBranches": "2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 73, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 72850, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1089, "NameA": "TC. آلابباد", "NameE": "TC.ALABBAD", "sName": "0000", "Emp_Status": "0", "Last_Update": "2017-08-13 00:06:53", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 2880, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 81, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 3, "IDNature": 0, "IDAcc": 72858, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1112, "NameA": "Dr. آلاتو", "NameE": "Dr.ALATAWE", "sName": "0000", "Emp_Status": "0", "Last_Update": "2024-03-26 01:23:28", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 9, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 6480, "DoctorOnDuty": 1, "DoctorBranches": "1,2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 146, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 1, "IDNature": 0, "IDAcc": 78467, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1177, "NameA": "Dr. آلباكير", "NameE": "Dr.albaker", "sName": "0000", "Emp_Status": "0", "Last_Update": "2024-01-15 17:25:33", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 9, "IDAgreement": 0, "InsuranceEnable": 0, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 480, "DoctorOnDuty": 1, "DoctorBranches": "2", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }, { "ID": 218, "IsDoctor": 1, "DIDP": 1, "RType": 1, "IDC": 1, "IDF": 0, "ID_Dept": 7, "IDNature": 0, "IDAcc": 102871, "ApptSlotsPeriod": 15, "UseApptDefaultPeriod": 1, "WaitOver": 3, "IDP": 1222, "NameA": "TC. آلجيذ", "NameE": "TC.algeeth", "sName": "0000", "Emp_Status": "0", "Last_Update": "2018-11-04 12:02:10", "ECount": 74, "IDAttendance": 0, "IDItem": 1054, "DoctorsUnAllow": "", "DoctorPriority": 4, "DOrder": 2, "ID_Job_Iqamah": 8, "IDAgreement": 0, "InsuranceEnable": 1, "Invoiceable": 0, "ShowByInternet": 0, "TimeSchedule": 4680, "DoctorOnDuty": 1, "DoctorBranches": "3", "TotalDuration": 0, "SchedulePersent": 0, "WaitingSchedulePersent": 0, "TodayNewPatients": 0, "ThreeDaysNewPatients": 0, "WeekNewPatients": 0, "Checked": 0 }];

  convertTo12HourFormat(time24) {
    // تقسيم الوقت إلى ساعات، دقائق، ثواني
    const [hours, minutes, seconds] = time24.split(':');

    // إنشاء كائن Date مع الوقت المحدد
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    // تحويل الوقت إلى نظام 12 ساعة
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true // تفعيل نظام 12 ساعة
    });
  }

  convertTo12HourFormatWithoutSecound(time24) {
    // تقسيم الوقت إلى ساعات، دقائق، ثواني
    const [hours, minutes, seconds] = time24.split(':');

    // إنشاء كائن Date مع الوقت المحدد
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    // تحويل الوقت إلى نظام 12 ساعة
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // تفعيل نظام 12 ساعة
    });
  }

  isPositiveNumber(text) {
    const number = parseFloat(text);
    return !isNaN(number) && number > 0;
  }

  isPositiveNumberEntering(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const inputValue = (event.target as HTMLInputElement).value;

    // السماح بالأرقام (0-9)
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      // السماح بنقطة واحدة للكسور العشرية
      if (charCode === 46 && inputValue.indexOf('.') === -1) {
        return true;
      }
      // منع أي أحرف أخرى
      return false;
    }
    return true;
  }

  textToHex(text) {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
      // تحويل كل حرف إلى قيمته HEX
      hex += text.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hex;
  }

  sumArrayOfObject(array: any, Param: any) {
    return array.reduce(function (r: any, a: any) {
      if(a[Param])
      return +r + +a[Param];
    }, 0);
  }

  // back(HomePage = this.HomePage) {
  //   // alert(HomePage);
  //   try {
  //     this.nav.back();
  //   } catch {
  //     // console.log(HomePage);
  //     this.nav.navigateRoot(HomePage);
  //   }
  // }
}
