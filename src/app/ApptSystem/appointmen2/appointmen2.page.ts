import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
// import { NewAppComponent } from '../components/new-app/new-app.component';
// import { AllService } from '../services/all.service';
// import { ScheduleTimeComponent } from '../components/schedule-time/schedule-time.component';
// import { NextAvailableComponent } from '../components/next-available/next-available.component';
// import { ApptService } from '../services/appt.service';
import { HttpParams } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { AllService } from 'src/app/services/all.service';
import { ApptService } from 'src/app/services/appt.service';
import { CalendarEventService } from 'src/app/services/calendar-event.service';
import { ScheduleTimeComponent } from 'src/app/components/schedule-time/schedule-time.component';
import { NextAvailableComponent } from 'src/app/components/next-available/next-available.component';
import { NewAppComponent } from 'src/app/components/new-app/new-app.component';
import { DatetimeService } from 'src/app/services/datetime.service';
// import { CalendarEventService } from '../services/calendar-event.service';
declare const FullCalendar: any;


@Component({
  selector: 'app-appointmen2',
  templateUrl: './appointmen2.page.html',
  styleUrls: ['./appointmen2.page.scss'],
})
export class Appointmen2Page implements OnInit {

  public calendar: any;
  public contextMenu: any;

  // CurrentDate = this.all.toLocalISOString(new Date()); //  new Date().toISOString();

  tblDayColumn = [];


  IsShowDeleted = true;
  IsDayHeaderNots = false;
  IsYScroll = true; ColWidth = null;
  tblBlockErea = [
    {
      id: 100,
      start: `2024-12-17T08:15:00Z`,
      end: `2024-12-17T09:00:00Z`,
    },
  ];

  // events: any[] = [
  // {
  //   id: '1',
  //   resourceId: '1', // مرتبط بـ Room A
  //   // title: "First Line<br>Second Line",
  //   title: `<div style="background:red; padding:3px; border-radius: 3px;">Header</div>`,
  //   start: '2024-12-03T10:00:00',
  //   end: '2024-12-03T12:00:00',
  //   // resourceEditable: false,
  //   color: '#9c88ff',
  //   display: 'auto',
  //   extendedProps2: {
  //     NAmeA: 'Hands-on coding session',
  //     speaker: 'John Doe'
  //   }
  // },
  // {
  //   id: '2',
  //   resourceId: '2', // مرتبط بـ Room B
  //   title: 'Workshop',
  //   start: '2024-12-04T14:00:00',
  //   end: '2024-12-04T16:00:00',
  //   editable: false, // غير قابل للتعديل خارج اليوم
  //   // resourceEditable: true,
  //   display: 'block',
  // },
  // {
  //   id: '3',
  //   resourceId: '2', // مرتبط بـ Room B
  //   title: 'Workshop2',
  //   start: '2024-12-03T14:00:00',
  //   end: '2024-12-03T16:00:00',
  //   // resourceEditable: true,
  //   // eventClassNames: ['event-class1'],
  //   editable: true, // يمكن نقله لأي مكان
  //   durationEditable: true,
  //   display: 'list-item',
  // },
  // ];

  addMinutesToDate(dateStr, minutesToAdd) {
    let [datePart, timePart] = dateStr.split(' ');
    let [year, month, day] = datePart.split('-').map(Number);
    let [hour, minute] = timePart.split(':').map(Number);

    // إنشاء التاريخ بصيغة UTC بدون تأثير التوقيت المحلي
    let date = new Date(Date.UTC(year, month - 1, day, hour, minute));

    // إضافة الدقائق
    date.setUTCMinutes(date.getUTCMinutes() + minutesToAdd);

    // تنسيق النتيجة وإرجاعها بنفس التنسيق الأصلي
    let newDateStr = date.toISOString().slice(0, 16).replace('T', ' ');
    return newDateStr;
  }

  addMinutesToDateTime(dateTimeStr, minutes) {
    const date = new Date(dateTimeStr);
    // إضافة عدد الدقائق إلى الوقت
    // console.log(date.getMinutes());
    // date.setMinutes(date.getMinutes() + minutes);

    let newdate = new Date(date.getTime() + minutes * 60000);

    // تنسيق التاريخ والوقت الجديد بصيغة 'YYYY-MM-DD HH:MM'
    const year = newdate.getUTCFullYear();
    const month = String(newdate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(newdate.getUTCDate()).padStart(2, '0');
    const hours = String(newdate.getUTCHours()).padStart(2, '0');
    const minutesStr = String(newdate.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutesStr}`;
  }

  tblEvents = [];
  // tblHeaderNote = [];
  tblAppt = [];
  tblDeletedAppt = [];
  tblSlots = [];
  StartDate = `2025-02-10 05:00:00`;
  EndDate = `2025-02-11 05:00:00`;

  slotDuration = '00:15';
  slotMinTime = '05:00:00';  // يبدأ من الساعة 8 صباحًا
  slotMaxTime = '29:00:00';  // ينتهي عند الساعة 3 صباحًا من اليوم التالي

  // Shift1Color = "#f6e58d";
  // Shift2Color = "#6c5ce7";
  // Shift3Color = "#00b894";
  // BlockColor = "#ff7675";
  LastGet = new Date();
  constructor(private modalCtrl: ModalController, public all: AllService,
    public apptService: ApptService, private alertController: AlertController,
    private loadingController: LoadingController,
    private nav: NavController,
    private platform: Platform,
    private calendarEventService: CalendarEventService,
    private datetimeService:DatetimeService
  ) { }


  ionViewWillLeave() {
    // alert(`ionViewWillLeave`)
    this.modalCtrl.dismiss().then(() => {
      this.modalCtrl.dismiss();
    });
  }



  prepareSlots(Q1) {
    let tblSlotsInDates = this.filterSlots(Q1, this.StartDate, this.EndDate);
    let tmptblSlots = tblSlotsInDates.filter(x => this.apptService.tblSelectedDoctor.includes(x.IDDoctor));
    let tblRoomSlots = tblSlotsInDates.filter(x => this.apptService.tblSelectedRoom.includes(x.IDOperatingRoom));
    for (let s of tblRoomSlots) {
      s.WaitingApp = 0;
    }
    // alert(JSON.stringify(tmptblRoomSlots));
    // نقسم السلوتات إلى حقيقي وانتظار
    let tblSlotsReal = this.all.deepCopy(tmptblSlots.filter(x => x.RealApp == 1));
    for (let s of tblSlotsReal) {
      s.WaitingApp = 0;
    }
    let tblSlotsWait = this.all.deepCopy(tmptblSlots.filter(x => x.WaitingApp == 1));
    for (let s of tblSlotsWait) {
      s.RealApp = 0;
    }

    let tblSlots = tblSlotsReal.concat(tblSlotsWait, tblRoomSlots);
    // لإزالة الأوقات المتداخلة أو المكررة
    tblSlots = this.apptService.removeOverlappingEntries(tblSlots);
    let tblNewSlots = this.apptService.getNewElements(tblSlots, this.tblSlots);
    // إضافة القيم الجديدة
    this.tblSlots = this.apptService.addUniqueElements(tblSlots, this.tblSlots);
    return tblNewSlots;
  }

  refreshSchedule() {
    let IDsDoctors = ``;
    for (let dr of this.apptService.tblSelectedDoctor) {
      if (IDsDoctors.length > 0) {
        IDsDoctors += `,`;
      }
      IDsDoctors += dr;
    }

    let IDsRooms = ``;
    for (let rm of this.apptService.tblSelectedRoom) {
      if (IDsRooms.length > 0) {
        IDsRooms += `,`;
      }
      IDsRooms += rm;
    }

    // alert(this.all.getTimeFromDateTime(this.LastGet));
    // Call AppointmentsViewNew1(1,17,
    // "2025-03-18",
    // "2025-03-19 05:00:00",
    // "2025-03-18 22:35:35",
    // "1","2","","");
    // this.LastGet.setMinutes(this.LastGet.getMinutes() - 5);

    const date = new Date(this.all.CurrentDate);
    let tmpEndDate = this.all.toLocalISOString(new Date(date.getTime() + (this.apptService.ViewDayCount * 24 * 60 * 60 * 1000)));
    this.EndDate = this.getQueryDate(tmpEndDate);

    // alert(this.LastGet.toISOString());

    let Query0 = `Call AppointmentsViewNew1(${this.all.User.IDC},${this.all.User.IDP},
    "${this.all.CurrentDate}",
    "${this.EndDate}",
    "${this.LastGet.toISOString().split(`T`)[0]} ${this.all.getTimeFromDateTime(this.LastGet.setMinutes(this.LastGet.getMinutes() - 5))}",
    ${this.all.RegisterData.Branch},
    "${IDsDoctors}",
    "${IDsRooms}",
    "")`;


    let Query1 = `Select IDBranch, IDP, IDDoctor, IDOperatingRoom, DayNo, ShiftNo, StartDate, EndDate, OpenTime, ClosedTime, State, IsRepeated, IDGroup, RealApp, WaitingApp, Schedule, Description, WaitingCount, OverbookingCount from ScheduleTime s where s.IDC=${this.all.User.IDC} and (  (s.StartDate  between "${this.StartDate}" and "${this.EndDate}") or  (s.ClosedTime between "${this.StartDate}" and "${this.EndDate}") ) and  ("${this.all.RegisterData.Branch}"="" or s.IDBranch=0 or Find_In_Set(s.IDBranch,"${this.all.RegisterData.Branch}")>0) Order by s.IDDoctor,s.StartDate,s.State,s.Schedule Desc,s.OpenTime`;

    let Query = `${Query0};${Query1}`;

    // console.log(`Query3= `, Query3);
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body, false).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }
      this.LastGet = new Date();

      let tblNewSlots = this.prepareSlots(res[`Q1`]);
      // alert(tblNewSlots.length);
      this.addSlotsToSchedule(tblNewSlots);
      // this.closeEmpty();  //   ssw 11-05-2025
      // alert(res[`Q0`][0][`ID`] == undefined)
      if (res[`Q0`].length > 0 && res[`Q0`][0][`ID`] == undefined) {
        // alert(33333)
        return;
      }

      let tblAppt = res[`Q0`].filter(x => x.Deleted == 0);
      let tblDeletedAppt = res[`Q0`].filter(x => x.Deleted == 1);
      // alert(tblAppt.length)
      //--------------
      for (let appt of tblAppt) {
        // alert(JSON.stringify(appt));
        if (this.tblAppt.filter(x => x.ID == appt.ID).length > 0) {
          // alert(2)
          this.calendar.getEventById(appt.ID).remove();
          this.tblAppt = this.tblAppt.filter(x => x.ID != appt.ID);
          this.tblAppt.push(appt);
        }
      }
      console.log(`new tblAppt= `, tblAppt);
      this.addApptToSchedule(tblAppt, false, true);

      //--------------
      for (let appt of tblDeletedAppt) {
        if (this.tblDeletedAppt.filter(x => x.ID == appt.ID).length > 0) {
          this.calendar.getEventById(appt.ID).remove();
          if (appt.IDOperatingRoom > 0) {
            setTimeout(() => {
              this.calendar.getEventById(appt.ID).remove();
            }, 50);
          }
          this.tblDeletedAppt = this.tblDeletedAppt.filter(x => x.ID != appt.ID);
          this.tblDeletedAppt.push(appt);
        }
      }
      if (this.IsShowDeleted) {
        this.addApptToSchedule(tblDeletedAppt, true, true);
      }
    });
  }

  AppointmentMinPeriod = 5;// this.all.RegisterData.AppointmentMinPeriod;
  ngOnInit() {


    // let date = new Date();
    // alert(
    //   date.getUTCFullYear() + '-' +
    //   String(date.getUTCMonth() + 1).padStart(2, '0') + '-' +
    //   String(date.getUTCDate()).padStart(2, '0') + 'T' +
    //   String(date.getUTCHours()).padStart(2, '0') + ':' +
    //   String(date.getUTCMinutes()).padStart(2, '0') + ':' +
    //   String(date.getUTCSeconds()).padStart(2, '0') + '.' +
    //   String(date.getUTCMilliseconds()).padStart(3, '0') + 'Z'
    // );
    // alert((new Date("2025-03-03 13:00:00")).toTimeString().split(' ')[0]);

    this.all.getfirstLoad().then(res => {
      if (res) {
        if (this.apptService.tblSelectedDoctor.length > 0) {
          this.AppointmentMinPeriod = this.all.tblDoctors.find(x => x.IDP == this.apptService.tblSelectedDoctor[0]).ApptSlotsPeriod;
        } else {
          this.AppointmentMinPeriod = this.all.RegisterData.AppointmentMinPeriod;
        }
        // alert(this.AppointmentMinPeriod?.toString().length);
        this.slotDuration = `00:${this.AppointmentMinPeriod.toString().length == 1 ? '0' : ''}${this.AppointmentMinPeriod}`;
        // alert(this.slotDuration);
        this.slotMinTime = `${this.all.RegisterData.AdditionalHoursForDay.length == 1 ? '0' : ''}${this.all.RegisterData.AdditionalHoursForDay}:00:00`;  // يبدأ من الساعة 8 صباحًا
        this.slotMaxTime = `${24 + +this.all.RegisterData.AdditionalHoursForDay}:00:00`;
        // alert(this.slotMinTime);
        // alert(this.slotMaxTime);


        this.StartDate = this.getQueryDate(this.all.CurrentDate);
        const date = new Date(this.all.CurrentDate);
        let tmpEndDate = this.all.toLocalISOString(new Date(date.getTime() + (this.apptService.ViewDayCount * 24 * 60 * 60 * 1000)));
        this.EndDate = this.getQueryDate(tmpEndDate);


        setTimeout(() => {
          this.getDataBeforRender().then(yes => {
            this.reRender();
            this.getSechudleData();
          });
          this.all.CurrentDate = this.all.CurrentDate.split(`T`)[0];
        }, 500);

      }
    });

    // إخفاء القائمة عند النقر خارجها
    // document.addEventListener('click', () => {
    //   const menu = document.getElementById('context-menu');
    //   if (menu) {
    //     menu.style.display = 'none';
    //   }
    // });


    document.addEventListener('click', (event: any) => {
      const menu = document.getElementById('context-menu');
      const isClickInsideMenu = menu.contains(event.target); // هل النقرة داخل القائمة؟

      if (!isClickInsideMenu && menu.style.display === 'block') {
        menu.style.display = 'none';
      }
    });
  }

  tblNote = [];
  LastNoteQuery = ``;
  getDataBeforRender() {
    return new Promise(resolve => {
      // alert(this.dateToNumber('2025-03-09'));
      let Days = ``;
      // alert(1)
      for (let i = 0; i < this.apptService.ViewDayCount; i++) {
        // alert(i)
        let day = this.getAdjacentDate(this.all.CurrentDate, i);
        if (Days != ``) {
          Days += ` Union All `;
        }
        Days += ` Select ${this.dateToNumber(day)} d `;
      }
      if (this.LastNoteQuery == Days) {
        resolve(true);
        return;
      }
      this.LastNoteQuery = Days;

      let Query0 = `select FROM_DAYS(a.d) RepeatedDate,
      group_concat(distinct Note order by Date(ShowDate) desc SEPARATOR "|") Note, 
      Max(Importance) Importance from ScheduleDailyNote s,
      (${Days}) a 
      where s.IDC=${this.all.User.IDC} and s.Active=1 and (TO_DAYS(s.ShowDate)=a.d or (a.d-TO_DAYS(ShowDate)) mod EvryDayCount=0) group by d`;
      console.log(`Query0`, Query0);

      let Query = Query0;
      const body = new HttpParams()
        .set('Mtype', 'A16')
        .set('Query', Query);

      this.all.postData(body, true).then(res => {
        this.tblNote = res[`Q0`];

        if (this.all.IsFirstNote && this.tblNote.length > 0) {
          this.showDayNotes();
        }
        this.all.IsFirstNote = false;
        // alert(JSON.stringify(this.tblNote));
        resolve(true);
      });
    });
  }

  dateToNumber(dateString) {
    const baseDate: any = new Date("0000-01-01"); // التاريخ المرجعي الصحيح
    const inputDate: any = new Date(dateString);
    const diffTime = inputDate - baseDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  IsFirstRender = false;
  DoublicatedCommand = false;
  currentDateChanged(ev) {
    // alert(2)
    if (this.apptService.ViewDayCount > 1) {
      this.tblDayColumn = [];
    }

    if (this.DoublicatedCommand) {
      // alert(56)
      return;
    }
    this.DoublicatedCommand = true;
    setTimeout(() => {
      this.DoublicatedCommand = false;
    }, 250);

    if (!this.IsFirstRender) { return; }
    this.all.CurrentDate = this.all.CurrentDate.split(`T`)[0];
    if (!this.all.CurrentDate) {
      return;
    }

    console.log(`currentDateChanged= `, ev);
    this.calendar.gotoDate(this.all.CurrentDate);



    let date = new Date(this.all.CurrentDate);
    this.StartDate = this.getQueryDate(this.all.CurrentDate);
    let newEndDate = new Date(date.getTime() + ((+this.apptService.ViewDayCount) * 24 * 60 * 60 * 1000));
    this.EndDate = this.getQueryDate(this.all.toLocalISOString(newEndDate));
    // alert(5);
    this.LastGet = new Date();
    this.getSechudleData();

  }

  // removeSlotsAfterDateTime(tblSlot, dateTimeStr) {
  //   // تحويل التاريخ والوقت المحدد إلى كائن Date
  //   let targetDateTime = new Date(dateTimeStr);

  //   // تصفية المصفوفة
  //   return tblSlot.filter(slot => {
  //     // تحويل StartDate و OpenTime إلى كائن Date
  //     let slotDateTimeStr = `${slot.StartDate} ${slot.OpenTime}`;
  //     let slotDateTime = new Date(slotDateTimeStr);

  //     // إبقاء العناصر التي يكون تاريخها ووقتها أقل من أو يساوي التاريخ المحدد
  //     return slotDateTime <= targetDateTime;
  //   });
  // }

  filterSlots(tblSlot, start, end) {
    // تحويل التواريخ والأوقات إلى كائنات Date
    let startDate = new Date(start);
    let endDate = new Date(end);

    // تصفية المصفوفة
    return tblSlot.filter(slot => {
      let slotDateTime = new Date(`${slot.StartDate} ${slot.OpenTime}`);
      return slotDateTime >= startDate && slotDateTime <= endDate;
    });
  }

  async getSechudleData() {
    const loading = await this.loadingController.create({
      translucent: true,
    });
    // alert(2);
    loading.present().then(() => { });

    // if(Zero) {this.tblDayColumn = [];}

    this.tblAppt = [];
    this.tblDeletedAppt = [];
    this.tblSlots = [];
    this.calendar.removeAllEvents();
    // alert(this.all.CurrentDate);
    // return;
    // الملاحظات في راس السكجدوال
    // let Query2 = `select FROM_DAYS(a.d) RepeatedDate,group_concat(distinct Note order by Date(ShowDate) desc SEPARATOR "|") Note, Max(Importance) Importance from ScheduleDailyNote s,(Select 739658 d) a where s.IDC=${this.all.User.IDC} and s.Active=1 and (TO_DAYS(s.ShowDate)=a.d or (a.d-TO_DAYS(ShowDate)) mod EvryDayCount=0) group by d`

    let IDsDoctors = ``;
    for (let dr of this.apptService.tblSelectedDoctor) {
      if (IDsDoctors.length > 0) {
        IDsDoctors += `,`;
      }
      IDsDoctors += dr;
    }


    let IDsRooms = ``;
    for (let rm of this.apptService.tblSelectedRoom) {
      if (IDsRooms.length > 0) {
        IDsRooms += `,`;
      }
      IDsRooms += rm;
    }


    let Query0 = `Call AppointmentsViewNew1(${this.all.User.IDC},${this.all.User.IDP},"${this.StartDate.split(` `)[0]}","${this.EndDate}","${this.StartDate.split(` `)[0]}",${this.all.RegisterData.Branch},"${IDsDoctors}","${IDsRooms}","")`;
    // let Query0 = `Call AppointmentsViewNew1(${this.all.User.IDC},${this.all.User.IDP},"${this.StartDate.split(` `)[0]}","${this.EndDate}","${this.StartDate.split(` `)[0]}",${this.all.RegisterData.Branch},"${IDsDoctors}","${IDsRooms}","-WalkIn")`;
    let Query1 = `Select IDBranch, IDP, IDDoctor, IDOperatingRoom, DayNo, ShiftNo, StartDate, EndDate, OpenTime, ClosedTime, State, IsRepeated, IDGroup, RealApp, WaitingApp, Schedule, Description, WaitingCount, OverbookingCount from ScheduleTime s where s.IDC=${this.all.User.IDC} and (  (s.StartDate  between "${this.StartDate}" and "${this.EndDate}") or  (s.ClosedTime between "${this.StartDate}" and "${this.EndDate}") ) and  ("${this.all.RegisterData.Branch}"="" or s.IDBranch=0 or Find_In_Set(s.IDBranch,"${this.all.RegisterData.Branch}")>0) Order by s.IDDoctor,s.StartDate,s.State,s.Schedule Desc,s.OpenTime`;
    console.log(`Query1= `, Query0);
    console.log(`Query2= `, Query1);

    let Query = `${Query0};${Query1}`;

    // console.log(`Query3= `, Query3);
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body, false).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }
      if (res[`Q1Error`] != "") {
        this.all.ngxToast(`Q1Error= `, res[`Q1Error`], `warning`);
        console.log(`Q1Error= `, res[`Q1Error`]);
      }
      // if (res[`Q2Error`] != "") {
      //   this.all.ngxToast(`Q2Error= `, res[`Q2Error`], `warning`);
      //   console.log(`Q2Error= `, res[`Q2Error`]);
      // }
      console.log(`Q0= `, res[`Q0`]);
      console.log(`Q0= `, res[`Q0`].filter(x => x.PNameE.includes(`Salem`)));
      console.log(`Q1= `, res[`Q1`]);
      // console.log(`Q2= `, res[`Q2`]);
      this.IsFirstRender = true;
      // this.tblHeaderNote = res[`Q2`];
      // alert(JSON.stringify(this.tblHeaderNote))

      this.getDataBeforRender();


      if (res[`Q0`].length > 0) {
        this.tblAppt = res[`Q0`].filter(x => x.Deleted == 0);
        // alert(this.tblAppt.filter(x=>x.IDBranch>1).length);
        this.tblDeletedAppt = res[`Q0`].filter(x => x.Deleted == 1);
      }

      // let tblAppt = res[`Q0`].filter(x => x.Deleted == 0);
      // let tblDelAppt = res[`Q0`].filter(x => x.Deleted == 1);
      // let tblNewAppt = this.apptService.getNewElements(tblAppt, this.tblAppt);
      // let tblNewDelAppt = this.apptService.getNewElements(tblDelAppt, this.tblDeletedAppt);
      // // إضافة الحداث الجديدة فقط
      // this.tblAppt = this.apptService.addUniqueElements(tblAppt, this.tblAppt);
      // this.tblDeletedAppt = this.apptService.addUniqueElements(tblDelAppt, this.tblDeletedAppt);

      // let tblUpdated = this.apptService.getUpdatedElements(tblAppt, this.tblAppt);
      // let tblDelUpdated = this.apptService.getUpdatedElements(tblDelAppt, this.tblDeletedAppt);
      // console.log(`tblUpdated= `, tblUpdated);
      // for (let a of tblUpdated) {
      //   let index = tblAppt.findIndex(item => item.ID === a.ID);
      //   if (index !== -1) {
      //     this.tblAppt[index] = a;
      //   }
      //   tblNewAppt.push(a);
      //   this.calendar.getEventById(a.ID).remove();
      // }
      // for (let a of tblDelUpdated) {
      //   let index = tblDelAppt.findIndex(item => item.ID === a.ID);
      //   if (index !== -1) {
      //     this.tblDeletedAppt[index] = a;
      //   }
      //   tblNewDelAppt.push(a);
      //   this.calendar.getEventById(a.ID).remove();
      // }


      // let tblSlotsInDates = this.filterSlots(res[`Q1`], this.StartDate, this.EndDate);
      // let tmptblSlots = tblSlotsInDates.filter(x => this.apptService.tblSelectedDoctor.includes(x.IDDoctor));
      // let tblRoomSlots = tblSlotsInDates.filter(x => this.apptService.tblSelectedRoom.includes(x.IDOperatingRoom));
      // for (let s of tblRoomSlots) {
      //   s.WaitingApp = 0;
      // }
      // // نقسم السلوتات إلى حقيقي وانتظار
      // let tblSlotsReal = this.all.deepCopy(tmptblSlots.filter(x => x.RealApp == 1));
      // for (let s of tblSlotsReal) {
      //   s.WaitingApp = 0;
      // }
      // let tblSlotsWait = this.all.deepCopy(tmptblSlots.filter(x => x.WaitingApp == 1));
      // for (let s of tblSlotsWait) {
      //   s.RealApp = 0;
      // }

      // // دمج السلوتات الحقيقي والانتظار في مصفوفة واحدة
      // let tblSlots = tblSlotsReal.concat(tblSlotsWait, tblRoomSlots);
      // // لإزالة الأوقات المتداخلة أو المكررة
      // tblSlots = this.apptService.removeOverlappingEntries(tblSlots);
      // let tblNewSlots = this.apptService.getNewElements(tblSlots, this.tblSlots);
      // // إضافة القيم الجديدة
      // this.tblSlots = this.apptService.addUniqueElements(tblSlots, this.tblSlots);

      let tblNewSlots = this.prepareSlots(res[`Q1`])
      this.addSlotsToSchedule(tblNewSlots);

      // console.log(`tblSlots2 = `, tblSlots);
      this.tblEvents = [];
      // this.closeEmpty();
      // setTimeout(() => {   
      //   this.reRender();
      // }, 150);

      // this.closeEmpty().then(res => {
      setTimeout(() => {
        this.calculateOccupancy(tblNewSlots.filter(x => x.ShiftNo != -1), this.tblAppt).then(res => {
          console.log(`calculateOccupancy= `, res);
          console.log(`this.tblDayColumn= `, this.tblDayColumn);
          // alert(this.tblDayColumn.length);
          for (let day of this.tblDayColumn) {
            //   IDDoctor: info.resource.extendedProps.IDP,
            //   IDRoom: 0,
            //   AType: 1,
            //   DayDate: DateProp,
            //   ElId: `w-${DateProp}-${info.resource.extendedProps.IDP}`,
            // });


            if (this.apptService.ViewDayCount == 1) {
              day.DayDate = this.all.CurrentDate;
            }

            if (day.IDDoctor > 0) {
              // alert( JSON.stringify(res[`doctorOccupancy`][2]) );
              if (res[`doctorOccupancy`] && res[`doctorOccupancy`][day.IDDoctor]
                && res[`doctorOccupancy`][day.IDDoctor][day.DayDate]
              ) {
                let RealAppPercentage = res[`doctorOccupancy`][day.IDDoctor][day.DayDate].RealAppPercentage;
                let WaitingAppPercentage = res[`doctorOccupancy`][day.IDDoctor][day.DayDate].WaitingAppPercentage;
                if (day.AType == 0) {
                  const progressBar: any = document.getElementById(day.ElId);
                  progressBar.value = RealAppPercentage;
                }
                if (day.AType == 1) {
                  const progressBar: any = document.getElementById(day.ElId);
                  progressBar.value = WaitingAppPercentage;
                }
              } else {
                const progressBar: any = document.getElementById(day.ElId);
                progressBar.value = 10;
              }
            }

            if (day.IDRoom > 0) {
              if (res[`roomOccupancy`] && res[`roomOccupancy`][day.IDRoom]
                && res[`roomOccupancy`][day.IDRoom][day.DayDate]
              ) {
                let RealAppPercentage = res[`roomOccupancy`][day.IDRoom][day.DayDate].RealAppPercentage;
                // alert(RealAppPercentage + `  -  ` +day.ElId );
                const progressBar: any = document.getElementById(day.ElId);
                console.log(`progressBar= `, progressBar);
                progressBar.value = RealAppPercentage;
              } else {
                const progressBar: any = document.getElementById(day.ElId);
                progressBar.value = 10;
              }
            }
          }
        });
      }, 1500);




      // this.getSchedulePercent(this.tblAppt, tblNewSlots);
      setTimeout(() => {
        this.addSlotsToSchedule(tblNewSlots);
        this.addApptToSchedule(this.tblAppt).then(res => {
          this.closeEmpty().then(res => {
            loading.dismiss();
          });
        });
        if (this.IsShowDeleted) {
          this.addApptToSchedule(this.tblDeletedAppt, true);
        }

        // this.addApptToSchedule(tblNewAppt).then(res => {
        //   loading.dismiss();
        // });
        // if (this.IsShowDeleted) {
        //   this.addApptToSchedule(tblNewDelAppt, true);
        // }
      }, 500);
      // });







    });
  }

  addApptToSchedule(tblAppt, IsDeleted = false, DirectAdd = false) {
    return new Promise(resolve => {
      try {
        for (let appt of tblAppt) {
          // console.log(appt);
          let resourceId = appt.IDDoctor + (appt.AType == 0 ? `-Real` : `-Wait`);

          let title = this.calendarEventService.drwaDoctorEventHtml(appt);
          // let IsOnCallIcon = appt.IsOnCall == 1 ? `<ion-icon name="call" color="warning"></ion-icon>` : ``;

          // let VisitTypeSymbols = [`F`, `N`, `R`, `P`, `C`, ``, ``, ``, ``];
          // let VisitTypeIcon = `<ion-badge color="warning" class="visit-type-icon">&nbsp;${VisitTypeSymbols[appt.VisitType]}&nbsp;</ion-badge>`;

          // let Balance = appt.Balance == 0 ? `` : `<div class="event-balance-${appt.Balance > 0 ? `green` : `red`}">${Math.abs(appt.Balance)}RS</div>`;

          // let MonyStatus = this.apptService.getMonyStatus(appt.MonyStatus);

          // let OperatingRoom = ``;
          // if (appt.IDOperatingRoom) {
          //   let RoomName = this.all.tblRooms.filter(x => x.IDP == appt.IDOperatingRoom)[0]['Name' + this.all.LangLetter];
          //   OperatingRoom = `<ion-badge style="width:100%;padding: 0px;" color="warning">${RoomName} </ion-badge>`;
          // }

          // let Required = ``;
          // if (appt.Required == 1) {
          //   Required = `<ion-icon src="./assets/icons/req.svg" color="danger"></ion-icon>`
          // } else if (appt.Required == 2) {
          //   Required = `<ion-icon src="./assets/icons/req.svg" color="success"></ion-icon>`
          // }

          // // Answer  ConfirmCount  ConfirmCount1  ConfirmDate  ConfirmStatus
          // let ConfirmStatus = ``;
          // if (appt.ConfirmStatus >= 1 && appt.ConfirmStatus <= 4) {
          //   ConfirmStatus = ` ${appt.ConfirmCount} <ion-icon src="./assets/icons/telephone-confirm.svg" color="danger"></ion-icon>`;
          // } else if (appt.ConfirmStatus >= 5 && appt.ConfirmStatus <= 8) {
          //   ConfirmStatus = ` ${appt.ConfirmCount} <ion-icon src="./assets/icons/telephone-confirm.svg" color="success"></ion-icon>`;
          // } else if (appt.ConfirmStatus >= 9 && appt.ConfirmStatus <= 11) {
          //   ConfirmStatus = ` ${appt.ConfirmCount} <ion-icon src="./assets/icons/telephone-confirm.svg" color="warning"></ion-icon>`;
          // }

          // let HeaderTime = ``;
          // if (appt.AOut > 0) {
          //   HeaderTime = `Out ${this.all.convertTo12HourFormatWithoutSecound(appt.AttendOut)}`
          // } else if (appt.Attend > 0) {
          //   HeaderTime = `<span id="timer-${appt.ID}" class="timer-item">0:00</span>`;
          // } else {
          //   HeaderTime = this.apptService.calculateAppointmentTimes(appt.ADate, appt.Duration);
          // }

          // let EventHeader = `
          //   <ion-row class="event-header">
          //     <ion-col size="auto">${VisitTypeIcon}</ion-col>
          //     <ion-col> &nbsp; ${HeaderTime}
          //     </ion-col>
          //     <ion-col size="auto">${ConfirmStatus}</ion-col>
          //   </ion-row>`;

          // let title = ` 
          //   <ion-row class="event-patient">
          //     <ion-col size="4">${appt.Ac_Num}</ion-col>
          //     <ion-col size="${appt.Required == 0 ? '8' : '6'}">${IsOnCallIcon} ${appt.PNameE.substring(0, 30)}  ${MonyStatus} </ion-col>
          //     ${appt.Required == 0 ? '' : `<ion-col size="2">${Required} </ion-col>`}              
          //   </ion-row>
          // ${Balance}
          // ${OperatingRoom}`;

          // title += `<div class="event-desc">${appt.Description.substring(0, 40)}</div>`;

          // if (appt.IDProcedure > 0) { // ServiceName
          //   let Service = appt.ServiceCode + ` ` + appt.ServiceName;
          //   title += `<div class="event-service">${Service}</div>`;
          // }

          // let EventFooter = this.apptService.getEventFooter(appt);


          // // title = `<div class="tooltip-container" >
          // // ${appt.Description != '' ? `<span class="tooltiptext">${appt.Description}</span>` : ''} 
          // // ${title}${EventFooter}</div>`;
          // let TooltipContainer = `<span class="tooltiptext">${EventHeader} <div class="event-body"> ${title} </div></span>`;

          // title = `${TooltipContainer}${EventHeader} <div class="event-body"> ${title}${EventFooter} </div>`;

          let start = appt.ADate;
          if (IsDeleted) {
            start = this.apptService.changeTime(appt.ADate, this.all.RegisterData.AdditionalHoursForDay + `:00`);
            // alert(start);
          }

          let EventEnd = this.apptService.calculateEndTime(start, appt.Duration)


          // if(appt.PNameE.includes(`salem`)){
          //   alert(JSON.stringify(appt))
          // }

          // let className = `tooltip-container event-container appt-${appt.ID}`;


          let className = `event-container appt-${appt.ID}`;
          if (IsDeleted) {
            className += ` event-deleted-class`;
          } else {
            switch (appt.AType) {
              case 1:
                className += ` event-wait-class`;
                break;
              case 3:
                // alert(`walkin`);
                className += ` event-walkin-class`;
                break;
              default:
                className += ` event-real-class`;
                break;
            }
          }

          if (appt.ConfirmStatus >= 5 && appt.ConfirmStatus <= 8) {
            className += ` event-confirmed`;
          }

          if (DirectAdd) {
            this.calendar.addEvent({
              id: appt.ID,
              resourceId: resourceId, // مرتبط بـ Room B
              title: title,
              start: start, // appt.ADate,
              end: EventEnd,
              className: className,
              // className: IsDeleted ? 'event-deleted-class event-container' : (appt.AType == 0 ? `event-real-class event-container appt-${appt.ID}` : `event-wait-class event-container appt-${appt.ID}`),
              editable: IsDeleted ? false : true, // يمكن نقله لأي مكان
              durationEditable: IsDeleted ? false : true,
              display: 'list-item',
              extendedProps: appt
            },);
          } else {
            this.tblEvents.push({
              id: appt.ID,
              resourceId: resourceId, // مرتبط بـ Room B
              title: title,
              start: start, // appt.ADate,
              end: EventEnd,
              className: className,
              // className: IsDeleted ? 'event-deleted-class event-container' : (appt.AType == 0 ? `event-real-class event-container appt-${appt.ID}` : `event-wait-class event-container appt-${appt.ID}`),
              editable: IsDeleted ? false : true, // يمكن نقله لأي مكان
              durationEditable: IsDeleted ? false : true,
              display: 'list-item',
              extendedProps: appt
            });
          }



          // console.log(title);

          if (appt.IDOperatingRoom) {

            let Doctor = this.all.tblDoctors.find(x => x.IDP == appt.IDDoctor);
            let RoomAppt = `<div class="patient-name">${appt.PNameE.substring(0, 30)}</div>
              <div class="event-header">
              ${this.apptService.calculateAppointmentTimes(appt.ADate, appt.Duration)}
              </div>
              <div class="event-room-body">
                <ion-row>
                  <ion-col size="4">FileNo:</ion-col>
                  <ion-col size="8">
                    ${appt.Ac_Num}
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">PaName:</ion-col>
                  <ion-col size="8">
                  ${appt.PNameE.substring(0, 30)}
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">Doctor:</ion-col>
                  <ion-col size="8">
                    ${Doctor[`Name` + this.all.LangLetter]}
                  </ion-col>
                </ion-row>
              </div>
          `;
            if (DirectAdd) {
              this.calendar.addEvent({
                id: appt.ID,
                resourceId: appt.IDOperatingRoom + `-Room`, // مرتبط بـ Room B
                title: RoomAppt,
                start: start,
                end: EventEnd,
                className: `event-room-class event-container appt-${appt.ID}`,
                editable: true, // يمكن نقله لأي مكان
                durationEditable: true,
                display: 'list-item',
                extendedProps: appt
              });
            } else {
              this.tblEvents.push({
                id: appt.ID,
                resourceId: appt.IDOperatingRoom + `-Room`, // مرتبط بـ Room B
                title: RoomAppt,
                start: start,
                end: EventEnd,
                className: `event-room-class event-container appt-${appt.ID}`,
                editable: true, // يمكن نقله لأي مكان
                durationEditable: true,
                display: 'list-item',
                extendedProps: appt
              });
            }
            // this.calendar.addEvent({
            //   id: appt.ID,
            //   resourceId: appt.IDOperatingRoom + `-Room`, // مرتبط بـ Room B
            //   title: RoomAppt,
            //   start: appt.ADate,
            //   end: EventEnd,
            //   className: `event-room-class event-container appt-${appt.ID}`,
            //   editable: true, // يمكن نقله لأي مكان
            //   durationEditable: true,
            //   display: 'list-item',
            //   extendedProps: appt
            // },);
          }
        }
        // this.loadingController.dismiss();
        // clearInterval(this.AttendTimer);
        // // alert(this.tblAppt.filter(x => x.AOut == 0 && x.Attend >0).length);

        // setTimeout(() => {
        //   // this.apptService.updateAllTimers(this.tblAppt.filter(x => x.AOut == 0 && x.Attend > 0));
        //   // setInterval(updateAllTimers, 1000);
        //   this.AttendTimer = setInterval(() => {
        //     this.apptService.updateAllTimers(this.tblAppt.filter(x => x.AOut == 0 && x.Attend > 0));
        //   }, 1000);
        // }, 3000);



        setTimeout(() => {
          this.expand(false);
        }, 500);
        resolve(true);
      } catch (error) {
        console.log(`errrrrrrr`);
        resolve(false);
      } finally {
        resolve(false);
        console.log("finally....");
      }

    });
  }


  // calculateFontSize(text, maxLength = 20, maxFontSize = 20, minFontSize = 11) {
  //   const textLength = text.length;
  //   if (textLength <= maxLength) {
  //     return maxFontSize;
  //   }
  //   // معادلة أكثر دقة
  //   const fontSize = maxFontSize - ((textLength - maxLength) * 0.5);
  //   return Math.max(fontSize, minFontSize);
  // }

  AttendTimer: any;
  addSlotsToSchedule(tblSlots) {
    let x1 = 0;
    // alert(this.StartDate);
    for (let r of this.apptService.tblSelectedDoctor) {
      this.tblEvents.push({
        id: `x${x1++}`,
        title: '',
        start: this.StartDate,
        end: this.all.toLocalISOString(new Date()),
        resourceId: r + `-Real`, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
        display: 'background', // لجعلها خلفية
        // color: color, // لون الخلفية
        classNames: ['past-days'],
        editable: false, // يمكن نقله لأي مكان
        durationEditable: false,
      });

      this.tblEvents.push({
        id: `x${x1++}`,
        title: '',
        start: this.StartDate,
        end: this.all.toLocalISOString(new Date()),
        resourceId: r + `-Wait`, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
        display: 'background', // لجعلها خلفية
        // color: color, // لون الخلفية
        classNames: ['past-days'],
        editable: false, // يمكن نقله لأي مكان
        durationEditable: false,
      });
    }

    for (let r of this.apptService.tblSelectedRoom) {
      this.tblEvents.push({
        id: `x${x1++}`,
        title: '',
        start: this.StartDate,
        end: this.all.toLocalISOString(new Date()),
        resourceId: r + `-Room`, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
        display: 'background', // لجعلها خلفية
        // color: color, // لون الخلفية
        classNames: ['past-days'],
        editable: false, // يمكن نقله لأي مكان
        durationEditable: false,
      });
    }




    for (let slot of tblSlots) {
      console.log(`slot= `, slot);
      let color = ``;

      if (slot.State == 0) {
        color = this.all.BlockColor;
      } else if (slot.ShiftNo == -2) {
        color = this.all.ExtraShiftColor;
      } else {
        color = this.all[`Shift${slot.ShiftNo}Color`];
      }



      // if (slot.State == 1 && slot.ShiftNo == 1) {
      //   color = this.all.Shift1Color;
      // } else if (slot.State == 1 && slot.ShiftNo != 1) {
      //   color = this.all.Shift2Color;
      // } else if (slot.State == 0) {
      //   color = this.all.BlockColor;
      // }

      if (slot.RealApp == 1) {
        let resourceId = slot.IDDoctor + `-Real`;
        if (slot.IDDoctor == 0) {
          resourceId = slot.IDOperatingRoom + `-Room`;
        }
        this.tblEvents.push({
          id: slot.IDP,
          title: '',
          start: slot.StartDate + ` ` + slot.OpenTime,
          end: slot.ClosedTime,
          resourceId: resourceId, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
          display: 'background', // لجعلها خلفية
          color: color, // لون الخلفية
          editable: false, // يمكن نقله لأي مكان
          durationEditable: false,
        });
      }

      if (slot.WaitingApp == 1) {
        this.tblEvents.push({
          id: slot.IDP,
          title: '',
          start: slot.StartDate + ` ` + slot.OpenTime,
          end: slot.ClosedTime,
          resourceId: slot.IDDoctor + `-Wait`, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
          display: 'background', // لجعلها خلفية
          color: color, // لون الخلفية
          editable: false, // يمكن نقله لأي مكان
          durationEditable: false,
        });
      }
    }
  }

  // addSlotsToScheduleX(tblSlots) {
  //   let x1 = 0;
  //   // alert(this.StartDate);
  //   for (let r of this.apptService.tblSelectedDoctor) {
  //     this.calendar.addEvent({
  //       id: `x${x1++}`,
  //       title: '',
  //       start: this.StartDate,
  //       end: this.all.toLocalISOString(new Date()),
  //       resourceId: r + `-Real`, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
  //       display: 'background', // لجعلها خلفية
  //       // color: color, // لون الخلفية
  //       classNames: ['past-days'],
  //       editable: false, // يمكن نقله لأي مكان
  //       durationEditable: false,
  //     });

  //     this.calendar.addEvent({
  //       id: `x${x1++}`,
  //       title: '',
  //       start: this.StartDate,
  //       end: this.all.toLocalISOString(new Date()),
  //       resourceId: r + `-Wait`, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
  //       display: 'background', // لجعلها خلفية
  //       // color: color, // لون الخلفية
  //       classNames: ['past-days'],
  //       editable: false, // يمكن نقله لأي مكان
  //       durationEditable: false,
  //     });
  //   }

  //   for (let r of this.apptService.tblSelectedRoom) {
  //     this.calendar.addEvent({
  //       id: `x${x1++}`,
  //       title: '',
  //       start: this.StartDate,
  //       end: this.all.toLocalISOString(new Date()),
  //       resourceId: r + `-Room`, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
  //       display: 'background', // لجعلها خلفية
  //       // color: color, // لون الخلفية
  //       classNames: ['past-days'],
  //       editable: false, // يمكن نقله لأي مكان
  //       durationEditable: false,
  //     });
  //   }




  //   for (let slot of tblSlots) {
  //     let color = ``;
  //     if (slot.State == 1 && slot.ShiftNo == 1) {
  //       color = this.Shift1Color;
  //     } else if (slot.State == 1 && slot.ShiftNo != 1) {
  //       color = this.Shift2Color;
  //     } else if (slot.State == 0) {
  //       color = this.BlockColor;
  //     }

  //     if (slot.RealApp == 1) {
  //       let resourceId = slot.IDDoctor + `-Real`;
  //       if (slot.IDDoctor == 0) {
  //         resourceId = slot.IDOperatingRoom + `-Room`;
  //       }
  //       this.calendar.addEvent({
  //         id: slot.IDP,
  //         title: '',
  //         start: slot.StartDate + ` ` + slot.OpenTime,
  //         end: slot.ClosedTime,
  //         resourceId: resourceId, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
  //         display: 'background', // لجعلها خلفية
  //         color: color, // لون الخلفية
  //         editable: false, // يمكن نقله لأي مكان
  //         durationEditable: false,
  //       });
  //     }

  //     if (slot.WaitingApp == 1) {
  //       this.calendar.addEvent({
  //         id: slot.IDP,
  //         title: '',
  //         start: slot.StartDate + ` ` + slot.OpenTime,
  //         end: slot.ClosedTime,
  //         resourceId: slot.IDDoctor + `-Wait`, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
  //         display: 'background', // لجعلها خلفية
  //         color: color, // لون الخلفية
  //         editable: false, // يمكن نقله لأي مكان
  //         durationEditable: false,
  //       });
  //     }
  //   }
  // }

  getPatientAppt(appt) {
    if (this.all.SubScheduleWindows.No == 1) {
      this.ScrollFocusToAppt = this.all.deepCopy(appt);
      // alert(JSON.stringify(this.ScrollFocusToAppt))
      // setTimeout(() => {
      //   alert(JSON.stringify(this.ScrollFocusToAppt))
      // }, 2000);
      // alert(JSON.stringify(patient));
      console.log(`appt= `, appt);
      let ADate = this.ScrollFocusToAppt.ADate;
      let ScrollToTime = ADate.split(` `)[1];
      let tblDoctor = [this.ScrollFocusToAppt.IDDoctor];

      // console.log(this.apptService.tblSelectedDoctor, tblDoctor);
      if (this.all.CurrentDate.trim() == ADate.split(` `)[0].trim() && JSON.stringify(this.apptService.tblSelectedDoctor) == JSON.stringify(tblDoctor)) {


        let event = this.tblEvents.find(x => x.extendedProps?.IDP == this.ScrollFocusToAppt.IDP);
        console.log(`event = `, event);
        this.ScrollFocusToAppt = null;
        let tblClass = event.className.split(" ");
        tblClass.push('event-selected-class');
        this.calendar.getEventById(event.id).setProp('classNames', tblClass);
        this.scrollToTime(ScrollToTime);


      } else if (this.all.CurrentDate != ADate.split(` `)[0]) {
        this.apptService.tblSelectedDoctor = tblDoctor;
        this.all.CurrentDate = ADate.split(` `)[0];
        // this.ScrollToAppt.ADate, +this.ScrollToAppt.Duration
      } else {
        this.apptService.tblSelectedDoctor = tblDoctor;
        this.reRender();
        this.getSechudleData();
      }
    } else if (this.all.SubScheduleWindows.No == 4) {
      console.log(appt);
      console.log(this.all.tblDoctors.find(x => x.IDDoctor == appt.IDDoctor));

      let ADate = appt.DateFrom;
      let ScrollToTime = ADate.split(` `)[1];
      let tblDoctor = [appt.IDDoctor];
      let IDPatient = appt.IDPatient;


      if (IDPatient != this.all.Patient.IDP) {
        let Query = `SELECT * FROM Patients WHERE IDC = ${this.all.User.IDC} and IDP=${IDPatient}`
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
            this.nextAvailable(0, 0, appt.IDDoctor, appt.Duration);
          }
        });
      } else {
        this.nextAvailable(0, 0, appt.IDDoctor, appt.Duration);
      }






      //   {
      //     "FileNo": 26321,
      //     "NameE": "Sara Sleman Abd Alrahman mrzoog",
      //     "NameA": "ساره سليمان عبد الرحمن مرزوج",
      //     "Phon1": "0587705822",
      //     "OrderDate": "2025-03-03 11:50:00",
      //     "ID": 16246,
      //     "IDC": 1,
      //     "IDY": 11,
      //     "IDP": 16246,
      //     "IDBranch": 6,
      //     "IDAppointment": 101188475,
      //     "IDDoctor": 95,
      //     "Doctor": "0132",
      //     "IDOperatingRoom": 0,
      //     "IDPatient": 100195014,
      //     "IDUser": 502,
      //     "RequiredUser": "",
      //     "DateFrom": "2025-03-11 00:00:00",
      //     "WithinDays": 14,
      //     "AType": 0,
      //     "IDService": 769,
      //     "Duration": 30,
      //     "Description": "in splendor-x(medica2)",
      //     "IDAppt": 101181724,
      //     "IDTranDoctor": 95,
      //     "join_url": "",
      //     "DoneDate": "2025-03-03",
      //     "DoneIDUser": 272,
      //     "DoneUser": "kdeluna"
      // }
    }

    // IDP :  101199374
    // IDPatient :  100357137  

    // ID:1530463


    // alert(ScrollToTime);
    // setTimeout(() => {
    //   this.calendar.scrollToTime(this.addMinutesAndGetTimeWithoutSecound(ADate, +appt.Duration + 60));

    // }, 5000);
  }

  getPatient(IDPatient) {
    let Query = `SELECT * FROM Patients WHERE IDC = ${this.all.User.IDC} AND IDP=${IDPatient}`;

    console.log(`Query= `, Query);
    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }
      this.all.Patient = res[`Q0`][0];
    });
  }

  ScrollFocusToAppt: any = null;

  getResult(event: any) {
    console.log(`event= `, event);
  }

  NextDaysCount = 3;


  // nextDays(days) {
  //   console.log(`days = `, days);
  //   // تحويل النص المدخل إلى كائن تاريخ
  //   const date = new Date(this.all.CurrentDate);

  //   // إضافة عدد الأيام إلى التاريخ
  //   // date.setDate(date.getDate() + days);

  //   let newDate = new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
  //   console.log(date);

  //   this.all.CurrentDate = this.all.toLocalISOString(newDate);
  //   this.calendar.gotoDate(this.all.CurrentDate);


  //   this.StartDate = this.getQueryDate(this.all.CurrentDate);
  //   let newEndDate = new Date(date.getTime() + ((+days + +this.apptService.ViewDayCount) * 24 * 60 * 60 * 1000));
  //   this.EndDate = this.getQueryDate(this.all.toLocalISOString(newEndDate));
  //   // alert(this.EndDate);
  //   this.getSechudleData();
  //   // return date;
  // }
  MouseHover = false;
  ShowEventBallonHint = false;
  getNextMonthDate() {
    // تحويل النص المدخل إلى كائن تاريخ
    const date = new Date(this.all.CurrentDate);

    // استخراج السنة والشهر واليوم
    const year = date.getFullYear();
    const month = date.getMonth(); // الأشهر تبدأ من 0
    const day = date.getDate();

    // تحديد الشهر القادم
    const nextMonth = month + 1;

    // إنشاء تاريخ في الشهر القادم بنفس اليوم
    const nextMonthDate = new Date(year, nextMonth, day);

    // إذا كان اليوم غير موجود في الشهر القادم، فإن الكائن التاريخ يعيد اليوم التالي بعد آخر يوم بالشهر
    // لذلك نحتاج لتصحيح التاريخ
    if (nextMonthDate.getMonth() !== nextMonth % 12) {
      // ضبط اليوم ليكون آخر يوم بالشهر
      // return new Date(year, nextMonth + 1, 0); // اليوم 0 يعطي آخر يوم بالشهر

      this.all.CurrentDate = this.all.toLocalISOString(new Date(year, nextMonth + 1, 0));
    }
    this.all.CurrentDate = this.all.toLocalISOString(nextMonthDate);
    // this.calendar.gotoDate(this.all.CurrentDate);
    // return nextMonthDate;
  }

  clickCount = 0;

  SelectedSlot: any;
  reRender(dayMinWidth = 155, IsAfterCloseEmpty = false) {




    // let blockEvents: any[] = this.tblBlockErea.map((block) => ({
    //   id: block.id,
    //   title: 'Block area',
    //   start: block.start,
    //   end: block.end,
    //   resourceId: '12-Real', // تخصيص المورد الذي سيتم تلوين المنطقة فيه
    //   display: 'background', // لجعلها خلفية
    //   color: '#ff0000', // لون الخلفية
    //   editable: false, // يمكن نقله لأي مكان
    //   durationEditable: false,
    // }));


    let SortNo = 0;
    let resources = [];
    let Wait = this.all.translate.instant(`Wait`);
    for (let r of this.apptService.tblSelectedDoctor) {
      let dr = this.all.tblDoctors.find(x => x.IDDoctor == r);
      console.log(`dr= `, dr);
      resources.push({
        id: dr.IDDoctor + '-Real', title: dr[`Name` + this.all.LangLetter].substring(0, 10), type: 'Real', IDP: dr.IDDoctor,
        DoctorData: dr,
        SortNo: SortNo++,
      });
      resources.push({
        id: dr.IDDoctor + '-Wait', title: Wait, type: 'Waiting', IDP: dr.IDDoctor,
        DoctorData: dr,
        SortNo: SortNo++,
      });
    }

    // setTimeout(() => {
    // },250);

    for (let r of this.apptService.tblSelectedRoom) {
      let room = this.all.tblRooms.find(x => x.IDP == r);
      resources.push({
        id: room.IDP + '-Room', title: room.NameE.substring(0, 10), type: 'Room', IDP: room.IDP,
        Data: room,
        SortNo: SortNo++,
      });
    }
    console.log(`resources= `, resources);
    // alert(JSON.stringify(resources));
    // this.events = this.events.concat(blockEvents);


    var calendarEl = document.getElementById('calendar');
    this.contextMenu = document.getElementById('contextMenu');


    // const slotsCount = this.calculateSlots(slotMinTime, slotMaxTime, slotDuration);
    // let SlotHeight = 50 + 1;// موجود في صفحة global.scss
    // alert(this.slotMinTime);
    this.calendar = new FullCalendar.Calendar(calendarEl, {
      // height: SlotHeight * slotsCount + 70,// 5432, // calendar.setOption('height', 700);  You can dynamically set a calendar’s height after initialization:
      height: window.innerHeight - 5,
      // aspectRatio: 2,
      // height: '100%',
      // contentHeight: window.innerHeight - 5,
      // resources: [
      //   { id: `12-Real`, title: 'Dr.Name', type: 'Real', IDP: 1 },
      //   { id: `12-Wait`, title: 'Wait', type: `Waiting`, IDP: 1 },
      //   // { id: `3`, title: 'Dr.NAme2', type: 'Real', IDDoctor: 2  },
      //   // { id: `4`, title: 'Wait', type:`Waiting`, IDDoctor: 2 },
      //   { id: `3-Room`, title: 'Room1', type: `Room`, IDP: 3 },
      // ],
      dayMinWidth: dayMinWidth,
      resources: resources,
      resourceOrder: "SortNo",

      direction: this.all.LangLetter == `A` ? `rtl` : `ltr`,

      initialView: 'resourceTimeGridFourDay',
      views: {
        resourceTimeGridFourDay: {
          type: 'resourceTimeGrid',
          duration: { days: this.apptService.ViewDayCount },
          buttonText: `${this.apptService.ViewDayCount} days`
        }
      },

      eventMouseLeave: (info) => {
        this.MouseHover = false;
        setTimeout(() => {
          console.log(`Leave= `, info);
          if (this.MouseHover == false && this.IsShowBalloonHint) {
            const tooltipContainer = document.getElementById('tooltip-container');
            tooltipContainer.style.display = 'none';
          }
        }, 500);
      },
      eventMouseEnter: (info) => {
        if (info.event.extendedProps?.ID && this.IsShowBalloonHint && this.platform.is('desktop')) {
          // if (this.MouseHover) return;
          this.MouseHover = true;
          console.log(`MouseEnter= `, info);
          const tooltipContainer = document.getElementById('tooltip-container');
          tooltipContainer.innerHTML = info.event.title;
          tooltipContainer.style.display = 'block';
          tooltipContainer.style.top = info.jsEvent.y + 'px';
          tooltipContainer.style.left = info.jsEvent.x + 'px';
        }

      },

      eventClick: (info) => {
        // alert('Event: ' + info.event.title);
        // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        // alert('View: ' + info.view.type);
        // // change the border color just for fun
        // info.el.style.borderColor = 'red';


        // console.log(this.clickCount);
        // // زيادة العد عند كل نقر
        // this.clickCount++;
        // setTimeout(() => {
        //   if (this.clickCount === 2) {
        //     // إذا كان هناك نقرتان متتاليتان
        //     this.SelectedSlot = info;
        //     this.newApp();
        //     // alert('Double clicked on: ' + info.event.title);
        //   }
        //   // إعادة العد بعد فترة قصيرة
        //   this.clickCount = 0;
        // }, 300); // الحد الزمني بين النقرات

        console.log(info.jsEvent);
        // let eventId = info.event.id;
        // let jsEvent = info.jsEvent;
        this.ShowEventBallonHint = false;
        if (this.platform.is('desktop')) {
          console.log('هذا جهاز كمبيوتر (PC)');
        } else {
          console.log('نوع الجهاز غير معروف');
          let eventID = 0;
          if (info.event.id && info.event.extendedProps?.ID) {
            eventID = info.event.extendedProps.ID;
            var event = this.calendar.getEventById(info.event.id);
            console.log(`event= `, event.start);
            this.SelectedSlot = event;

            if (this.IsShowBalloonHint) {
              this.ShowEventBallonHint = true;
              setTimeout(() => {
                const tooltipContainer = document.getElementById('tooltip-container-mobile');
                tooltipContainer.innerHTML = info.event.title;
              }, 150);


            }

          } else {
            this.ShowEventBallonHint = false;
            // const tooltipContainer = document.getElementById('tooltip-container-mobile');
            // tooltipContainer.innerHTML = '';
          }
          this.showContextMenu(info.jsEvent, eventID);


        }

      },
      // plugins: [ FullCalendarInteraction ],
      dateClick: function (info: any) {
        // alert('Clicked on: ' + info.dateStr);
        // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        // alert('Current view: ' + info.view.type);
        // alert('resource : ' + JSON.stringify(info.resource));
        // change the day's background color just for fun
        // info.dayEl.style.backgroundColor = 'red';
      },
      select: (info: any) => { // https://fullcalendar.io/docs/select-callback
        console.log('info= ', info);
        // console.log('info.resourceIds= ', info.resource.id);
        console.log('selected ' + info.startStr + ' to ' + info.endStr);
        this.SelectedSlot = info;
      },


      eventResize: (info: any) => {
        console.log(info.event);
        let extendedProps = info.event.extendedProps;
        if (new Date(extendedProps.ADate) < new Date()) {
          info.revert();
          return;
        }

        let Duration = this.apptService.getDurationInMinutes(new Date(info.event.start), new Date(info.event.end));
        this.all.confirm(this.all.translate.instant(`Are you sure you want to do the operation?`)).then(yes => {
          if (yes) {
            this.updateAppt(info.event.extendedProps, Duration).then(updated => {
              if (!updated) {
                info.revert();
              } else {
                if (extendedProps.IDDoctor > 0 && extendedProps.IDOperatingRoom > 0) {
                  // info.event.remove();
                  // this.getSechudleData();
                  this.refreshSchedule();
                }
                // else {
                //   let className = AType == 0 ? 'event-real-class' : 'event-wait-class';
                //   this.calendar.getEventById(info.event.id).setProp('classNames', [className]);
                // }

              }
            });
          } else {
            info.revert();
          }
        });

        // alert(info.event.title + " end is now " + info.event.end.toISOString());
        // if (!confirm("is this okay?")) {
        //   info.revert();
        // }
      },
      eventDrop: (info: any) => {

        console.log(info.event);
        let extendedProps = info.event.extendedProps;
        if (new Date(extendedProps.ADate) < new Date()) {
          info.revert();
          return;
        }



        // console.log(info.event._def.resourceIds[0]);
        let Resource = info.event._def.resourceIds[0];
        // let AType = info.event.extendedProps.AType;
        let AType = 0;
        let IDDoctor = info.event.extendedProps.IDDoctor;
        let IDRoom = info.event.extendedProps.IDOperatingRoom;
        // alert(IDRoom+' - '+ IDDoctor);
        // return
        if (Resource.includes(`Room`)) {
          // alert(IDRoom +' - '+ Resource.split(`-`)[0]);
          IDRoom = Resource.split(`-`)[0];
        } else {
          IDDoctor = Resource.split(`-`)[0];
          if (Resource.split(`-`)[1] == "Wait") {
            AType = 1;
          }
        }
        if (info.event.extendedProps.AType == 3 && AType == 1) { // في حال كان الموعد حاضر يجب ان يبقى من نوع 3
          AType = 3;
        }
        // alert(Resource.split(`-`)[1]);


        // alert(IDDoctor);

        let ADate = info.event.start;
        this.all.confirm(this.all.translate.instant(`Are you sure you want to do the operation?`)).then(yes => {
          if (yes) {
            // alert(AType)
            // return;
            this.updateAppt(info.event.extendedProps, 0, ADate, AType, IDDoctor, IDRoom).then(updated => {
              // alert(updated);
              if (!updated) {
                info.revert();
              } else {
                // alert(IDDoctor +'    -    '+IDRoom);
                if (IDDoctor > 0 && IDRoom > 0) {
                  // info.event.remove();
                  // this.getSechudleData();
                  this.refreshSchedule();

                } else {

                  let className = `event-container appt-${info.event.extendedProps.ID}`;
                  switch (AType) {
                    case 1:
                      className += ` event-wait-class`;
                      break;
                    case 3:
                      className += ` event-walkin-class`;
                      break;
                    default:
                      className += ` event-real-class`;
                      break;
                  }


                  // let className = AType == 0 ? 'event-real-class' : 'event-wait-class';

                  // this.calendar.getEventById(info.event.id).setProp('classNames', [className]);
                  this.refreshSchedule();
                }

              }
            });
          } else {
            info.revert();
          }
        });

        // alert(info.event.title + " was dropped on " + info.event.start.toISOString());

        // if (!confirm("Are you sure about this change?")) {
        //   info.revert();
        // }
      },

      // validRange: { // يحدد الحدود التي يمكن للمستخدم الانتقال إليها والأماكن التي يمكن للأحداث الذهاب إليها.
      //   start: '2024-12-03',
      //   // end: '2017-06-01'
      // },
      allDaySlot: false,
      timeGridWeek: {
        allDaySlot: false // تعطيل "all-day" فقط في عرض الأسبوع
      },
      timeGridDay: {
        allDaySlot: false // تعطيل "all-day" فقط في عرض اليوم
      },

      expandRows: true,
      slotDuration: this.slotDuration,
      slotMinTime: this.slotMinTime,  // يبدأ من الساعة 8 صباحًا
      slotMaxTime: this.slotMaxTime,  // ينتهي عند الساعة 3 صباحًا من اليوم التالي

      editable: true, // يحدد ما إذا كان من الممكن تعديل الأحداث الموجودة في التقويم.
      eventResizableFromStart: true, // ما إذا كان بإمكان المستخدم تغيير حجم حدث من حافته الأولية.

      dragScroll: true, // ما إذا كان سيتم مسح حاويات التمرير تلقائيًا أثناء سحب الحدث وإفلاته وتحديد التاريخ.

      // defaultAllDay: false,
      timeZone: 'UTC',

      datesAboveResources: true,
      selectable: true,
      selectMirror: true, // ما إذا كان سيتم رسم حدث "عنصر نائب" أثناء قيام المستخدم بالسحب.
      unselectAuto: false, // ما إذا كان النقر في أي مكان آخر على الصفحة سيؤدي إلى مسح التحديد الحالي.

      // nowIndicator: true, now: this.all.toLocalISOString(new Date()), // '2024-12-04T13:23:00', // رسم خط التوقيت الان
      nowIndicator: true, now: this.all.CurrentDate, // '2024-12-04T13:23:00', // رسم خط التوقيت الان

      // initialView: 'resourceTimeGridFourDay',
      // views: {
      //   resourceTimeGridFourDay: {
      //     type: 'resourceTimeGrid',
      //     duration: { days: this.ViewDayCount },
      //     buttonText: `4 days`,
      //   }
      // },



      // resources: [
      //   { id: 'Real', title: 'Dr.Name' },
      //   { id: 'Waiting', title: 'Wait' },
      // ],


      slotEventOverlap: true,
      // eventColor: '#378006',
      eventClassNames: ['event-class1'],
      events: this.tblEvents,


      navLinks: true,
      titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
      dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric', omitCommas: true },
      headerToolbar: {
        left: 'prev,next,today, custom1,custom2',
        center: 'title',
        right: 'resourceTimeGridDay,resourceTimeGridFourDay' // dayGridMonth
      },
      // headerToolbar: false,
      // hiddenDays: [ 2, 4 ], // hide Tuesdays and Thursdays
      // hiddenDays: [ 1, 3, 5 ], // hide Mondays, Wednesdays, and Fridays
      // footerToolbar: {
      //   start: 'custom1,custom2',
      //   center: '',
      //   end: 'prev,next'
      // },
      customButtons: {
        custom1: {
          text: 'custom 1',
          click: () => {

            this.IsYScroll = !this.IsYScroll;
            this.getDataBeforRender().then(yes => {
              if (this.IsYScroll) {
                const dayNames = document.querySelectorAll('.header-day-name');
                dayNames.forEach((day: any) => {
                  day.style.display = ''; // إعادة الإظهار
                });
                this.reRender(155);
              } else {
                const dayNames = document.querySelectorAll('.header-day-name');
                dayNames.forEach((day: any) => {
                  day.style.display = 'none'; // الإخفاء
                });
                this.reRender(75);
              }
            });

            // alert('clicked custom button 1!');
          }
        },
        custom2: {
          text: 'custom 2',
          click: function () {
            alert('clicked custom button 2!');
          }
        }
      },

      // businessHours: {
      //   // days of week. an array of zero-based day of week integers (0=Sunday)
      //   daysOfWeek: [1, 2, 3, 4], // Monday - Thursday

      //   startTime: '10:00', // a start time (10am in this example)
      //   endTime: '18:00', // an end time (6pm in this example)
      // },

      eventContent: function (info: any) { // لكي ننستطيع كتابة كود html
        return { html: info.event.title };
      },
      eventDidMount: (arg: any) => {
        // console.log(arg);

        if (arg.event.extendedProps.AOut == 0 && arg.event.extendedProps.Attend > 0) {
          let LateTime = null;
          let WattingTime = null;
          let AttSymbl = `S`;
          let FromTime = `AttendTime`;
          if (arg.event.extendedProps.AOut == 0 && arg.event.extendedProps.Attend > 0 && arg.event.extendedProps.Enter > 0) {
            FromTime = `AttendEnter`;
            AttSymbl = `E`;
          } else {
            LateTime = this.apptService.calculateTimeDifference(arg.event.extendedProps.ADate, arg.event.extendedProps.AttendTime);
          }
          let timerSpan = document.createElement("span");
          timerSpan.className = "timer-item";
          arg.el.appendChild(timerSpan);
          setInterval(() => {
            if (AttSymbl == `S`) {
              // LateTime = this.apptService.calculateTimeDifference(arg.event.extendedProps.ADate, arg.event.extendedProps.AttendTime);
              WattingTime = this.apptService.calculateTimeDifference(new Date, arg.event.extendedProps.AttendTime);
            }
            let ElapsedTime = this.calendarEventService.calculateElapsedTime(arg.event.extendedProps, FromTime);
            // timerSpan.textContent = `${AttSymbl} ${ElapsedTime.hours > 0 ? ElapsedTime.hours + ':' : ''}${ElapsedTime.minutes}:${ElapsedTime.seconds.toString().padStart(2, '0')}
            // ${LateTime == null ? '' : LateTime.isLate ? 'L ' : 'D ' + LateTime.hours + ':' + LateTime.minutes + ':' + LateTime.seconds}`;

            // console.log(`qqqqqqqqqq`, LateTime.diffMs<-7);
            let AttentionColor = ``;
            if (AttSymbl == `S` && LateTime != null) {
              if (LateTime.diffMs < -7) { // حضر متأخر
                AttentionColor = `<ion-icon color="warning" name="radio-button-on" class="attention-yello"></ion-icon>`;

              } else if (LateTime.diffMs > 7) { // حضر مبكرا
                AttentionColor = `<ion-icon color="warning" name="radio-button-on" class="attention-green"></ion-icon>`;
                if (WattingTime.diffMs > 7) { // حضر مبكرا وتأخرنا في ادخاله
                  AttentionColor = `<ion-icon color="danger" name="radio-button-on" class="attention-red"></ion-icon>`;
                }
              } else {
                AttentionColor = `<ion-icon color="warning" name="radio-button-on" class="attention-yello"></ion-icon>`;
                if (WattingTime.diffMs > 7) { // حضر بوقته وتأخرنا في ادخاله
                  AttentionColor = `<ion-icon color="danger" name="radio-button-on" class="attention-red"></ion-icon>`;
                }
              }
            }

            timerSpan.innerHTML = `${AttSymbl} ${ElapsedTime.hours > 0 ? ElapsedTime.hours + ':' : ''}${ElapsedTime.minutes}:${ElapsedTime.seconds.toString().padStart(2, '0')}
            ${LateTime == null ? '' : LateTime.isLate ? 'L ' : 'D ' + WattingTime.hours + ':' + WattingTime.minutes + ':' + WattingTime.seconds + ' '
                + AttentionColor
              }
            `;
          }, 1000);

        }




        // clearInterval(this.AttendTimer);


        // let eventStart:any = new Date(arg.event.start);
        //             let timerSpan = document.createElement("span");
        //             timerSpan.className = "event-timer";
        //             arg.el.appendChild(timerSpan);

        //             function updateTimer() {
        //               console.log(`23222222222`);
        //                 let now:any = new Date();
        //                 let diff = Math.floor((now - eventStart) / 1000); // الفرق بالثواني
        //                 let elapsedMinutes = Math.floor(diff / 60);
        //                 let elapsedSeconds = diff % 60;
        //                 timerSpan.textContent = ` (${elapsedMinutes}:${elapsedSeconds.toString().padStart(2, '0')})`;
        //             }
        //             setInterval(updateTimer, 1000);

        console.log(arg);
        const eventId = arg.event.id;
        // زيادة العد عند كل نقر

        arg.el.addEventListener("dblclick", (jsEvent: any) => {

          if (eventId) {
            var event = this.calendar.getEventById(eventId);
            console.log(`event= `, event);
            this.SelectedSlot = event;
            this.editAppt(event);
          } else {
            // this.SelectedSlot.resource.id.includes(`Room`);
            if (this.SelectedSlot.resource.id.includes(`Room`)) {
              this.getAvailableAreaList();
            } else {
              this.newApp(true);
            }

          }
        });


        // console.log(`arg= `, arg);

        arg.el.addEventListener("contextmenu", (jsEvent: any) => {
          // this.SelectedSlot = info;
          console.log(`jsEvent= `, jsEvent);
          if (eventId) {
            var event = this.calendar.getEventById(eventId);
            console.log(`event= `, event.start);
            this.SelectedSlot = event;
          }



          jsEvent.preventDefault()
          console.log("contextMenu", eventId);
          this.showContextMenu(jsEvent, eventId);
        });

        // arg.el.addEventListener('contextmenu',  (e:any) =>{
        //   e.preventDefault();
        //   this.showContextMenu(e.pageX, e.pageY);
        // });



        // من أجل توميض المواعيد التي لها نفس الرقم 
        const eventEl = arg.el;
        if (!eventEl) return;
        // استخراج ID من الكلاس
        const match = eventEl.className.match(/appt-(\d+)/);
        if (match) {
          const apptId = match[1];

          // إضافة التأثير عند التحريك
          eventEl.addEventListener("mouseenter", () => this.applyHighlight(apptId, true));
          eventEl.addEventListener("mouseleave", () => this.applyHighlight(apptId, false));
        }




      },

      dayCellDidMount: (info: any) => {

        const today = new Date().setHours(0, 0, 0, 0); // تاريخ اليوم بدون الوقت
        const cellDate = new Date(info.date).getTime(); // تاريخ الخلية


        if (cellDate < today) {
          // info.el.classList.add('past-days');
        } else {
          info.el.style.backgroundColor = '#f4f5f8';
        }


        // console.log(`cellDate= `, cellDate);
        // console.log(info);
        // console.log(info.resource.extendedProps.type);

        // if (info.resource && info.resource.extendedProps.type === 'Real') {
        //   info.el.style.backgroundColor = '#f6e58d3d';// '#f6e58d7c'; // تغيير خلفية العنوان إلى أصفر
        // } else {
        //   info.el.style.backgroundColor = '#f4f5f8';
        // }
        // console.log(info.date);



        var dateObj = new Date(info.date);
        var hours = dateObj.getHours(); // الساعة
        var minutes = dateObj.getMinutes(); // الدقائق

        // console.log(hours);
        // if (hours > 10 && hours < 12) {
        //   info.el.classList.add('hide-slot');
        // }
      },


      resourceLabelDidMount: (info: any) => {
        console.log(`info.resource.title= `, info);
        let DateProp = this.getAdjacentDate(info.date, 0);
        // console.log(`info.resource.title= `, DateProp);
        info.el.style.lineHeight = 1.2;
        if (info.resource.extendedProps.type === 'Waiting') {
          info.el.style.backgroundColor = '#f6e58d7c'; // تغيير خلفية العنوان إلى أصفر

          var questionMark = document.createElement('span');
          questionMark.innerHTML = `
            <ion-progress-bar id="w-${DateProp}-${info.resource.extendedProps.IDP}" style="margin-top:-3px" value="0" ></ion-progress-bar> `;
          info.el.appendChild(questionMark);

          this.tblDayColumn.push({
            IDDoctor: info.resource.extendedProps.IDP,
            IDRoom: 0,
            AType: 1,
            DayDate: DateProp,
            ElId: `w-${DateProp}-${info.resource.extendedProps.IDP}`,
          });
          // let Percent = null;
          // console.log(`this.tblSchedulePercent = `, this.tblSchedulePercent);
          // alert(2 );
          // if (this.tblSchedulePercent ){
          //   alert(
          //     JSON.stringify(this.tblSchedulePercent)
          //   );
          // }


          // if (this.tblSchedulePercent && this.tblSchedulePercent.doctorOccupancy
          //   && this.tblSchedulePercent.doctorOccupancy[info.resource.extendedProps.DoctorData.IDDoctor]
          //   && this.tblSchedulePercent.doctorOccupancy[info.resource.extendedProps.DoctorData.IDDoctor][DateProp]
          // ) {
          //   Percent = this.tblSchedulePercent.doctorOccupancy[info.resource.extendedProps.DoctorData.IDDoctor][DateProp].WaitingAppPercentage;
          //   alert(Percent);

          //   var questionMark = document.createElement('span');
          //   questionMark.innerHTML = `
          //   <ion-progress-bar style="margin-top:-3px" value="${Percent}" ></ion-progress-bar> `;
          //   info.el.appendChild(questionMark);
          // }





        }

        // ${info.resource.extendedProps.DoctorData.WeekNewPatients}
        if (info.resource.extendedProps.type === 'Real') {
          var questionMark = document.createElement('span');
          questionMark.innerHTML = `
          <ion-progress-bar id="r-${DateProp}-${info.resource.extendedProps.IDP}" style="margin-top:-3px" value="0" ></ion-progress-bar> 
          `;
          info.el.appendChild(questionMark);

          this.tblDayColumn.push({
            IDDoctor: info.resource.extendedProps.IDP,
            IDRoom: 0,
            AType: 0,
            DayDate: DateProp,
            ElId: `r-${DateProp}-${info.resource.extendedProps.IDP}`,
          });
        }

        if (info.resource.extendedProps.type === 'Room') {
          var questionMark = document.createElement('span');
          questionMark.innerHTML = `
          <ion-progress-bar id="room-${DateProp}-${info.resource.extendedProps.IDP}" style="margin-top:-3px" value="0" ></ion-progress-bar> 
          `;
          info.el.appendChild(questionMark);


          this.tblDayColumn.push({
            IDDoctor: 0,
            IDRoom: info.resource.extendedProps.IDP,
            AType: 0,
            DayDate: DateProp,
            ElId: `room-${DateProp}-${info.resource.extendedProps.IDP}`,
          });
        }

      },




      selectAllow: (selectInfo: any) => { // 
        const startDate = new Date("2024-12-01"); // تاريخ البداية
        const endDate = new Date("2024-12-05"); // تاريخ النهاية

        // إذا كان التحديد ضمن النطاق الممنوع، امنع الاختيار
        if (
          (selectInfo.start >= startDate && selectInfo.start <= endDate) ||
          (selectInfo.end > startDate && selectInfo.end <= endDate)
        ) {
          return false; // منع الاختيار
        }
        return true; // السماح إذا كان خارج النطاق
      },
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
      },
      // slotLabelDidMount: (info: any) => {

      // },

      dayHeaderDidMount: (info: any) => {
        // alert(info.date);
        // let miladyHeaderFormat = this.miladyHeaderFormat(info.date);
        info.el.innerHTML = `<div style="margin-top:-6px">${this.miladyHeaderFormat(info.date)}</div> <div style="margin-top:-12px;margin-bottom:-5px;"> ${this.getHijriDate(info.date)}</div>`;

        let id = new Date(info.date).getTime(); // Tue Feb 11 2025 03:00:00 GMT+0300 (GMT+03:00)
        // console.log(`dayHeaderDidMount= `, info.date);
        // if (this.IsDayHeaderNots) {
        let Note = ``;
        let tmpDate = this.getAdjacentDate(info.date, 0);
        // alert(tmpDate);
        // alert(this.tblNote.filter(x => x.RepeatedDate == tmpDate).length);
        if (this.tblNote.filter(x => x.RepeatedDate == tmpDate).length > 0) {
          Note = this.tblNote.filter(x => x.RepeatedDate == tmpDate)[0].Note;
        }

        var questionMark = document.createElement('span');
        questionMark.id = `h${id.toString()}`;
        questionMark.innerHTML = `<div style="padding-bottom: 2px;background: #ccae62; font-size:14px; line-height:1"> ${Note} </div>`; // this.tblNote
        // إضافة كلاس إلى العنصر
        questionMark.classList.add('question-mark');


        info.el.insertBefore(questionMark, info.el.firstChild);


        setTimeout(() => {
          this.showDayNotesExe();
        }, 500);
        // كتابة الملاحظات لليوم
        // }
      },

      // slotLabelInterval:{
      //   minute:5
      // },

      // scrollTime: '17:30:00',
    });


    let tmpScrollToTime = '00:00:00';
    if (this.ScrollFocusToAppt != null && IsAfterCloseEmpty) {
      // alert(this.ScrollToAppt.ADate);
      console.log(this.ScrollFocusToAppt);
      tmpScrollToTime = this.ScrollFocusToAppt.ADate.split(` `)[1];

    }

    // this.scrollAndSelectSlot = {
    //   resourceId: AppType,
    //   start: start, // '2024-12-31 10:15',
    //   end: end,
    //   ScrollTo: ScrollTo.trim().split(' ')[1] + ':00'
    // }
    setTimeout(() => {

      if (this.ScrollAndSelectSlot != null && IsAfterCloseEmpty) {
        // alert(this.ScrollAndSelectSlot.ScrollTo)
        this.scrollToTime(this.ScrollAndSelectSlot.ScrollTo);

        // alert(JSON.stringify(this.ScrollAndSelectSlot));
        this.calendar.select({
          resourceId: this.ScrollAndSelectSlot.resourceId,
          start: this.ScrollAndSelectSlot.start, // '2024-12-31 10:15',
          end: this.ScrollAndSelectSlot.end,
        });


        this.ScrollAndSelectSlot = null;
      }
    }, 1000);





    // console.log(`tmpScrollToTime= `, tmpScrollToTime);
    setTimeout(() => {
      this.calendar.render();
      if (this.ScrollFocusToAppt != null && IsAfterCloseEmpty) {
        setTimeout(() => {
          // console.log(`this.tblEvents = `, this.tblEvents);
          let event = this.tblEvents.find(x => x.extendedProps?.IDP == this.ScrollFocusToAppt.IDP);
          console.log(`event = `, event);


          // alert(tmpScrollToTime);
          this.scrollToTime(tmpScrollToTime.trim());
          this.ScrollFocusToAppt = null;
          // alert(event.id);
          let tblClass = event.className.split(" ");
          tblClass.push('event-selected-class');
          this.calendar.getEventById(event.id).setProp('classNames', tblClass);


        }, 700);
      }
    }, 250);


    // document.querySelectorAll('.timer-item').forEach((item:any) => {
    //   item.dataset.currentColor = 'color1';
    // });

    // setTimeout(() => {
    //   const timerItems = document.querySelectorAll('.header-flash');
    //   setInterval(() => {
    //     timerItems.forEach((item: any) => {
    //       // تبديل اللون الحالي
    //       if (item.style.backgroundColor === 'rgb(225, 177, 44)') { // اللون الأول (#3498db) بصيغة RGB
    //         item.style.backgroundColor = '#8c7ae6'; // اللون الثاني
    //       } else {
    //         item.style.backgroundColor = 'rgb(225, 177, 44)'; // اللون الأول
    //       }
    //     });
    //   }, 1500);
    // }, 2000);




  }

  scrollToTime(ScrollToTime) {
    let timeSlot = document.querySelector(`.fc-timegrid-slot[data-time="${ScrollToTime}"]`);
    if (timeSlot) {
      timeSlot.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getHijriDate(gregorianDate: string): string {
    let ArabicDays = {
      Sunday: `الأحد`,
      Monday: `الإثنين`,
      Tuesday: `الثلاثاء`,
      Wednesday: `الأربعاء`,
      Thursday: `الخميس`,
      Friday: `الجمعة`,
      Saturday: `السبت`,
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long', // إضافة اسم اليوم
      // calendar: 'islamic-umalqura', // استخدام تقويم أم القرى
    };
    // تحويل التاريخ الميلادي إلى هجري
    const hijriDate = new Intl.DateTimeFormat('en-SA-u-ca-islamic-umalqura', options).format(new Date(gregorianDate));

    const dayName = hijriDate.split(', ')[0];
    const [hijriMonth, hijriDay, hijriYear] = hijriDate.split(', ')[1].split('/');
    return `${hijriYear.split(' ')[0]}-${hijriMonth.length == 2 ? hijriMonth : `0${hijriMonth}`}-${hijriDay.length == 2 ? hijriDay : `0${hijriDay}`} <span class="header-day-name">: ${ArabicDays[dayName]}</span>`;
  }

  miladyHeaderFormat(dateString) {
    const date = new Date(dateString);

    // استخراج اليوم، الشهر، السنة، واسم اليوم
    const day = String(date.getDate()).padStart(2, '0'); // اليوم
    const month = String(date.getMonth() + 1).padStart(2, '0'); // الشهر (يبدأ من 0)
    const year = date.getFullYear(); // السنة
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }); // اسم اليوم

    // إرجاع التاريخ المنسق
    // return `${day}-${month}-${year} : ${dayName}`;
    return `${year}-${month}-${day} <span class="header-day-name">: ${dayName}</span>`;
  }

  showDayNotes() {
    this.IsDayHeaderNots = !this.IsDayHeaderNots;
    this.showDayNotesExe();
    // const elements = document.querySelectorAll('.question-mark'); // حدد جميع العناصر ذات الكلاس
    // elements.forEach(el => {
    //   if (this.IsDayHeaderNots) {
    //     el.classList.add('show'); // إظهار
    //   } else {
    //     el.classList.remove('show'); // إخفاء
    //   }
    // });
  }
  showDayNotesExe() {
    const elements = document.querySelectorAll('.question-mark'); // حدد جميع العناصر ذات الكلاس
    elements.forEach(el => {
      if (this.IsDayHeaderNots) {
        el.classList.add('show'); // إظهار
      } else {
        el.classList.remove('show'); // إخفاء
      }
    });
  }


  expand(IsChanged = true) {
    if (IsChanged) { this.IsYScroll = !this.IsYScroll; }

    // if (this.IsYScroll) {
    //   this.ColWidth = 155;
    //   // this.reRender(this.ColWidth);
    // } else {
    //   this.ColWidth = 75;
    //   // this.reRender(null);
    // }
    // fc-col-header fc-scrollgrid-sync-table

    const eventContainers = document.querySelectorAll('.event-header, .event-desc, .event-service, .event-patient, .event-footer, .event-room-body');
    const patientName = document.querySelectorAll('.patient-name');

    if (this.IsYScroll) {
      this.ColWidth = 155;
      eventContainers.forEach((ev: any) => {
        ev.style.display = 'block'; // الإخفاء
      });
      patientName.forEach((ev: any) => {
        ev.style.display = 'none'; // الإخفاء
      });
      // patient-name
    } else {
      this.ColWidth = 75;
      eventContainers.forEach((ev: any) => {
        ev.style.display = 'none'; // الإخفاء
      });
      patientName.forEach((ev: any) => {
        ev.style.display = 'block'; // الإخفاء
      });
    }

    const dayNames = document.querySelectorAll('.header-day-name');
    dayNames.forEach((day: any) => {
      day.style.display = this.ColWidth == 155 ? '' : 'none'; // الإخفاء
    });
    document.querySelectorAll('.fc-col-header').forEach((element: any) => {
      element.style.fontSize = this.ColWidth == 155 ? '16px' : '12px';
    });




    // const eventDesc = document.querySelectorAll('.event-desc');
    // eventDesc.forEach((ev: any) => {
    //   ev.style.display = 'none'; // الإخفاء
    // });

    // const eventService = document.querySelectorAll('.event-service');
    // eventService.forEach((ev: any) => {
    //   ev.style.display = 'none'; // الإخفاء
    // });

    this.calendar.setOption(`dayMinWidth`, this.ColWidth);
    this.calendar.updateSize();
  }

  getEventByID() {
    var event = this.calendar.getEventById('6'); // an event object!
    var start = event.start; // a property (a Date object) ExtraData

    event.setProp('title', event.title + `<span><div class="alert-banner"><div></span>`);

    // const description = event.extendedProps;
    // console.log(`start= `, start);
    // console.log(`event.extendedProps= `, event.extendedProps2);
  }


  // showContextMenu(x:any, y:any) {
  //   this.contextMenu.style.display = 'block';
  //   this.contextMenu.style.left = `${x}px`;
  //   this.contextMenu.style.top = `${y}px`;
  // }

  hideContextMenu() {
    let menu = document.getElementById('context-menu');
    menu.style.display = 'none';
  }

  menuNo = 0;
  showContextMenu(event: MouseEvent, eventId: any) {
    // console.log(`eventId= `, eventId);
    this.menuNo = eventId ? 1 : 0;



    let menu = document.getElementById('context-menu');
    // alert(menu);
    if (!menu) {

      menu = document.createElement('div');
      menu.id = 'context-menu';
      menu.style.position = 'absolute';
      menu.style.background = '#fff';
      menu.style.border = '1px solid #ccc';
      menu.style.borderRadius = '5px';
      menu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      menu.style.zIndex = '1000';
      document.body.appendChild(menu);
    }


    // محتويات القائمة
    // menu.innerHTML = `
    //   <ul class="menu-slot" >
    //     <li onclick="newApp(${eventId})">New Appointment</li>
    //     <li onclick="alert('Edit Event ${eventId}')">On Call Booking</li>
    //     <li onclick="alert('Edit Event ${eventId}')"> Open Patient File </li>
    //     <li onclick="alert('Edit Event ${eventId}')"> Confirm Appointment </li>
    //     <li onclick="alert('Edit Event ${eventId}')"> ChargeSlip </li>
    //     <li onclick="alert('Edit Event ${eventId}')"> Create Invoice </li>
    //     <li onclick="alert('Edit Event ${eventId}')" class="submenu"> Schedules 
    //       <ul class="submenu-items">
    //         <li>خدمة 1</li>
    //         <li>خدمة 2</li>
    //         <li>خدمة 3</li>
    //       </ul>
    //     </li>
    //     <li onclick="alert('Edit Event ${eventId}')"> </li>
    //   </ul>
    // `;

    // تحديد موقع القائمة

    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
    setTimeout(() => {
      menu.style.display = 'block';
    }, 150);
    console.log(menu);
    // alert(event.pageX)
  }




  async scheduleTime() {
    const modal = await this.modalCtrl.create({
      component: ScheduleTimeComponent,
      // componentProps: { StartDate: this.SelectedSlot.startStr },
      backdropDismiss: false,
      cssClass: 'schedule-time-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {

    }
  }

  async nextAvailable(SendTo = 0, CopyTo = 0, IDDoctor = 0, Duration = 0, IDRoom = 0) {
    this.hideContextMenu();
    console.log(`SelectedSlot= `, this.SelectedSlot);
    // return;

    if (Duration == 0) {
      Duration = this.AppointmentMinPeriod;
      if (this.SelectedSlot != undefined) {
        Duration = this.apptService.getDurationInMinutes(new Date(this.SelectedSlot.start), new Date(this.SelectedSlot.end));
      }
    }
    // if (IDDoctor == 0) {
    //   IDDoctor = this.apptService.tblSelectedDoctor[0];
    // }
    let AType = 0;
    if (this.SelectedSlot?.resource?.extendedProps?.type == `Waiting`) {
      AType = 1;
    }
    // alert(AType)
    if (IDDoctor == 0 && IDRoom == 0) {
      if (this.SelectedSlot?.resource?.extendedProps?.DoctorData != undefined) {
        IDDoctor = this.SelectedSlot.resource.extendedProps.IDP;
        IDRoom = 0;
      } else if (this.SelectedSlot?.resource?.extendedProps?.Data != undefined) {
        IDDoctor = 0;
        IDRoom = this.SelectedSlot.resource.extendedProps.IDP;
      } else if (this.apptService?.tblSelectedDoctor?.length > 0) {
        IDDoctor = this.apptService.tblSelectedDoctor[0];
      } else {
        IDRoom = this.apptService.tblSelectedRoom[0];
      }
    }

    // alert(IDDoctor);
    if (CopyTo == 1) {
      IDDoctor = this.SelectedSlot.extendedProps.IDDoctor;
      this.getPatient(this.SelectedSlot.extendedProps.IDPatient);
    }
    // let Duration = this.AppointmentMinPeriod;
    // if (this.SelectedSlot != undefined) {
    //   Duration = this.apptService.getDurationInMinutes(new Date(this.SelectedSlot.start), new Date(this.SelectedSlot.end));
    // }

    let CopiedAppt = null;
    if (SendTo == 1 || CopyTo == 1) {
      Duration = this.SelectedSlot.extendedProps.Duration;
      CopiedAppt = this.SelectedSlot;
    }
    // return;
    const modal = await this.modalCtrl.create({
      component: NextAvailableComponent,
      componentProps: {
        // StartDate: this.SelectedSlot.startStr 
        IDOperatingRoom: IDRoom,
        IDDoctor: IDDoctor,
        SendTo: SendTo,
        CopyTo: CopyTo,
        Duration: Duration,
        AType: AType,
      },
      backdropDismiss: false,
      // cssClass: 'newapp-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`role= `, data);

      if (SendTo == 1) {
        // let Resource = CopiedAppt.id;
        let AType = 0;
        if (data.AppType.split(`-`)[1] == "Waiting") {
          AType = 1;
        }
        let IDDoctor = CopiedAppt.extendedProps.IDDoctor;
        let NextAppt = data.NextAppt;
        let ADate = `${NextAppt.AppDate} ${NextAppt.AppTime.split(`:`)[0]}:${NextAppt.AppTime.split(`:`)[1]}`;
        // alert(JSON.stringify(CopiedAppt.extendedProps));

        this.updateAppt(CopiedAppt.extendedProps, 0, ADate, AType, IDDoctor).then(updated => {
          if (!updated) {
            this.all.ngxToast(`Operation Failed`, ``, `warning`);
            this.calendar.unselect();
          } else {
            this.getSechudleData();
            this.CopyData = null;

            this.scrollToAppt(data);
          }
        });
      } else {
        // alert(2)
        this.scrollToAppt(data);
        let NextAppt = data.NextAppt;
        let AppType = data.AppType;

        // this.all.CurrentDate = NextAppt.AppDate;
        // this.calendar.gotoDate(this.all.CurrentDate);

        let start = `${NextAppt.AppDate} ${NextAppt.AppTime.split(`:`)[0]}:${NextAppt.AppTime.split(`:`)[1]}`;
        let end = this.addMinutesToDateTime(start, NextAppt.Duration);
        // let ScrollTo = this.addMinutesToDateTime(end, 90);
        // alert(start)
        setTimeout(() => {
          this.calendar.select({
            resourceId: AppType,
            start: start, // '2024-12-31 10:15',
            end: end,
          });
          // setTimeout(() => {
          //   this.calendar.scrollToTime(this.all.getTimeWithoutSecound(ScrollTo));
          // }, 500);
        }, 500);
      }








      // let NextAppt = { "ID": "1", "IDBranch": "1", "AppDate": "2025-02-02T12:06:50.066Z", "AppDateH": "1443-08-25", "AppTime": "9:00:00 AM", "DayNo": "1", "Duration": "60" };
    }
  }

  ScrollAndSelectSlot = null;
  scrollToAppt(data) {
    let NextAppt = data.NextAppt;
    let AppType = data.AppType;

    // this.all.CurrentDate = NextAppt.AppDate;
    // this.calendar.gotoDate(this.all.CurrentDate);

    let start = `${NextAppt.AppDate} ${NextAppt.AppTime.split(`:`)[0]}:${NextAppt.AppTime.split(`:`)[1]}`;
    let end = this.addMinutesToDate(start, NextAppt.Duration);
    // let ScrollTo = end;// this.addMinutesToDate(end, 30);

    // setTimeout(() => {


    // alert(end.trim().split(' ')[1])
    if (this.all.CurrentDate != NextAppt.AppDate) {
      this.ScrollAndSelectSlot = {
        resourceId: AppType,
        start: start, // '2024-12-31 10:15',
        end: end,
        ScrollTo: end.trim().split(' ')[1] + ':00'
      };
      // alert(JSON.stringify(this.ScrollAndSelectSlot))
      this.all.CurrentDate = NextAppt.AppDate;
      // this.calendar.gotoDate(this.all.CurrentDate);
      return;
    }

    // this.all.CurrentDate = NextAppt.AppDate;
    // this.calendar.gotoDate(this.all.CurrentDate);


    setTimeout(() => {
      // this.calendar.scrollToTime(this.all.getTimeWithoutSecound(ScrollTo));
      // console.log(` select app = `, AppType, start, end, end.trim().split(' ')[1] + ':00');
      // alert(AppType + ` - ` + start + ` - ` + end + `  -  ` + ScrollTo.trim().split(' ')[1] + ':00');
      this.scrollToTime(end.trim().split(' ')[1] + ':00');


      // 2-Real - 2025-03-19 22:15 - 2025-03-19 22:25
      setTimeout(() => {
        this.calendar.select({
          resourceId: AppType,
          start: start, // '2024-12-31 10:15',
          end: end,
        });
      }, 500);

      // alert(this.all.getTimeWithoutSecound(ScrollTo));
      // alert(this.calendar.getDate());
    }, 500);
    // }, 500);
  }

  getDayNumber(dateString) {
    let date = new Date(dateString);
    let day = date.getDay(); // getDay() يُرجع الأيام من 0 (الأحد) إلى 6 (السبت)

    return day === 0 ? 1 : day + 1;
  }


  blockErea() {
    this.hideContextMenu();
    console.log(`this.SelectedSlot= `, this.SelectedSlot);
    this.all.confirm(`Are you sure you want block this eara?`).then(yes => {
      if (yes) {
        this.addErea(0, 1);


        // let IDDoctors = `0`;
        // let IDOperatingRooms = `0`;
        // if (this.SelectedSlot.resource.extendedProps.DoctorData.IsDoctor) {
        //   IDDoctors = this.SelectedSlot.resource.extendedProps.DoctorData.IDDoctor;
        // }
        // let RealApp = 0;
        // let WaitingApp = 0;
        // if (this.SelectedSlot.resource.extendedProps.type == `Room`) {
        //   IDOperatingRooms = this.SelectedSlot.resource.extendedProps.IDP;
        //   RealApp = 1;
        // } else if (this.SelectedSlot.resource.extendedProps.type == `Real`) {
        //   IDDoctors = this.SelectedSlot.resource.extendedProps.IDP;
        //   RealApp = 1;
        // } else {
        //   IDDoctors = this.SelectedSlot.resource.extendedProps.IDP;
        //   WaitingApp = 1;
        // }
        // let DayNo = this.getDayNumber(this.SelectedSlot.start);

        // // Call Run('NewSchedule(         56093272,   1                   ,1,                              0  ,17                 ,"77"         ,"0"                  ,"7"        ,1,"2025-03-08"                                 ,"2025-03-08","15:05:00","2025-03-08 15:15:00",0,0,0,1,0,0,0,1,"")');
        // let RandomNo = this.all.generateRandomNumber(8);
        // let Query = `Call Run('NewSchedule(${RandomNo},${this.all.User.IDC},${this.all.RegisterData.Branch},0,${this.all.User.IDP},"${IDDoctors}","${IDOperatingRooms}","${DayNo}",1,"${this.SelectedSlot.startStr.split('T')[0]}","${this.SelectedSlot.endStr.split('T')[0]}","${this.SelectedSlot.startStr.split('T')[1].split('Z')[0]}","${this.SelectedSlot.endStr.split('T')[0]} ${this.SelectedSlot.endStr.split('T')[1].split('Z')[0]}",
        // 0,0,0,
        // ${RealApp},${WaitingApp},
        // 0,0,1,"")')`;

        // console.log(`Query= `, Query);

        // const body = new HttpParams()
        //   .set('Mtype', 'A16')
        //   .set('Query', Query);

        // this.all.postData(body).then(res => {

        //   if (res['Q0Error'] == `InternalDataSet: Cursor not returned from Query`) {
        //     this.calendar.addEvent({
        //       id: 10,
        //       title: '<div style="color:black;">Block area</div>',
        //       start: this.SelectedSlot.startStr,
        //       end: this.SelectedSlot.endStr,
        //       resourceId: this.SelectedSlot.resource.id, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
        //       display: 'background', // لجعلها خلفية
        //       color: this.BlockColor, // لون الخلفية
        //       editable: false, // يمكن نقله لأي مكان
        //       durationEditable: false,
        //     });

        //     this.calendar.unselect();
        //   }


        // });

      }
    });
  }

  addErea(State, ShiftNo = 1, Branch = 0) {

    if (Branch == 0) {
      Branch = this.all.RegisterData.Branch
    }

    // let color = ``;
    // if (State == 1 && ShiftNo == 1) {
    //   color = this.all.Shift1Color;
    // } else if (State == 1 && ShiftNo != 1) {
    //   color = this.all.Shift2Color;
    // } else if (State == 0) {
    //   color = this.all.BlockColor;
    // }

    // alert(State + '   -   ' + ShiftNo);
    // return;

    let color = ``;

    if (State == 0) {
      color = this.all.BlockColor;
    } else if (ShiftNo == 1) {
      color = this.all.ExtraShiftColor;
    }
    // else {
    //   color = this.all[`Shift${ShiftNo}Color`];
    // }


    let IDDoctors = `0`;
    let IDOperatingRooms = `0`;
    if (this.SelectedSlot.resource.extendedProps.DoctorData.IsDoctor) {
      IDDoctors = this.SelectedSlot.resource.extendedProps.DoctorData.IDDoctor;
    }
    let RealApp = 0;
    let WaitingApp = 0;
    if (this.SelectedSlot.resource.extendedProps.type == `Room`) {
      IDOperatingRooms = this.SelectedSlot.resource.extendedProps.IDP;
      RealApp = 1;
    } else if (this.SelectedSlot.resource.extendedProps.type == `Real`) {
      IDDoctors = this.SelectedSlot.resource.extendedProps.IDP;
      RealApp = 1;
    } else {
      IDDoctors = this.SelectedSlot.resource.extendedProps.IDP;
      WaitingApp = 1;
    }
    let DayNo = this.getDayNumber(this.SelectedSlot.start);

    // Call Run('NewSchedule(         56093272,   1                   ,1,                              0  ,17                 ,"77"         ,"0"                  ,"7"        ,1,"2025-03-08"                                 ,"2025-03-08","15:05:00","2025-03-08 15:15:00",0,0,0,1,0,0,0,1,"")');
    let RandomNo = this.all.generateRandomNumber(8);
    let Query0 = `Call Run('NewSchedule(${RandomNo},${this.all.User.IDC},${Branch},0,${this.all.User.IDP},"${IDDoctors}","${IDOperatingRooms}","${DayNo}",${ShiftNo},"${this.SelectedSlot.startStr.split('T')[0]}","${this.SelectedSlot.endStr.split('T')[0]}","${this.SelectedSlot.startStr.split('T')[1].split('Z')[0]}","${this.SelectedSlot.endStr.split('T')[0]} ${this.SelectedSlot.endStr.split('T')[1].split('Z')[0]}",
        ${State},0,0,
        ${RealApp},${WaitingApp},
        0,${State == 1 ? '20' : '0'},1,"")')`;

    // let Query0 = `Call Run('NewSchedule(${RandomNo},${this.all.User.IDC},${this.all.RegisterData.Branch},0,${this.all.User.IDP},"${IDDoctors}","${IDOperatingRooms}","${dd.No}",${this.ShiftNo},"${this.SechduleData.CreatedFromDate}","${this.SechduleData.CreatedToDate}","${OpenTime.Time}","${ClosedTime.Date} ${ClosedTime.Time}",
    // 1, -- State
    // 1, -- IsRepeated
    // 0, -- IDGroup
    // ${this.RealApp ? `1` : `0`},
    // ${this.WaitingApp ? `1` : `0`},
    // 1, -- Schedule
    // 0, -- WaitingCount
    // 1, -- OverbookingCount
    // "" -- Description
    // )')`;
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

      this.calendar.addEvent({
        id: 10,
        title: '',
        start: this.SelectedSlot.startStr,
        end: this.SelectedSlot.endStr,
        resourceId: this.SelectedSlot.resource.id, // تخصيص المورد الذي سيتم تلوين المنطقة فيه
        display: 'background', // لجعلها خلفية
        color: color, // لون الخلفية
        editable: false, // يمكن نقله لأي مكان
        durationEditable: false,
      });

      this.calendar.unselect();


    });
  }

  openExtraErea() {
    this.hideContextMenu();
    console.log(this.all.tblBranch);
    let Inputs = [];

    for (let branch of this.all.tblBranch.filter(x => x.IDP != 0)) {
      Inputs.push(
        {
          label: branch[`Name` + this.all.LangLetter],
          type: 'radio',
          value: branch.IDP,
        },
      );
    }

    this.alertController.create({
      header: this.all.translate.instant(`Select Branch`),
      // message: ``,
      cssClass: `custom-confirm`,
      inputs: Inputs,
      buttons: [
        {
          text: `Cancel`,
          cssClass: 'alert-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');

          }
        }, {
          cssClass: 'alert-button-confirm',
          text: `OK`,
          handler: (reson) => {
            console.log('Confirm Okay= ', reson);

            this.addErea(1, 1, reson);

          }
        }
      ]
    }).then((confirm) => {
      confirm.present();
    });
  }

  removeEvent() {
    this.calendar.getEventById(`1377342`).remove();
  }

  addEvent() {
    console.log(this.all.Patient);

    console.log(`this.SelectedSlot= `, this.SelectedSlot.resource.id);
    this.calendar.addEvent({
      id: '10',
      resourceId: this.SelectedSlot.resource.id, // مرتبط بـ Room B
      title: `new appointment <div style="background:red; padding:3px; border-radius: 3px;">Header</div>`,
      start: this.SelectedSlot.startStr,
      end: this.SelectedSlot.endStr,
      // resourceEditable: true,
      // eventClassNames: ['event-class1'],
      editable: true, // يمكن نقله لأي مكان
      durationEditable: true,
      display: 'list-item',
    },);
    this.calendar.unselect();
  }

  today() {
    this.all.CurrentDate = this.all.toLocalISOString(new Date()).split(`T`)[0];
    // alert((this.all.toLocalISOString(this.calendar.getDate())).split(`T`)[0] +`  -  ` + this.all.CurrentDate)
    if ((this.all.toLocalISOString(this.calendar.getDate())).split(`T`)[0] == this.all.CurrentDate) {
      console.log('today');
      return;
    }
    // this.calendar.today();
    // alert(this.calendar.getDate().toISOString());
    // this.all.CurrentDate = this.all.toLocalISOString(this.calendar.getDate()).split(`T`)[0];


    let date = new Date(this.all.CurrentDate);
    this.StartDate = this.getQueryDate(this.all.CurrentDate);
    let newEndDate = new Date(date.getTime() + ((+this.apptService.ViewDayCount) * 24 * 60 * 60 * 1000));
    this.EndDate = this.getQueryDate(this.all.toLocalISOString(newEndDate));
    this.getSechudleData();

    // this.calendar.gotoDate(this.all.CurrentDate);
  }
  setDate() {
    // console.log(`this.all.CurrentDate= `, this.all.CurrentDate);
    // this.calendar.gotoDate(this.all.CurrentDate);


    // let date = new Date(this.all.CurrentDate);
    // this.StartDate = this.getQueryDate(this.all.CurrentDate);
    // let newEndDate = new Date(date.getTime() + ((+this.apptService.ViewDayCount) * 24 * 60 * 60 * 1000));
    // this.EndDate = this.getQueryDate(this.all.toLocalISOString(newEndDate));
    // this.getSechudleData();
  }

  // ViewDayCount = 5;
  getAdjacentDate(dateString, days) {
    // تحويل تاريخ النص إلى كائن Date
    const date = new Date(dateString);

    // إضافة أو طرح الأيام بناءً على المعامل days
    date.setDate(date.getDate() + days);

    // إرجاع التاريخ الجديد كسلسلة نصية بتنسيق YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // الأشهر من 0 إلى 11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getNextDay(no) {
    this.all.CurrentDate = this.getAdjacentDate(this.all.CurrentDate, no);
  }
  viewDays(dayCount: number) {
    this.all.CurrentDate = this.all.toLocalISOString(new Date());
    this.apptService.ViewDayCount = dayCount;


    let date = new Date(this.all.CurrentDate);
    this.StartDate = this.getQueryDate(this.all.CurrentDate);
    let newEndDate = new Date(date.getTime() + ((+this.apptService.ViewDayCount) * 24 * 60 * 60 * 1000));
    this.EndDate = this.getQueryDate(this.all.toLocalISOString(newEndDate));



    // this.calendar.setOption('days', { days: this.apptService.ViewDayCount });
    this.tblSlots = [];
    this.tblAppt = [];
    this.tblDayColumn = [];
    this.getDataBeforRender().then(yes => {
      this.reRender();
    });
    // this.getSechudleData();



    // initialView: 'resourceTimeGridFourDay',
    //   views: {
    //     resourceTimeGridFourDay: {
    //       type: 'resourceTimeGrid',
    //       duration: { days: 4 },
    //       buttonText: '4 days'
    //     }
    //   },

    // console.log(dayCount);
    // this.calendar.changeView('resourceTimeGridFourDay', {
    //   type: 'resourceTimeGrid',
    //   duration: { days: dayCount }, // تعيين عدد الأيام ديناميكيًا
    //   buttonText: `${dayCount} days`
    // });


    // this.calendar.setOption('views', {
    //   resourceTimeGridFourDay: {
    //     type: 'resourceTimeGrid',
    //     duration: { days: dayCount },
    //     buttonText: `${dayCount} Days`,
    //   },
    // });
    // this.calendar.changeView('resourceTimeGridFourDay'); // الانتقال إلى العرض الجديد
  }



  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }



  calculateSlots(slotMinTime, slotMaxTime, slotDuration) {
    // تحويل وقت HH:MM:SS إلى دقائق
    function timeToMinutes(time) {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return hours * 60 + minutes + (seconds || 0) / 60;
    }

    // تحويل مدة HH:MM إلى دقائق
    function durationToMinutes(duration) {
      const [hours, minutes] = duration.split(':').map(Number);
      return hours * 60 + minutes;
    }

    // alert(slotMinTime);
    const minTimeMinutes = timeToMinutes(slotMinTime);
    const maxTimeMinutes = timeToMinutes(slotMaxTime);
    const slotDurationMinutes = durationToMinutes(slotDuration);

    // إذا تجاوز الوقت 24 ساعة (26:00 مثلًا)
    const totalMinutes =
      maxTimeMinutes >= minTimeMinutes
        ? maxTimeMinutes - minTimeMinutes
        : 1440 - minTimeMinutes + maxTimeMinutes;

    // حساب عدد السلوتات
    return Math.floor(totalMinutes / slotDurationMinutes);
  }


  getQueryDate(isoDate) { //from 2025-02-11T05:26:02.975Z To 2025-02-11 05:00:00
    // تحويل التاريخ إلى كائن Date
    const date = new Date(isoDate);

    // استخراج السنة، الشهر، اليوم، الساعة، الدقيقة، الثانية
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // الأشهر من 0 إلى 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // إرجاع التاريخ المنسق
    // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    let AdditionalHoursForDay = this.all.RegisterData.AdditionalHoursForDay;
    if (AdditionalHoursForDay.length == 1) {
      AdditionalHoursForDay = "0" + AdditionalHoursForDay;
    }
    return `${year}-${month}-${day} ${AdditionalHoursForDay}:00:00`;
  }


  tblPatientSmsData = [{
    FileNo: ``, NameE: ``, NameA: ``, Phon1: ``, Phon2: ``, Phon3: ``
  }];
  tblTextTemplate = [];
  newApp(IsNew, IsOnCall = 0, ApptData = null, IDDoctor = 0, IsWalk = 0, IDOperatingRoom = 0) {

    this.hideContextMenu();
    console.log(this.SelectedSlot);
    if (this.SelectedSlot.resource?.id.includes(`Room`) && IsOnCall == 0 && ApptData == null && IDDoctor == 0 && IsWalk == 0) {
      this.getAvailableAreaList();
      return;
    }
    // alert(IsNew)
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

      let Query6 = `SELECT * FROM Appointments where IDC=${this.all.User.IDC} and IDY=${this.all.RegisterData.FinancialYear} and IDP in (${ApptData.IDP}) order by ADate desc`;
      let Query7 = `SELECT * FROM MedicalProcedures where IDC=${this.all.User.IDC} and IDAppointment=${ApptData.IDP}`;
      let Query8 = `Select count(*) v from patientsblacklist where IDC=${this.all.User.IDC} and IDPatient=${ApptData.IDPatient} and (0=0 or IDDoctor in (0,0) )`;
      let Query9 = `SELECT TextMessage FROM patientcommunication where IDPatient=${ApptData.IDPatient} and DoneUser<=0`;
      // let Query001 = `Select 0 IDP,1 IDC,0 IDNature,0 It_Level,0 PartNo,0 IDHand,"Any" NameE,"Any" NameA,"" NickName union all Select IDP,IDC,IDNature,It_Level,PartNo,IDHand,NameE,NameA,NickName from Items where IDC=${this.all.User.IDC} AND IDNature in (13,14,15,16)`;

      let Query10 = `Select if(p.IDAcc<=0,p.IDP,a.Ac_Num) FileNo,p.NameE,p.NameA,p.Phon1,p.Phon2,p.Phon3 From Patients p Left join Acc a on (p.IDC,p.IDAcc)=(a.IDC,a.IDP) Where (p.IDC,p.IDP)=(${this.all.User.IDC},${ApptData.IDPatient})`;
      let Query11 = 'Select * from TextTemplate where `Group`="SMS_Appointments"';


      Query = `${Query0};${Query1};${Query2};${Query3};${Query4};${Query5};${Query6};${Query7};${Query8};${Query9};${Query10};${Query11}`;
    }




    // console.log(`Query3= `, Query3);
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




      // console.log(`Q0= `, res[`Q0`]);
      // console.log(`Q1= `, res[`Q1`]);
      // console.log(`Q2= `, res[`Q2`]);
      // console.log(`Q3= `, res[`Q3`]);
      // console.log(`Q4= `, res[`Q4`]);
      // console.log(`Q5= `, res[`Q5`]);
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

        this.tblPatientSmsData = res[`Q10`];
        this.tblTextTemplate = res[`Q11`];
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
      let IDRoom = 0;
      if (IsNew) {
        if (this.SelectedSlot.resource.id.includes(`Room`)) {

          IDRoom = this.SelectedSlot.resource.id.split(`-`)[0];


          // alert(IDRoom);
        } else {
          AType = this.SelectedSlot.resource.id.includes(`Real`) ? 0 : 1;
          IDDoctor = this.SelectedSlot.resource.id.split(`-`)[0];

          if (IDOperatingRoom > 0) {
            IDRoom = IDOperatingRoom;
          }
        }


      } else {
        AType = ApptData.AType;
        IDDoctor = ApptData.IDDoctor;
      }
      this.apptModal(jsonData, AType, IDDoctor, IDRoom);
    });
  }

  async apptModal(jsonData, AType, IDDoctor, IDRoom) {
    console.log(`this.SelectedSlot= `, this.SelectedSlot);
    console.log(`jsonData= `, jsonData);
    let Duration = this.apptService.getDurationInMinutes(new Date(this.SelectedSlot.start), new Date(this.SelectedSlot.end));
    // alert(this.SelectedSlot.resource.id.split(`-`)[0]);

    const modal = await this.modalCtrl.create({
      component: NewAppComponent,
      componentProps: {
        IsNew: jsonData.IsNew,
        StartDate: this.SelectedSlot.startStr,
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

        tblPatientSmsData: this.tblPatientSmsData,
        tblTextTemplate: this.tblTextTemplate,
      },
      backdropDismiss: false,
      cssClass: 'newapp-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`role= `, data);
      if (data.Deleted) {
        let ID = jsonData.Appointments.ID;

        this.tblAppt.find(x => x.ID == ID).Deleted = 1;
        let a = this.tblAppt.find(x => x.ID == ID);
        this.tblDeletedAppt.push(a);
        this.tblAppt = this.tblAppt.find(x => x.Deleted != 1);

        if (this.IsShowDeleted) {
          let start = this.apptService.changeTime(this.all.CurrentDate, this.all.RegisterData.AdditionalHoursForDay + `:00`);
          let end = this.apptService.calculateEndTime(start, jsonData.Appointments.Duration);

          let tblClass = this.SelectedSlot.classNames;
          tblClass = tblClass.filter(x => x != 'event-real-class' && x != 'event-walkin-class' && x != 'event-walkin-class');
          tblClass.push('event-deleted-class');

          this.calendar.getEventById(ID).setProp('classNames', tblClass);

          this.calendar.getEventById(ID).setStart(start);
          this.calendar.getEventById(ID).setEnd(end);

          setTimeout(() => {
            this.calendar.getEventById(ID).setProp('durationEditable', false);
            this.calendar.getEventById(ID).setProp('editable', false);
          }, 500);
          this.refreshSchedule();
        } else {
          // this.calendar.getEventById(ID).remove();
          this.refreshSchedule();
        }

      } else if (data.Recovered) {
        // alert(222);
        let ID = jsonData.Appointments.ID;
        this.calendar.getEventById(ID).remove();
        this.tblDeletedAppt = this.tblDeletedAppt.filter(x => x.ID != ID);
        // this.getSechudleData();
        this.refreshSchedule();

      } else if (data.Saved) {
        // this.getSechudleData();
        this.refreshSchedule();

        this.calendar.unselect();
      } else {
        // this.getSechudleData();
        this.refreshSchedule();

      }
    }
  }

  editAppt(event) {
    console.log(`editAppt= `, event);
    console.log(`extendedProps= `, event.extendedProps);

    this.newApp(false, 0, event.extendedProps);
  }

  // ZoomHeight = 4000;




  updateAppt(Appt, Duration = 0, ADate = '', AType = null, IDDoctor = 0, IDRoom = 0) {
    return new Promise(resolve => {
      let QueryMedicalProcedures = `SELECT * FROM MedicalProcedures where IDC=${this.all.User.IDC} and IDAppointment=${Appt.IDP}`;
      const bodyQueryMedicalProcedures = new HttpParams()
        .set('Mtype', 'A16')
        .set('Query', QueryMedicalProcedures);

      this.all.postData(bodyQueryMedicalProcedures).then(res => {
        if (res[`Q0Error`] != "") {
          this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
          console.log(`Q0Error= `, res[`Q0Error`]);
          resolve(false);
        }

        let tblMedicalProcedures = res[`Q0`];
        let ProceduresD = ``;
        let DescriptionD = ``;
        if (tblMedicalProcedures.length > 0) {
          for (let p of tblMedicalProcedures) {
            if (ProceduresD.length > 0) {
              ProceduresD += `,`;
              DescriptionD += `,`;
            }
            ProceduresD += `${p.IDP}`;
          }
        } else {
          ProceduresD = `0`;
        }

        this.updateApptExe(Appt, ProceduresD, DescriptionD, Duration, ADate, AType, IDDoctor, IDRoom).then(updated => {
          resolve(updated);
        });
      });

    });
  }

  updateApptExe(Appt, ProceduresD, DescriptionD, Duration, ADate, AType, IDDoctor, IDRoom) {
    let NewDuration = Appt.Duration;
    if (Duration != 0) {
      NewDuration = Duration;
    }
    let NewADate = Appt.ADate;
    if (ADate != '') {
      if (this.all.isDate_YYYY_MM_DD_HH_MM(ADate)) {
        NewADate = ADate;
      } else {
        NewADate = this.datetimeService.getDateTimeWithoutSecound(ADate);
      }

    }

    let NewAType = Appt.AType;
    if (AType != null) {
      NewAType = AType;
    }

    let NewIDDoctor = Appt.IDDoctor;
    if (IDDoctor != 0 && IDDoctor != NewIDDoctor) {
      NewIDDoctor = IDDoctor;
    }
    let NewIDRoom = Appt.IDOperatingRoom;
    if (IDRoom != 0) {
      NewIDRoom = IDRoom;
    }

    return new Promise(resolve => {
      let IDBedRoom = 0;
      let RandomNo = this.all.generateRandomNumber(8);

      let Query0 = `Call Run('NewAppointment(${RandomNo},${this.all.User.IDC},${this.all.RegisterData.Branch},${Appt.IDY},${Appt.IDP},${this.all.User.IDP},
      ${NewIDDoctor},0,${Appt.IDAgreement},${Appt.IDPatient},${NewIDRoom},${IDBedRoom},${Appt.IDAnesthetist},
      "${NewADate}","${Appt.Description}",${NewDuration},${Appt.VisitType},
      ${Appt.IDProcedure},
      "${Appt.AttendTime}",
      "${Appt.AttendEnter}",
      "${Appt.AttendOut}",
      ${NewAType},
      0,${Appt.IsOnCall},0,0,0,now(),${this.all.User.IDP},0,"${ProceduresD}","${DescriptionD}")')`;
      let Query1 = `Select Result,WarningMessage,StoredStatus from storedResult where Random=${RandomNo} group by ID order by id desc limit 1`

      let Query = `[${Query0}];${Query1}`;
      console.log(`Query0= `, Query0);
      console.log(`Query1= `, Query1);
      console.log(`Query= `, Query);

      const body = new HttpParams()
        .set('Mtype', 'A16')
        .set('Query', Query);

      this.all.postData(body).then(res => {

        if (res[`Q1Error`] != "") {
          this.all.ngxToast(`Q1Error= `, res[`Q1Error`], `warning`);
          console.log(`Q1Error= `, res[`Q1Error`]);
          resolve(false);
        }

        console.log(`Q0= `, res[`Q0`]);
        console.log(`Q1= `, res[`Q1`]);
        let Result = res[`Q1`][0].Result;
        if (Result > 0 && res[`Q1`][0].StoredStatus == "Done") {
          this.all.ngxToast(`Saved Successfully`, '', 'success');
          // this.modalCtrl.dismiss({ Saved: true }, 'confirm');
          // let appts = this.tblAppt.filter(x => x.IDP == Appt.IDP);
          // for(let a of appts){
          //   // alert(NewADate);
          //   a.Duration = Duration;
          //   a.ADate = NewADate+`:00`;
          //   a.AType = AType;
          //   a.IDDoctor = IDDoctor;
          //   a.IDOperatingRoom = IDRoom;
          //   if (ProceduresD != ``) {
          //     a.IDProcedure = ProceduresD.split(`,`)[0];
          //   }
          // }
          // this.tblAppt.find(x => x.ID == Appt.ID).Duration = Duration;
          // this.tblAppt.find(x => x.ID == Appt.ID).ADate = NewADate;
          // this.tblAppt.find(x => x.ID == Appt.ID).AType = AType;
          // this.tblAppt.find(x => x.ID == Appt.ID).IDDoctor = IDDoctor;
          // this.tblAppt.find(x => x.ID == Appt.ID).IDOperatingRoom = IDRoom;
          // if (ProceduresD != ``) {
          //   this.tblAppt.find(x => x.ID == Appt.ID).IDProcedure = ProceduresD.split(`,`)[0];
          // }

          resolve(true);
        } else {
          this.all.alert(this.apptService.errorSavedResult(`ar`, Result));
          resolve(false);
        }
      });
    });
  }

  CopyData: any = null;
  copyAppt() {
    console.log(`copyAppt= `, this.SelectedSlot);
    this.CopyData = this.SelectedSlot;
  }

  cutAppt() {
    this.hideContextMenu();
    this.CopyData = this.SelectedSlot;
  }

  pastAppt(header = `Attention`) {
    this.hideContextMenu();
    console.log(`SelectedSlot= `, this.SelectedSlot);
    console.log(`CopyData= `, this.CopyData);

    return new Promise(resolve => {
      this.alertController.create({
        header: header,
        message: this.all.translate.instant(`Select the reason for moving this appointment`),
        cssClass: `custom-confirm`,
        inputs: [
          {
            label: this.all.translate.instant(`Patient request`),
            type: 'radio',
            value: 1,
          },
          {
            label: this.all.translate.instant(`Change in doctor`),
            type: 'radio',
            value: 2,
          },
          {
            label: this.all.translate.instant(`Doctor request`),
            type: 'radio',
            value: 3,
          },
        ],
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
            text: `OK`,
            handler: (reson) => {
              console.log('Confirm Okay= ', reson);

              let Resource = this.SelectedSlot.resource.id;
              let AType = 0;
              if (Resource.split(`-`)[1] == "Wait") {
                AType = 1;
              }
              let IDDoctor = Resource.split(`-`)[0];
              let ADate = this.SelectedSlot.startStr;
              // console.log();

              this.updateAppt(this.CopyData.extendedProps, 0, ADate, AType, IDDoctor).then(updated => {
                if (!updated) {
                  this.all.ngxToast(`Operation Failed`, ``, `warning`);
                  this.calendar.unselect();
                } else {
                  // let className = AType == 0 ? 'event-real-class' : 'event-wait-class';
                  // this.calendar.getEventById(info.event.id).setProp('classNames', [className]);
                  this.refreshSchedule();
                  // this.getSechudleData();
                  this.calendar.unselect();
                  this.CopyData = null;
                }
              });

              // resolve(data);
            }
          }
        ]
      }).then((confirm) => {
        confirm.present();
      });
    });
  }


  // addMinutesAndGetTimeWithoutSecound(dateTimeString, minutesToAdd) {
  //   // تحويل تاريخ ووقت النص إلى كائن Date
  //   const date = new Date(dateTimeString);

  //   // إضافة الدقائق المحددة
  //   date.setMinutes(date.getMinutes() + minutesToAdd);

  //   // إرجاع التاريخ والوقت الجديد كسلسلة نصية بتنسيق YYYY-MM-DD HH:MM:SS
  //   const year = date.getUTCFullYear();
  //   const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // إضافة الصفر إلى الشهر إذا كان أقل من رقمين
  //   const day = String(date.getUTCDate()).padStart(2, '0');
  //   const hours = String(date.getUTCHours()).padStart(2, '0');
  //   const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  //   // تنسيق النص الجديد
  //   return `${hours}:${minutes}`;
  // }

  selectNewPatient(ev) {
    // alert(this.all.SubScheduleWindows.Visible);
    if (this.all.SubScheduleWindows.Visible == true) {
      setTimeout(() => {
        this.apptService.getSubWindow(this.all.SubScheduleWindows.No);
      }, 150);
      // sssssssss
    }
  }


  splitSlots(tblSlot) {
    let result = [];

    for (let slot of tblSlot) {
      let startTime = slot.start;
      let endTime = slot.end;

      // تحويل الأوقات إلى دقائق لتسهيل المقارنة
      function timeToMinutes(timeStr) {
        let [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      }

      let startMinutes = timeToMinutes(startTime);
      let endMinutes = timeToMinutes(endTime);

      if (startMinutes > endMinutes) {
        // إذا كان start > end، نقسم العنصر إلى عنصرين
        result.push({
          start: startTime,
          end: "23:59:00"
        });
        result.push({
          start: "00:00:00",
          end: endTime
        });
      } else {
        // إذا كان start <= end، نضيف العنصر كما هو
        result.push(slot);
      }
    }

    return result;
  }

  getFullRows(tblAppointment, tblSlot, tblDelAppt) {
    return new Promise(resolve => {
      const tblRes1 = tblAppointment.map(appointment => {
        const startTime = new Date(appointment.ADate);
        const endTime = new Date(startTime.getTime() + appointment.Duration * 60000); // تحويل الدقائق إلى مللي ثانية

        return {
          start: startTime.toTimeString().split(' ')[0], // الحصول على الوقت فقط بدون التاريخ
          end: endTime.toTimeString().split(' ')[0] // الحصول على الوقت فقط بدون التاريخ
        };
      });

      const tblRes2 = tblSlot.map(slot => {
        // استخراج الوقت من OpenTime (بداية الموعد)
        const startTime = slot.OpenTime;

        // استخراج الوقت من ClosedTime (نهاية الموعد)
        const endTime = slot.ClosedTime.split(' ')[1]; // نأخذ الجزء الثاني من السلسلة (الوقت)

        return {
          start: startTime,
          end: endTime
        };
      });
      // console.log(`tblRes1= `, tblRes1);
      // console.log(`tblRes2= `, tblSlot);

      const tblRes3 = tblDelAppt.map(appointment => {
        const startTime = new Date(appointment.ADate);
        const endTime = new Date(startTime.getTime() + appointment.Duration * 60000); // تحويل الدقائق إلى مللي ثانية

        return {
          start: startTime.toTimeString().split(' ')[0], // الحصول على الوقت فقط بدون التاريخ
          end: endTime.toTimeString().split(' ')[0] // الحصول على الوقت فقط بدون التاريخ
        };
      });


      resolve(tblRes1.concat(this.splitSlots(tblRes2)));
      // resolve(tblRes1.concat(tblRes2));
    });
  }

  zoomCalendar(scale) {

    let timeSlot = document.querySelector('.fc-timegrid-slot[data-time="17:30:00"]');
    if (timeSlot) {
      timeSlot.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // this.calendar.scrollToTime(`17:30`);
    console.log(`result= srcoll`);
    // this.calendar.select({
    //   resourceId: "77-Real",
    //   start: `2025-03-10 17:30:00`, // '2024-12-31 10:15',
    //   end: `2025-03-10 17:40:00`,
    // });

    // setTimeout(() => {
    //   this.calendar.scrollToTime(`17:30`);
    // }, 5000);
    // return;


    // let result = this.calculateOccupancy(this.tblSlots, this.tblAppt);

    // console.log(`result= `, result);
    // console.log(`calculateDoctorMinutes= `, this.calculateWorkMinutes(this.tblSlots));
    // console.log(`calculateMinutesPerDoctorAndRoom= `, this.calculateMinutesPerDoctorAndRoom(this.tblAppt));
    // this.closeEmpty();

    return;
    // let start = this.apptService.changeTime(this.all.CurrentDate, this.all.RegisterData.AdditionalHoursForDay + `:00`);
    // let end = this.apptService.calculateEndTime(start, 15)
    // this.calendar.getEventById(`1377362`).setProp('classNames', ['event-deleted-class']);
    // this.calendar.getEventById(`1377362`).setStart(start);
    // this.calendar.getEventById(`1377362`).setEnd(end);
    // return;
    // document.querySelectorAll('.fc-scrollgrid-section-body tr').forEach(tr => {
    //   tr.setAttribute("style", "height: 100px !important;"); // تغيير الارتفاع
    // });

    //   tblAppt = [];
    // tblSlots = [];
    // console.log(`getFullRows= `, this.getFullRows(this.tblAppt, this.tblSlots));
    // let tblRes = this.getFullRows(this.tblAppt, this.tblSlots);
    // console.log(`searchTime= `, this.searchTime(tblRes, { start: "11:30:00", Duration: 15 }));
    // console.log(`searchTime= `, this.searchTime(tblRes, { start: "22:45:00", Duration: 15 }));
    // console.log(`searchTime= `, this.searchTime(tblRes, { start: "08:45:00", Duration: 30 }));

    // // console.log(this.tblAppt);
    // // console.log(this.tblSlots);
    // return;


    // document.querySelectorAll('tr').forEach(tr => {
    //   const td = tr.querySelector('td[data-time="22:30:00"]'); // البحث عن الخلية التي تحتوي على هذا الوقت فقط
    //   if (td) {
    //     const newHeight = "7px"; // الارتفاع الذي تريده

    //     // تعيين الارتفاع باستخدام !important
    //     tr.setAttribute("style", `height: ${newHeight} !important;`);
    //   }
    // });

    // this.reRender();
    // this.getSechudleData();
    // return;



    // document.querySelectorAll('tr').forEach(tr => {
    //   const td = tr.querySelector('td[data-time]');
    //   if (td) {
    //     const timeValue = td.getAttribute('data-time');
    //     const [hours, minutes] = timeValue.split(':').map(Number);
    //     let t = { start: timeValue, Duration: 15 };
    //     if (this.searchTime(tblRes, t) == false) {
    //       const newHeight = "7px";

    //       tr.setAttribute("style", `height: ${newHeight} !important;`);
    //     }
    //     // تحديد الارتفاع بناءً على الوقت


    //     // تعيين الستايل مع `!important`

    //   }
    // });

    // this.tblAppt = []; this.tblSlots = [];
    // this.reRender();
    // this.getSechudleData();

    // const calendarElement:HTMLElement = document.querySelector('.fc'); // العنصر الرئيسي للتقويم
    // if (calendarElement) {
    //   calendarElement.style.transform = `scale(${scale})`;
    //   calendarElement.style.transformOrigin = 'top left'; // تحديد نقطة التحويل (الزاوية العلوية اليسرى)
    // }


    // console.log(this.CalendarHeight);
    // this.calendar.setOption('height', this.CalendarHeight * 4);
    // this.calendar.setOption('contentHeight', this.CalendarHeight * 4);
    // this.calendar.updateSize();
    // this.calendar.render();
  }



  // generateTimeSlots(tblSlots: any[], intervalMinutes: number): string[] {
  //   let res: string[] = [];

  //   tblSlots.forEach(slot => {
  //     let startDateTime = new Date(`${slot.StartDate}T${slot.OpenTime}`);
  //     let endDateTime = new Date(slot.ClosedTime);

  //     while (startDateTime <= endDateTime) {
  //       res.push(startDateTime.toTimeString().substring(0, 8)); // استخراج HH:MM:SS فقط
  //       startDateTime.setMinutes(startDateTime.getMinutes() + intervalMinutes);
  //     }
  //   });

  //   return res;
  // }

  generateTimeSlots(tblSlots: any[], intervalMinutes: number): string[] {
    let res: string[] = [];

    tblSlots.forEach(slot => {
      let startDateTime = new Date(`${slot.StartDate}T${slot.OpenTime}`);
      let endDateTime = new Date(slot.ClosedTime);

      // تقليل النهاية بمقدار 5 دقائق
      endDateTime.setMinutes(endDateTime.getMinutes() - intervalMinutes);

      while (startDateTime <= endDateTime) {
        res.push(startDateTime.toTimeString().substring(0, 8)); // استخراج HH:MM:SS فقط
        startDateTime.setMinutes(startDateTime.getMinutes() + intervalMinutes);
      }
    });

    return res;
  }

  generateAppointmentSlots(tblAppt: any[], intervalMinutes: number): string[] {
    let res: string[] = [];

    tblAppt.forEach(appt => {
      let startDateTime = new Date(appt.ADate);
      let endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + appt.Duration);

      while (startDateTime < endDateTime) {
        res.push(startDateTime.toTimeString().substring(0, 8)); // استخراج HH:MM:SS فقط
        startDateTime.setMinutes(startDateTime.getMinutes() + intervalMinutes);

        // إذا كانت الإضافة ستصل إلى نهاية `endDateTime` تمامًا، فلا نضيفها
        if (startDateTime >= endDateTime) break;
      }
    });

    return res;
  }

  // generateAppointmentSlots(tblAppt: any[], intervalMinutes: number): string[] {
  //   let res: string[] = [];

  //   tblAppt.forEach(appt => {
  //     let startDateTime = new Date(appt.ADate);
  //     let endDateTime = new Date(startDateTime);
  //     endDateTime.setMinutes(endDateTime.getMinutes() + appt.Duration);

  //     while (startDateTime <= endDateTime) {
  //       res.push(startDateTime.toTimeString().substring(0, 8)); // استخراج HH:MM:SS فقط
  //       startDateTime.setMinutes(startDateTime.getMinutes() + intervalMinutes);
  //     }
  //   });

  //   return res;
  // }

  removeDuplicates(timeArray) {
    // استخدام Set لإزالة التكرارات
    let uniqueTimes = [...new Set(timeArray)];
    return uniqueTimes;
  }


  IsCloseEmpty = true;
  closeEmpty() {
    // alert(`closeEmpty`);
    return new Promise(resolve => {
      if (!this.IsCloseEmpty) {
        resolve(true);
      }
      console.log(this.tblSlots);
      let resSlot = this.generateTimeSlots(this.tblSlots, 5);
      let apptSlot1 = this.generateAppointmentSlots(this.tblAppt, 5);
      let apptSlot2 = this.generateAppointmentSlots(this.tblDeletedAppt, 5);
      let res1 = resSlot.concat(apptSlot1, apptSlot2);
      let res = this.removeDuplicates(res1);
      // console.log(`resSlots = `, res);
      // alert(2);

      document.querySelectorAll('tr').forEach(tr => {
        const td = tr.querySelector('td[data-time]');
        if (td) {
          // console.log(`this.searchTime(tblRes, t)`);
          const timeValue = td.getAttribute('data-time');
          if (res.filter(x => x == timeValue).length == 0) {
            tr.style.cssText = "height: 0 !important; font-size: 0 !important;";
          } else {
            tr.style.cssText = "height: 50px !important; font-size: 12px !important;";
          }
        }
      });

      this.reRender(155, true);
      // this.calendar.render();

      setTimeout(() => {
        resolve(true);
      }, 500);

    });
  }
  // closeEmpty2() {

  //   // let t4 = { start: "18:00:00", Duration: 15 };
  //   // console.log(`ssss= `, this.isTimeInRange(this.tblTemp, t4));
  //   // return;


  //   return new Promise(resolve => {
  //     if (!this.IsCloseEmpty) {
  //       resolve(true);
  //     }

  //     // console.log(`getFullRows= `, this.getFullRows(this.tblAppt, this.tblSlots));
  //     this.getFullRows(this.tblAppt, this.tblSlots, this.tblDeletedAppt).then(tblRes => {
  //       console.log("tblRes= ", tblRes);
  //       document.querySelectorAll('tr').forEach(tr => {
  //         const td = tr.querySelector('td[data-time]');
  //         // console.log("td= ", td);
  //         if (td) {
  //           // console.log(`this.searchTime(tblRes, t)`);
  //           const timeValue = td.getAttribute('data-time');
  //           const [hours, minutes] = timeValue.split(':').map(Number);
  //           let t = { start: timeValue, Duration: this.AppointmentMinPeriod };
  //           // console.log(t);
  //           if (this.isTimeInRange(tblRes, t) == false) {

  //             // console.log("7px");
  //             // const newHeight = "7px";
  //             // tr.setAttribute("style", `height: 7px !important;`);
  //             // tr.setAttribute("style", `font-size: 7px !important;`);
  //             tr.style.cssText = "height: 7px !important; font-size: 7px !important;";
  //           } else {
  //             if (timeValue == "14:45:00") {
  //               alert(JSON.stringify(t));
  //             }
  //             console.log("7777777777px");
  //             tr.style.cssText = "height: 50px !important; font-size: 12px !important;";

  //             // tr.setAttribute("style", `height: 70px !important;`);
  //           }
  //         }
  //       });

  //       setTimeout(() => {
  //         this.reRender();

  //         setTimeout(() => {
  //           resolve(true);
  //         }, 500);
  //         // this.getSechudleData();
  //       }, 500);

  //       // this.reRender();
  //       // this.calendar.render();
  //       // this.calendar.gotoDate(this.all.CurrentDate);

  //     });
  //     // alert(tblRes.length);


  //   });
  // }

  // isTimeInRange(tblRes, t) {
  //   let tStart = new Date(`1970-01-01T${t.start}`);
  //   let tEnd = new Date(tStart); // إنشاء نسخة من `tStart`
  //   tEnd.setMinutes(tEnd.getMinutes() + t.Duration);

  //   return tblRes.some(({ start, end }) => {
  //     let rangeStart = new Date(`1970-01-01T${start}`);
  //     let rangeEnd = new Date(`1970-01-01T${end}`);

  //     return tStart < rangeEnd && tEnd > rangeStart;
  //   });

  //   // let tStart = t.start;
  //   // let tEnd: any = new Date(`1970-01-01T${tStart}`);
  //   // tEnd.setMinutes(tEnd.getMinutes() + t.Duration);
  //   // tEnd = tEnd.toTimeString().split(' ')[0]; // استخراج HH:MM:SS فقط

  //   // return tblRes.some(({ start, end }) => tStart < end && tEnd > start);
  // }

  // timeToMinutes(time) {
  //   const [hours, minutes, seconds] = time.split(':').map(Number);
  //   return hours * 60 + minutes; // تجاهل الثواني
  // }

  // searchTime(tblTimes, search) {
  //   const { start, Duration } = search;

  //   // تحويل وقت البدء إلى دقائق
  //   const startMinutes = this.timeToMinutes(start);

  //   // حساب وقت النهاية
  //   const endMinutes = startMinutes + Duration;

  //   // التحقق من التداخل مع أي نطاق في tblTimes
  //   for (const range of tblTimes) {
  //     const rangeStart = this.timeToMinutes(range.start);
  //     const rangeEnd = this.timeToMinutes(range.end);

  //     // التحقق من التداخل
  //     if (
  //       (startMinutes >= rangeStart && startMinutes < rangeEnd) || // بداية البحث ضمن النطاق
  //       (endMinutes > rangeStart && endMinutes <= rangeEnd) || // نهاية البحث ضمن النطاق
  //       (startMinutes <= rangeStart && endMinutes >= rangeEnd) // البحث يغطي النطاق بالكامل
  //     ) {
  //       return true; // يوجد تداخل
  //     }
  //   }

  //   return false; // لا يوجد تداخل
  // }

  getAvailableAreaList(IsDoctor = false) {
    // this.SelectedSlot.resource.id
    // alert(this.SelectedSlot.start);
    // console.log(this.all.getDateTimeWithoutSecound(this.SelectedSlot.start));
    let Start = this.datetimeService.getDateTimeWithoutSecound(this.SelectedSlot.start);
    let Duration = this.apptService.getDurationInMinutes(new Date(this.SelectedSlot.start), new Date(this.SelectedSlot.end));





    let Query = ``;
    if (IsDoctor) {
      let IDDoctor = this.SelectedSlot.resource.id.split(`-`)[0];
      Query = `call AvailableAreaList(${this.all.User.IDC},${this.all.RegisterData.Branch},${IDDoctor},0,"${Start}",${Duration})`;
    } else {
      let IDOperatingRoom = this.SelectedSlot.resource.id.split(`-`)[0];
      Query = `call AvailableAreaList(${this.all.User.IDC},${this.all.RegisterData.Branch},0,${IDOperatingRoom},"${Start}",${Duration})`;

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
      if (res[`Q0`].length > 0) {
        this.availableAreaListDoctors(IsDoctor, res[`Q0`]);
      } else {
        this.all.ngxToast(`There are no doctors available at this time for this room`, ``, `warning`);
      }
    });
  }

  async availableAreaListDoctors(IsDoctor, tblItem) {
    let tblInput = [];
    for (let dd of tblItem) {
      if (IsDoctor) {
        if (this.all.tblRooms.filter(x => x.IDP == dd.IDOperatingRoom).length > 0) {
          let Room = this.all.tblRooms.filter(x => x.IDP == dd.IDOperatingRoom)[0];

          tblInput.push({
            label: Room[`Name` + this.all.LangLetter],
            type: 'radio',
            value: dd.IDOperatingRoom,
          });
        }
      } else {
        if (this.all.tblDoctors.filter(x => x.IDP == dd.IDDoctor).length > 0) {
          let Doc = this.all.tblDoctors.filter(x => x.IDP == dd.IDDoctor)[0];

          tblInput.push({
            label: Doc[`Name` + this.all.LangLetter],
            type: 'radio',
            value: dd.IDDoctor,
          });
        }
      }


    }

    console.log(`tblButton= `, tblInput);

    const alert = await this.alertController.create({
      header: this.all.translate.instant(`Dr/TC Available by Area`), // `د/أ المتاحين حسب المنطقة`
      // subHeader: subHeader,
      // message: message,
      buttons: [
        {
          text: this.all.translate.instant(`Cancel`),
          cssClass: 'alert-button-cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: this.all.translate.instant(`Create`),
          cssClass: 'alert-button-confirm',
          handler: (IDSelected) => {
            console.log('IDDoctor: ', IDSelected);
            if (IDSelected != undefined) {
              if (IsDoctor) {
                this.newApp(true, 0, null, 0, 0, IDSelected);
              } else {
                this.newApp(true, 0, null, IDSelected);
              }

              // IDOperatingRoom ssss
              // console.log(3);
            }
          }
        },
      ],
      inputs: tblInput,
      cssClass: 'alert-class',
    });
    await alert.present();
  }

  applyHighlight(apptId: string, add: boolean) {
    const elements = document.querySelectorAll(`.event-container.appt-${apptId}`);
    elements.forEach((el) => {
      (el as HTMLElement).style.boxShadow = add ? "0px 0px 7px 1px rgba(100, 100, 100, 0.75)" : "none";
    });
  }



  // zoomCalendarRowTime(scale) { // تغيير حجم الخط في السطر
  //   const elementsToScale = document.querySelectorAll('.fc-timegrid-slot, .fc-timegrid-slot-label, .fc-event, .fc-header-toolbar');
  //   elementsToScale.forEach(element => {
  //     if (element instanceof HTMLElement) {
  //       const currentFontSize = window.getComputedStyle(element).fontSize;
  //       const newFontSize = parseFloat(currentFontSize) * scale;
  //       element.style.fontSize = `${newFontSize}px`;

  //       if (element.classList.contains('fc-timegrid-slot')) {
  //         element.style.lineHeight = `${newFontSize * 1.2}px`; // تعديل line-height إذا لزم الأمر
  //       }
  //     }
  //   });
  // }


  getSchedulePercent(tblAppt, tblSlot) {



    let tblWorkTimes = this.calculateWorkMinutes(tblSlot);
    let tblBookedTimes: any = this.calculateMinutesPerDoctorAndRoom(tblAppt);
    console.log(`tblWorkTimes= `, tblWorkTimes);
    console.log(`tblBookedTimes= `, tblBookedTimes);
    // aaaaaaaaaaaaa

    return;




    for (let t of tblBookedTimes) {
      let percentReal = null;
      let percentWait = null;
      if (t.IDDoctor) {
        if (tblWorkTimes[t.IDDoctor] && tblWorkTimes[t.IDDoctor][t.Day] && tblWorkTimes[t.IDDoctor][t.Day].RealApp > 0) {
          percentReal = (t.AType0 / tblWorkTimes[t.IDDoctor][t.Day].RealApp);
          percentWait = (t.AType0 / tblWorkTimes[t.IDDoctor][t.Day].WaitingApp);
        };

        this.tblDayColumn.push({
          IDDoctor: t.IDDoctor,
          Day: t.Day,
          AType: 0,
          Percent: percentReal,
        });


        this.tblDayColumn.push({
          IDDoctor: t.IDDoctor,
          Day: t.Day,
          AType: 1,
          Percent: percentWait,
        });
      } else if (t.IDOperatingRoom) {
        if (tblWorkTimes[t.IDDoctor] && tblWorkTimes[t.IDDoctor][t.Day] && tblWorkTimes[t.IDDoctor][t.Day].RealApp > 0) {
          percentReal = (t.AType0 / tblWorkTimes[t.IDDoctor][t.Day].RealApp);
          percentWait = (t.AType0 / tblWorkTimes[t.IDDoctor][t.Day].WaitingApp);
        };
      }

    }

    console.log(`this.tblDayColumn= `, this.tblDayColumn);


    // let percent = null;
    // if(tblWorkTimes[2]&& tblWorkTimes[2][`2025-03-06`] && tblBookedTimes.filter(x => x.IDDoctor == 2 && x.Day == `2025-03-06`).length>0){
    //   let realTime = tblWorkTimes[2][`2025-03-06`].RealApp;
    //   let worked = tblBookedTimes.filter(x => x.IDDoctor == 2 && x.Day == `2025-03-06`)[0].AType0;
    //   percent = (worked / realTime) * 100;
    //   alert(percent);

    // }

  }

  calculateMinutesPerDoctorAndRoom(tblAppointment) {
    const result = {};

    tblAppointment.forEach(appt => {
      let startDate: any = new Date(appt.ADate);
      let endDate: any = new Date(startDate.getTime() + appt.Duration * 60000);

      let dayKey = new Date(startDate);
      dayKey.setHours(5, 0, 0, 0); // اليوم يبدأ الساعة 05:00 صباحًا
      let dayStr = dayKey.toISOString().split('T')[0];

      let doctorKey = `${dayStr}_Doctor_${appt.IDDoctor}`;
      let roomKey = `${dayStr}_Room_${appt.IDOperatingRoom}`;

      if (!result[doctorKey]) result[doctorKey] = { IDDoctor: appt.IDDoctor, Day: dayStr, AType0: 0, AType1: 0 };
      if (!result[roomKey]) result[roomKey] = { IDOperatingRoom: appt.IDOperatingRoom, Day: dayStr, AType0: 0, AType1: 0 };

      let minutes = (endDate - startDate) / 60000;

      if (appt.AType === 0) {
        result[doctorKey].AType0 += minutes;
        result[roomKey].AType0 += minutes;
      } else {
        result[doctorKey].AType1 += minutes;
        result[roomKey].AType1 += minutes;
      }
    });

    return Object.values(result);
  }
  // calculateDoctorMinutes(tblSlot) {
  //   let result = {};

  //   tblSlot.forEach(slot => {
  //     let doctorId = slot.IDDoctor;
  //     let startTime = new Date(`${slot.StartDate}T${slot.OpenTime}`);
  //     let endTime = new Date(slot.ClosedTime);

  //     while (startTime < endTime) {
  //       let dayKey = new Date(startTime);
  //       dayKey.setHours(5, 0, 0, 0); // ضبط بداية اليوم على 05:00
  //       let dayString = dayKey.toISOString().split('T')[0];

  //       if (!result[doctorId]) {
  //         result[doctorId] = {};
  //       }
  //       if (!result[doctorId][dayString]) {
  //         result[doctorId][dayString] = { RealApp: 0, WaitingApp: 0 };
  //       }

  //       result[doctorId][dayString].RealApp += (slot.RealApp ? 5 : 0);
  //       result[doctorId][dayString].WaitingApp += (slot.WaitingApp ? 5 : 0);

  //       startTime.setMinutes(startTime.getMinutes() + 5);
  //     }
  //   });

  //   return result;
  // }
  calculateWorkMinutes(tblSlot) {
    let doctorResult = {};
    let roomResult = {};

    tblSlot.forEach(slot => {
      let doctorId = slot.IDDoctor;
      let roomId = slot.IDOperatingRoom;
      let startTime = new Date(`${slot.StartDate}T${slot.OpenTime}`);
      let endTime = new Date(slot.ClosedTime);

      while (startTime < endTime) {
        let dayKey = new Date(startTime);
        dayKey.setHours(5, 0, 0, 0); // ضبط بداية اليوم على 05:00
        let dayString = dayKey.toISOString().split('T')[0];

        // حساب دقائق الطبيب
        if (!doctorResult[doctorId]) {
          doctorResult[doctorId] = {};
        }
        if (!doctorResult[doctorId][dayString]) {
          doctorResult[doctorId][dayString] = { RealApp: 0, WaitingApp: 0 };
        }

        doctorResult[doctorId][dayString].RealApp += (slot.RealApp ? 5 : 0);
        doctorResult[doctorId][dayString].WaitingApp += (slot.WaitingApp ? 5 : 0);

        // حساب دقائق غرفة العمليات
        if (!roomResult[roomId]) {
          roomResult[roomId] = {};
        }
        if (!roomResult[roomId][dayString]) {
          roomResult[roomId][dayString] = { RealApp: 0, WaitingApp: 0 };
        }

        roomResult[roomId][dayString].RealApp += (slot.RealApp ? 5 : 0);
        roomResult[roomId][dayString].WaitingApp += (slot.WaitingApp ? 5 : 0);

        startTime.setMinutes(startTime.getMinutes() + 5);
      }
    });

    return { doctorResult, roomResult };
  }


  calculateOccupancy(tblSlot, tblAppointment) {
    return new Promise(resolve => {
      let doctorSchedule = {};
      let roomSchedule = {};

      // 1️⃣ حساب دقائق الدوام لكل طبيب وغرفة عمليات
      tblSlot.forEach(slot => {
        let doctorId = slot.IDDoctor;
        let roomId = slot.IDOperatingRoom;
        let startTime = new Date(`${slot.StartDate}T${slot.OpenTime}`);
        let endTime = new Date(slot.ClosedTime);

        while (startTime < endTime) {
          let dayKey = new Date(startTime);
          dayKey.setHours(5, 0, 0, 0); // ضبط بداية اليوم على 05:00
          let dayString = dayKey.toISOString().split('T')[0];

          if (!doctorSchedule[doctorId]) doctorSchedule[doctorId] = {};
          if (!doctorSchedule[doctorId][dayString]) {
            doctorSchedule[doctorId][dayString] = { TotalMinutes: 0, RealApp: 0, WaitingApp: 0 };
          }
          if (!roomSchedule[roomId]) roomSchedule[roomId] = {};
          if (!roomSchedule[roomId][dayString]) {
            roomSchedule[roomId][dayString] = { TotalMinutes: 0, RealApp: 0, WaitingApp: 0 };
          }

          doctorSchedule[doctorId][dayString].TotalMinutes += 5;
          roomSchedule[roomId][dayString].TotalMinutes += 5;

          startTime.setMinutes(startTime.getMinutes() + 5);
        }
      });

      // 2️⃣ حساب دقائق المواعيد لكل طبيب وغرفة عمليات
      tblAppointment.forEach(appointment => {
        let doctorId = appointment.IDDoctor;
        let roomId = appointment.IDOperatingRoom;
        let startTime = new Date(appointment.ADate);
        let duration = appointment.Duration;

        let dayKey = new Date(startTime);
        dayKey.setHours(this.all.RegisterData.AdditionalHoursForDay, 0, 0, 0);
        let dayString = dayKey.toISOString().split('T')[0];

        let typeKey = appointment.AType === 0 ? "RealApp" : "WaitingApp";

        if (doctorSchedule[doctorId] && doctorSchedule[doctorId][dayString]) {
          doctorSchedule[doctorId][dayString][typeKey] += duration;
        }
        if (roomSchedule[roomId] && roomSchedule[roomId][dayString]) {
          roomSchedule[roomId][dayString][typeKey] += duration;
        }
      });

      // 3️⃣ حساب نسبة الامتلاء
      function calculatePercentage(schedule) {
        let result = {};
        Object.keys(schedule).forEach(id => {
          result[id] = {};
          Object.keys(schedule[id]).forEach(day => {
            let { TotalMinutes, RealApp, WaitingApp } = schedule[id][day];
            result[id][day] = {
              // RealAppPercentage: (RealApp / TotalMinutes * 100).toFixed(2) + "%",
              // WaitingAppPercentage: (WaitingApp / TotalMinutes * 100).toFixed(2) + "%",

              RealAppPercentage: (RealApp / TotalMinutes).toFixed(2),
              WaitingAppPercentage: (WaitingApp / TotalMinutes).toFixed(2),
            };
          });
        });
        return result;
      }

      resolve({
        doctorOccupancy: calculatePercentage(doctorSchedule),
        roomOccupancy: calculatePercentage(roomSchedule)
      });
    });
  }

  patientFilePage() {
    this.hideContextMenu();
    console.log(this.SelectedSlot.extendedProps.IDPatient);
    this.nav.navigateForward(`patient-file/${this.SelectedSlot.extendedProps.IDPatient}`);
  }

  ConfirmPhone = '';
  tblConfirmPhone = [];
  tblConfirm = [];
  ConfirmPatient;
  ConfirmAppt;
  IsConfirmPatientBox = false;
  ConfirmAnswer = 0;
  getConfirmData() {
    this.hideContextMenu();
    console.log(this.SelectedSlot);
    this.ConfirmAppt = this.SelectedSlot;

    // console.log(`title= `, this.SelectedSlot._def.title);
    // this.calendar.getEventById(this.ConfirmAppt.id);
    // return;



    let Query0 = `select * from Patients where IDC=${this.all.User.IDC} and IDP=${this.SelectedSlot.extendedProps.IDPatient}`;
    let Query1 = `SELECT c.*
      FROM appointmentsconfirm c
      Inner join appointments a on a.idc=c.idc and a.idp=c.IDAppointment
      where c.IDC=${this.all.User.IDC} and c.IDAppointment=${this.SelectedSlot.extendedProps.IDP} and (a.AType<>2 or a.IDPatient<>0 or c.IDPatient=${this.SelectedSlot.extendedProps.IDPatient})`;
    let Query = `${Query0};${Query1}`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body, false).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }
      if (res[`Q1Error`] != "") {
        this.all.ngxToast(`Q1Error= `, res[`Q1Error`], `warning`);
        console.log(`Q1Error= `, res[`Q1Error`]);
      }

      this.ConfirmPatient = res[`Q0`][0];
      this.tblConfirm = res[`Q1`];
      this.ConfirmAnswer = 0;
      this.IsConfirmPatientBox = true;
      this.ConfirmPhone = this.ConfirmPatient.Phon1;
      this.tblConfirmPhone = [this.ConfirmPatient.Phon1];
      // this.tblConfirmPhone.push([`99533551`]);
      // this.tblConfirmPhone.push([`kays had`]);
      // this.tblConfirmPhone.push([`Salmen Habra`]);
      if (this.ConfirmPatient.Phon2 != ``) {
        this.tblConfirmPhone.push(this.ConfirmPatient.Phon2);
      }
      if (this.ConfirmPatient.Phon3 != ``) {
        this.tblConfirmPhone.push(this.ConfirmPatient.Phon3);
      }
    });
  }

  saveConfirm() {
    // alert(this.ConfirmAnswer);
    if (this.ConfirmAnswer == 0) {
      return;
    }
    let Query0 = `insert into appointmentsconfirm
    ( IDC, IDP, IDBranch, IDY, IDUser, IDAppointment, IDPatient, ADate, Phon, PhonType, PhonFieldNo, Status)
    values
      (${this.all.User.IDC}, '0', ${this.all.RegisterData.Branch}, ${this.all.RegisterData.FinancialYear}, ${this.all.User.IDP}, ${this.ConfirmAppt.extendedProps.IDP}, ${this.ConfirmAppt.extendedProps.IDPatient}, 
      now(), '${this.ConfirmPhone}', '8', '1', '${this.ConfirmAnswer}')
    `;

    let Query = `[${Query0}]`;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body, false).then(res => {
      console.log(`res= `, res)
      if (res[`Q0Error`] != "" && res[`Q0Error`] != `InternalDataSet: Cursor not returned from Query`) {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }


      // Answer  ConfirmCount  ConfirmCount1  ConfirmDate  ConfirmStatus
      // this.calendar.getEventById(this.ConfirmAppt.id).remove();
      // this.tblAppt.find(x => x.ID == this.ConfirmAppt.id).ConfirmStatus = this.ConfirmAnswer;
      // this.tblAppt.find(x => x.ID == this.ConfirmAppt.id).ConfirmCount = +this.tblAppt.find(x => x.ID == this.ConfirmAppt.id).ConfirmCount + 1;
      // // alert(JSON.stringify(this.tblAppt.find(x=>x.ID == this.ConfirmAppt.id)));
      // // alert(JSON.stringify(this.tblEvents.filter(x => x.id == this.ConfirmAppt.id)));
      // this.tblEvents = this.tblEvents.filter(x => x.id != this.ConfirmAppt.id);
      // this.addApptToSchedule(this.tblAppt.filter(x => x.ID == this.ConfirmAppt.id));
      // setTimeout(() => {
      //   this.calendar.addEvent(this.tblEvents.find(x => x.id == this.ConfirmAppt.id));
      // }, 500);
      this.refreshSchedule();


      this.tblConfirm = [];
      this.ConfirmPatient;
      this.ConfirmAppt;
      this.ConfirmAnswer = 0;
      this.ConfirmPhone = '';
      this.tblConfirmPhone = [];
      this.IsConfirmPatientBox = false;
    });

    // insert into `appointmentsconfirm`
    //   (`ID`, `IDC`, `IDP`, `IDBranch`, `IDY`, `IDUser`, `IDAppointment`, `IDPatient`, `ADate`, `Phon`, `PhonType`, `PhonFieldNo`, `Status`)
    // values
    //   ('0', '1', '0', '1', '11', '17', '101199373', '100357137', '2025-3-8 21:5:3', '0553921134', '8', '1', '2')
    // ;

    // insert into `appointmentsconfirm`
    //   (`ID`, `IDC`, `IDP`, `IDBranch`, `IDY`, `IDUser`, `IDAppointment`, `IDPatient`, `ADate`, `Phon`, `PhonType`, `PhonFieldNo`, `Status`)
    // values
    //   ('0', '1', '0', '1', '11', '17', '101199373', '100357137', '2025-3-8 21:6:1', '0553921134', '8', '1', '3')
    // ;

    //     -- _____________________
    // SET AUTOCOMMIT=0; -- ,0,51 
    // -- _____________________
    // BEGIN WORK; -- ,0,51 
    // -- _____________________
    // insert into `appointmentsconfirm`
    //   (`ID`, `IDC`, `IDP`, `IDBranch`, `IDY`, `IDUser`, `IDAppointment`, `IDPatient`, `ADate`, `Phon`, `PhonType`, `PhonFieldNo`, `Status`)
    // values
    //   ('0', '1', '0', '1', '11', '17', '101192556', '100306342', '2025-3-8 19:40:24', '0555807702', '8', '1', '1')
    // ; -- ,0,51 
    // -- _____________________
    // COMMIT; -- ,0,51 
    // -- _____________________
    // SET AUTOCOMMIT=1; -- ,0,51 
    // -- _____________________
    // Call AddToUserSession1(173,"2307078464","172.28.128.1",17,"2094,266,266,266,2094","2008,5991,5991,5991,2098","1,1,1,1,1","11,11,11,11,11","1,1,1,1,1","0,0,0,0,0","0,0,0,0,0","0,0,0,0,0","0,0,0,0,0","Open,Devloper Testing On,Devloper Testing Off,Devloper Testing On,New Confirm For IDAppointment=101192556","0,0,0,0,2"); 
  }

  isSelectedDoctor() {
    // console.log(this.SelectedSlot?.resource.DoctorData?.IDDoctor);
    return this.SelectedSlot?.resource?.extendedProps?.DoctorData?.IDDoctor > 0;
  }

  IsShowBalloonHint = false;
  showBalloonHint() {
    this.IsShowBalloonHint = !this.IsShowBalloonHint;
    const tooltips = document.querySelectorAll('.tooltiptext');
    if (this.IsShowBalloonHint) {
      tooltips.forEach((tooltip: any) => {
        tooltip.style.display = 'block';  // أو tooltip.style.visibility = 'visible';
      });
    } else {
      tooltips.forEach((tooltip: any) => {
        tooltip.style.display = 'none';  // أو استخدام tooltip.style.visibility = 'hidden';
      });
    }
  }

  IsShowWalkAppt = true;
  showWalkAppt() {
    let tblWalkin = [];
    this.IsShowWalkAppt = !this.IsShowWalkAppt;
    // alert(this.IsShowWalkAppt)
    if (this.IsShowWalkAppt) {
      for (let a of this.tblAppt.filter(x => x.AType == 3)) {
        // this.calendar.getEventById(a.ID).remove();
        if (!this.calendar.getEventById(a.ID)) {
          tblWalkin.push(a);
        }
      }
      this.addApptToSchedule(tblWalkin, false, true);
    } else {
      for (let a of this.tblAppt.filter(x => x.AType == 3)) {
        this.calendar.getEventById(a.ID).remove();
      }
    }

    // const walkinappts = document.querySelectorAll('.event-walkin-class');
    // if (this.IsShowBalloonHint) {
    //   walkinappts.forEach((tooltip: any) => {
    //     tooltip.style.display = 'block';  // أو tooltip.style.visibility = 'visible';
    //   });
    // } else {
    //   walkinappts.forEach((tooltip: any) => {
    //     tooltip.style.display = 'none';  // أو استخدام tooltip.style.visibility = 'hidden';
    //   });
    // }
  }

  showDeleted() {
    this.IsShowDeleted = !this.IsShowDeleted;
    console.log(`this.IsShowDeleted= `, this.IsShowDeleted, this.tblDeletedAppt);
    if (this.IsShowDeleted) {
      this.addApptToSchedule(this.tblDeletedAppt, true, true);
    } else {
      for (let apt of this.tblDeletedAppt) {
        // alert(apt.ID);
        if (this.calendar.getEventById(apt.ID)) {
          this.calendar.getEventById(apt.ID).remove();
        }

        // this.calendar.getEventById(apt.ID).remove();
      }
    }
  }
}
