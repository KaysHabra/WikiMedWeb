import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AllService } from 'src/app/services/all.service';
import { DatetimeService } from 'src/app/services/datetime.service';

@Component({
  selector: 'app-schedule-time',
  templateUrl: './schedule-time.page.html',
  styleUrls: ['./schedule-time.page.scss'],
})
export class ScheduleTimePage implements OnInit {
  tblTemp = [
      {
        ID: 1, Name: `Kays`, BirthDay: `1980-01-20`,
      },
      {
        ID: 20, Name: `Samer`, BirthDay: `1982-01-20`,
      },
      {
        ID: 3, Name: `Malek`, BirthDay: `2002-03-20`,
      },
      {
        ID: 4, Name: `maher`, BirthDay: `1982-01-20`,
      }
    ];
  
  
    LSort = {
      sortBy: ``, order: ``,
    };
    getSortedIndices(
      sourceArray: any[],          // المصفوفة المصدر
      sortBy: string,             // الحقل المراد الفرز حسبه
      order: 'asc' | 'desc' = 'asc', // الترتيب
      isDate: boolean = false
    ): number[] {
      if (this.LSort.sortBy == sortBy) {
        if (this.LSort.order == `asc`) { order = `desc` }
        else { order = `asc` }
      }
      this.LSort = {
        sortBy: sortBy, order: order
      };
      // إنشاء مصفوفة المؤشرات [0, 1, 2, ...]
      const indices = Array.from({ length: sourceArray.length }, (_, i) => i);
  
      indices.sort((a, b) => {
        const valueA = sourceArray[a][sortBy];
        const valueB = sourceArray[b][sortBy];
  
        // معالجة القيم الفارغة
        if (valueA == null) return order === 'asc' ? 1 : -1;
        if (valueB == null) return order === 'asc' ? -1 : 1;
  
        // معالجة التواريخ
        if (isDate || valueA instanceof Date) {
          const dateA = new Date(valueA).getTime();
          const dateB = new Date(valueB).getTime();
          return order === 'asc' ? dateA - dateB : dateB - dateA;
        }
  
        // معالجة النصوص (حالة غير حساسة للأحرف)
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return order === 'asc'
            ? valueA.toLowerCase().localeCompare(valueB.toLowerCase())
            : valueB.toLowerCase().localeCompare(valueA.toLowerCase());
        }
  
        // معالجة الأرقام والقيم الأخرى
        return order === 'asc'
          ? valueA > valueB ? 1 : -1
          : valueA > valueB ? -1 : 1;
      });
  
      return indices;
    }
    // tblTempSort = this.getSortedIndices(this.tblTemp, 'ID', 'asc');
    tblTempSort =  Array.from({ length: this.tblTemp.length }, (_, i) => i);
  
  
  
    tblSelectedDoctor = []; tblSelectedRoom = [];
    SearchDoctor = [];
    SearchRoom = [];
  
  
  
    tblTimes = [];
    IsCreatedFromDate = false; IsCreatedToDate = false;
    IsStartdDateFrom = true; IsStartdDateTo = true;
    Search = {
      CreatedFromDate: this.all.getDateNow(`-`),
      CreatedToDate: this.all.getDateNow(`-`),
  
      StartDateFrom: this.all.getDateNow(`-`),
      StartDateTo: this.all.getDateNow(`-`),
    };
    IsDoctorModal = false;
    IsRoomModal = false;
    SegmentNo = 1;
  
  
  
  
  
  
    ShiftNo = 1;
    WaitingApp = false;
    RealApp = true;
    ScheduleDisplay = false;
    PageName = `Doctors`;
    IDBranch = 0;
    SechduleData = {
      CreatedFromDate: this.all.getDateNow(`-`),
      CreatedToDate: this.all.getDateNow(`-`),
    };
    min = 96; max = 400;
    markerValue: number = 288; // القيمة المستهدفة
    markerPosition: number = 0;
    GeneralShift = {
      RealSchudel: false,
      WaitingSchudel: false,
      FromDate: this.all.getDateNow(`-`),
      ToDate: this.all.getDateNow(`-`),
  
      Sunday: { // 1
        Active: true,
        Range: {
          lower: 150,
          upper: 300
        }
      },
      Monday: {
        Active: true,
        Range: {
          lower: 150,
          upper: 300
        }
      },
      Tuesday: {
        Active: false,
        Range: {
          lower: 150,
          upper: 300
        }
      },
      Wednesday: {
        Active: false,
        Range: {
          lower: 150,
          upper: 300
        }
      },
      Thursday: {
        Active: false,
        Range: {
          lower: 150,
          upper: 300
        }
      },
      Friday: {
        Active: false,
        Range: {
          lower: 150,
          upper: 300
        }
      },
      Saturday: {
        Active: true,
        Range: {
          lower: 100,
          upper: 200
        }
      },
    };
  
    constructor(public all: AllService, private modalController: ModalController, private datetime: DatetimeService) { }
  
    ngOnInit() {
      this.all.getfirstLoad().then(res => {
        if (res) {
          this.IDBranch = this.all.RegisterData.Branch;
          let AdditionalHoursForDay = this.all.RegisterData.AdditionalHoursForDay;
          this.min = (+AdditionalHoursForDay * 60 / 5);
          this.max = (+AdditionalHoursForDay * 60 / 5) + 288;
          this.ScheduleDisplay = true;
        }
      });
    }
    ionViewWillLeave() {
      this.modalController.dismiss();
    }
  
    removeRoom(item) {
      this.tblSelectedRoom = this.tblSelectedRoom.filter(x => x != item.IDP);
      console.log(item);
    }
    removeDoctor(item) {
      this.tblSelectedDoctor = this.tblSelectedDoctor.filter(x => x != item.IDP);
      console.log(item);
    }
  
    setValue(ev) {
      console.log(ev);
    }
  
    delete(IDDoctors, IDOperatingRooms) {
      return new Promise(resolve => {
        let RandomNo = this.all.generateRandomNumber(8);
        // let Query0 = `Call Run('DeleteSchedulePeriod(${RandomNo},${this.all.User.IDP},${this.all.User.IDC},"${IDDoctors}","${IDOperatingRooms}","1,2,3,4,5,6,7", ${this.ShiftNo} ,"${this.SechduleData.CreatedFromDate}","${this.SechduleData.CreatedToDate}","${this.all.RegisterData.AdditionalHoursForDay.length == 2 ? this.all.RegisterData.AdditionalHoursForDay : '0' + this.all.RegisterData.AdditionalHoursForDay}:00:00","${this.SechduleData.CreatedToDate} ${this.all.RegisterData.AdditionalHoursForDay.length == 2 ? this.all.RegisterData.AdditionalHoursForDay : '0' + this.all.RegisterData.AdditionalHoursForDay}:00:00"
        // ,1 -- State
        // ,${this.RealApp == true ? '1' : '0'} -- RealApp
        // ,${this.WaitingApp == true ? '1' : '0'} -- WaitingApp
        // ,2 -- Schedule
        // )')`;
  
        let Query0 = `Call Run('DeleteSchedulePeriod(${RandomNo},${this.all.User.IDP},${this.all.User.IDC},"${IDDoctors}","${IDOperatingRooms}","1,2,3,4,5,6,7", ${this.ShiftNo} ,"${this.SechduleData.CreatedFromDate}","${this.SechduleData.CreatedToDate}","${this.all.RegisterData.AdditionalHoursForDay.length == 2 ? this.all.RegisterData.AdditionalHoursForDay : '0' + this.all.RegisterData.AdditionalHoursForDay}:00:00","${this.SechduleData.CreatedToDate} ${this.all.RegisterData.AdditionalHoursForDay.length == 2 ? this.all.RegisterData.AdditionalHoursForDay : '0' + this.all.RegisterData.AdditionalHoursForDay}:00:00"
          ,1
          ,${this.RealApp == true ? '1' : '0'} 
          ,${this.WaitingApp == true ? '1' : '0'} 
          ,2 
          )')`;
        let Query1 = `Select Result,WarningMessage,StoredStatus from storedResult where Random=${RandomNo} group by ID order by id desc limit 1`;
        let Query = `[${Query0}];${Query1}`;
        console.log(`Query= `, Query);
  
        const body = new HttpParams()
          .set('Mtype', 'A16')
          .set('Query', Query);
  
        this.all.postData(body).then(res => {
          console.log(`delete res= `, res);
          let Result = res[`Q1`][0].Result;
          if (Result > 0 && res[`Q1`][0].StoredStatus == "Done") {
            resolve(true);
          }
        });
  
      });
    }
  
    isFromDateLess(FromDate, ToDate) {
      // تحويل التواريخ إلى كائنات Date
      const fromDateObj = new Date(FromDate);
      const toDateObj = new Date(ToDate);
  
      // المقارنة بين التواريخ
      return fromDateObj < toDateObj;
    }
  
    save() {
      if (this.tblSelectedDoctor.length == 0 && this.tblSelectedRoom.length == 0) {
        this.all.ngxToast(`Doctors or operating rooms must be select`, ``, `warning`);
        return;
      }
  
      if (this.RealApp == false && this.WaitingApp == false) {
        this.all.ngxToast(`Must be selected Real or Waitting schedule`, ``, `warning`);
        return;
      }
  
      if (!this.all.isDate_YYYY_MM_DD(this.SechduleData.CreatedFromDate) || !this.all.isDate_YYYY_MM_DD(this.SechduleData.CreatedToDate) || !this.isFromDateLess(this.SechduleData.CreatedFromDate, this.SechduleData.CreatedToDate)) {
        this.all.ngxToast(`Enter the from and to date correctly`, ``, `warning`);
        return;
      }
  
      let IDDoctors = ``;
      for (let dr of this.tblSelectedDoctor) {
        if (IDDoctors.length > 0) {
          IDDoctors += ",";
        }
        IDDoctors += dr;
      }
  
      let IDOperatingRooms = ``;
      for (let dr of this.tblSelectedRoom) {
        if (IDDoctors.length > 0) {
          IDOperatingRooms += ",";
        }
        IDOperatingRooms += dr;
      }
  
      console.log(`GeneralShift= `, this.GeneralShift);
  
      let Days = [];
      if (this.GeneralShift.Sunday.Active) { Days.push({ No: 1, Name: `Sunday` }); }
      if (this.GeneralShift.Monday.Active) { Days.push({ No: 2, Name: `Monday` }); }
      if (this.GeneralShift.Tuesday.Active) { Days.push({ No: 3, Name: `Tuesday` }); }
      if (this.GeneralShift.Wednesday.Active) { Days.push({ No: 4, Name: `Wednesday` }); }
      if (this.GeneralShift.Thursday.Active) { Days.push({ No: 5, Name: `Thursday` }); }
      if (this.GeneralShift.Friday.Active) { Days.push({ No: 6, Name: `Friday` }); }
      if (this.GeneralShift.Saturday.Active) { Days.push({ No: 7, Name: `Saturday` }); }
  
      let tblQuery = [];
      for (let dd of Days) {
        if (new Date(this.SechduleData.CreatedFromDate) > new Date(this.SechduleData.CreatedToDate)) {
          this.all.ngxToast(`From date must be less than to date`, ``, `warning`);
          return;
        }
  
        console.log(`dd= `, this.GeneralShift[dd.Name].Range.lower);
  
        let RandomNo = this.all.generateRandomNumber(8);
        let OpenTime = this.getDateTime(this.SechduleData.CreatedFromDate, this.GeneralShift[dd.Name].Range.lower);
        let ClosedTime = this.getDateTime(this.SechduleData.CreatedFromDate, this.GeneralShift[dd.Name].Range.upper);
  
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
  
  
        let Query0 = `Call Run('NewSchedule(${RandomNo},${this.all.User.IDC},${this.all.RegisterData.Branch},0,${this.all.User.IDP},"${IDDoctors}","${IDOperatingRooms}","${dd.No}",${this.ShiftNo},"${this.SechduleData.CreatedFromDate}","${this.SechduleData.CreatedToDate}","${OpenTime.Time}","${ClosedTime.Date} ${ClosedTime.Time}",
          1, 
          1, 
          0, 
          ${this.RealApp ? `1` : `0`},
          ${this.WaitingApp ? `1` : `0`},
          1, 
          0, 
          1, 
          "" 
          )')`;
        tblQuery.push(`[${Query0}]`);
        let Query1 = `Select Result,WarningMessage,StoredStatus from storedResult where Random=${RandomNo} group by ID order by id desc limit 1`;
        tblQuery.push(Query1);
  
      }
  
      this.delete(IDDoctors, IDOperatingRooms).then(res => {
        if (res) {
          let QueryStr = ``;
          for (let q of tblQuery) {
            if (QueryStr != '') {
              QueryStr += `;`;
            }
            QueryStr += q;
          }
          console.log(`Query= `, QueryStr);
  
          const body = new HttpParams()
            .set('Mtype', 'A16')
            .set('Query', QueryStr);
  
          this.all.postData(body).then(res => {
            console.log(`save res= `, res);
            this.all.ngxToast(`Saved Successfully`, ``, `success`);
          });
        }
      });
  
      console.log(`tblQuery= `, tblQuery);
    }
  
    getDateTime(dateStr, num) {
      // تحويل التاريخ إلى كائن Date
      const date = new Date(dateStr);
  
      // كل وحدة تساوي 5 دقائق
      const minutes = num * 5;
  
      // حساب عدد الأيام الإضافية إذا تجاوزت الدقائق 1440 دقيقة (24 ساعة)
      const daysToAdd = Math.floor(minutes / 1440);
      const remainingMinutes = minutes % 1440;
  
      // إضافة الأيام الإضافية إلى التاريخ
      date.setDate(date.getDate() + daysToAdd);
  
      // حساب الساعات والدقائق من الدقائق المتبقية
      const hours = Math.floor(remainingMinutes / 60);
      const mins = remainingMinutes % 60;
      const seconds = 0; // يمكن إضافة ثوانٍ إذا لزم الأمر
  
      // تنسيق الوقت إلى HH:mm:ss
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
      // تنسيق التاريخ إلى YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
  
      // إرجاع النتيجة
      return { Date: formattedDate, Time: formattedTime };
    }
  
    getSelected(tblSource, tblSelected) {
      return tblSource.filter(doctor => tblSelected.includes(doctor.IDP));
    }
  
    test = { lower: 96, upper: 192 }
  
  
    timeValue: string = ''; // يتم تخزين قيمة الوقت هنا
  
    onTimeChange(event: any): void {
      console.log('Selected Time:', this.timeValue);
    }
  
    dateValue: string = ''; // يتم تخزين قيمة التاريخ هنا
  
    onDateChange(event: any): void {
      console.log('Selected Date:', this.dateValue);
    }
  
  
    // convertToTime(interval: number): string {
    //   // حساب عدد الدقائق من الرقم المدخل
    //   const totalMinutes = interval * 5;
    //   // حساب الساعات والدقائق
    //   const hours = Math.floor(totalMinutes / 60);
    //   const minutes = totalMinutes % 60;
    //   // تحديد AM/PM
    //   const period = hours < 12 ? "AM" : "PM";
    //   // تعديل الساعة لتكون بصيغة 12 ساعة
    //   const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    //   // تنسيق الإخراج
    //   const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    //   return formattedTime;
    // }
  
    setEndDayPosition() {
      const min = this.min;
      const max = this.max;
      // حساب موقع الإشارة بناءً على القيمة المستهدفة
      this.markerPosition = ((this.markerValue - min) / (max - min)) * 100;
      alert(this.markerPosition)
    }
  
    setAll(day) {
      this.ScheduleDisplay = false;
      this.GeneralShift.Saturday.Range = this.all.deepCopy(this.GeneralShift[day].Range);
      this.GeneralShift.Sunday.Range = this.all.deepCopy(this.GeneralShift[day].Range);
      this.GeneralShift.Monday.Range = this.all.deepCopy(this.GeneralShift[day].Range);
      this.GeneralShift.Tuesday.Range = this.all.deepCopy(this.GeneralShift[day].Range);
      this.GeneralShift.Wednesday.Range = this.all.deepCopy(this.GeneralShift[day].Range);
      this.GeneralShift.Thursday.Range = this.all.deepCopy(this.GeneralShift[day].Range);
      this.GeneralShift.Friday.Range = this.all.deepCopy(this.GeneralShift[day].Range);
      setTimeout(() => {
        this.ScheduleDisplay = true;
      }, 250);
    }
  
    warningMsg() {
  
      let Days = [];
      if (this.GeneralShift.Sunday.Active) { Days.push(this.GeneralShift.Sunday); }
      if (this.GeneralShift.Monday.Active) { Days.push(this.GeneralShift.Monday); }
      if (this.GeneralShift.Tuesday.Active) { Days.push(this.GeneralShift.Tuesday); }
      if (this.GeneralShift.Wednesday.Active) { Days.push(this.GeneralShift.Wednesday); }
      if (this.GeneralShift.Thursday.Active) { Days.push(this.GeneralShift.Thursday); }
      if (this.GeneralShift.Friday.Active) { Days.push(this.GeneralShift.Friday); }
      if (this.GeneralShift.Saturday.Active) { Days.push(this.GeneralShift.Saturday); }
  
      for (let dd of Days) {
        if ((dd.Range.upper - dd.Range.lower) * 5 / 60 >= 8) {
          return this.all.translate.instant(`Alert! Working hours exceed 8 hours`);
        }
      }
      return "";
    }
    // ################ Search #####################
    tblDoctorTimes = [];
    tblRoomTimes = [];
    getDoctorRoomTimes() {
  
      let CreateDateWhere = ``;
      if (this.IsCreatedFromDate && !this.IsCreatedToDate) {
        CreateDateWhere = ` and Date(s.ADate) >= Date("${this.Search.CreatedFromDate}") `;
      } else if (!this.IsCreatedFromDate && this.IsCreatedToDate) {
        CreateDateWhere = ` and Date(s.ADate) <= Date("${this.Search.CreatedToDate}") `;
      } else if (this.IsCreatedFromDate && this.IsCreatedToDate) {
        CreateDateWhere = ` and Date(s.ADate) between Date("${this.Search.CreatedFromDate}") and Date("${this.Search.CreatedToDate}") `;
      }
  
      let StartDateWhere = ``;
      if (this.IsStartdDateFrom && !this.IsStartdDateTo) {
        StartDateWhere = ` and Date(s.StartDate) >= Date("${this.Search.StartDateFrom}") `;
      } else if (!this.IsStartdDateFrom && this.IsStartdDateTo) {
        StartDateWhere = ` and Date(s.StartDate) <= Date("${this.Search.StartDateTo}") `;
      } else if (this.IsStartdDateFrom && this.IsStartdDateTo) {
        StartDateWhere = ` and Date(s.StartDate) between Date("${this.Search.StartDateFrom}") and Date("${this.Search.StartDateTo}") `;
      }
  
  
      let Query0 = ``;
      if (this.SegmentNo == 1) {
        if (this.SearchDoctor.length != 1) {
          return;
        }
  
        Query0 = `Select s.ID,s.ADate,u.UserName,s.DayNo, s.StartDate,s.OpenTime, Date(s.ClosedTime) ClosedDate, 
          Time(s.ClosedTime) EndTime , if(s.Schedule=1,"Schedule",if(s.State=1,"Open Area","Block Area")) ScheduleType,
          if(s.RealApp=1," [Real]"," [Waiting]") AreaType, s.WaitingCount,s.OverbookingCount, 
          s.Schedule,s.State,s.RealApp,s.ShiftNo,s.IDBranch,s.Description 
          from scheduletime s Left join Users u on s.IDUser=u.ID 
          Where s.IDDoctor in (${this.SearchDoctor[0]}) 
           ${StartDateWhere} 
           ${CreateDateWhere} 
           order by s.StartDate,s.OpenTime`;
      } else {
        if (this.SearchRoom.length != 1) {
          return;
        }
        Query0 = `Select s.ID,s.ADate,u.UserName,s.DayNo, s.StartDate,s.OpenTime, Date(s.ClosedTime) ClosedDate, 
        Time(s.ClosedTime) EndTime , if(s.Schedule=1,"Schedule",if(s.State=1,"Open Area","Block Area")) ScheduleType,
        if(s.RealApp=1," [Real]"," [Waiting]") AreaType, s.Schedule,s.State,s.RealApp,s.ShiftNo,s.IDBranch,
        s.Description, s.WaitingCount,s.OverbookingCount 
        from scheduletime s Left join Users u on s.IDUser=u.ID 
        Where s.IDOperatingRoom in (${this.SearchRoom[0]})
         ${StartDateWhere}  
         ${CreateDateWhere}  
         order by s.StartDate,s.OpenTime`;
      }
  
      let Query = Query0;
      console.log(`Query= `, Query);
  
      const body = new HttpParams()
        .set('Mtype', 'A16')
        .set('Query', Query);
  
      this.all.postData(body).then(res => {
        console.log(`save res= `, res);
  
        let tblData = res[`Q0`];
        for (let t of tblData) {
          t[`Selected`] = false;
        }
  
        if (this.SegmentNo == 1) {
          this.tblDoctorTimes = this.all.deepCopy(tblData);
        } else {
          this.tblRoomTimes = this.all.deepCopy(tblData);
        }
        this.tblTimes = this.all.deepCopy(tblData);
      });
  
    }
    // ############### Dovtor - Room #################
    IsEditModal = false;
    TimeBeforEdit = {
      ID: 0,
      IDBranch: 0,
      ShiftNo: 0,
      StartDate: this.all.getDateNow(`-`),
      ClosedDate: this.all.getDateNow(`-`),
      OpenTime: ``,
      EndTime: ``,
      WaitingCount: 0,
      OverbookingCount: 0,
      Description: ``,
      Time: { // 1
        Active: true,
        Range: {
          lower: 150,
          upper: 300
        }
      }
    };
    EditingItem = {
      ID: 0,
      IDBranch: 0,
      ShiftNo: 0,
      StartDate: this.all.getDateNow(`-`),
      ClosedDate: this.all.getDateNow(`-`),
      OpenTime: ``,
      EndTime: ``,
      WaitingCount: 0,
      OverbookingCount: 0,
      Description: ``,
      Time: { // 1
        Active: true,
        Range: {
          lower: 150,
          upper: 300
        }
      }
    };
  
    selectAll(ev) {
      console.log(`ev= `, ev.detail.checked);
      for (let t of this.tblTimes) {
        t.Selected = ev.detail.checked;
      }
      // if (this.SegmentNo == 1) {
      //   for (let t of this.tblTimes) {
      //     t.Selected = ev.detail.checked;
      //   }
      // } else if (this.SegmentNo == 2) {
  
      // }
    }
  
    isSameDay(date1: string, date2: string, startHour: number): boolean {
      console.log(date1, date2);
  
  
      const d1 = new Date(date1);
      const d2 = new Date(date2);
  
      // ضبط التواريخ حسب بداية اليوم المخصصة
      const adjustedD1 = new Date(d1);
      const adjustedD2 = new Date(d2);
  
      adjustedD1.setHours(d1.getHours() - startHour);
      adjustedD2.setHours(d2.getHours() - startHour);
  
      // مقارنة السنة والشهر واليوم بعد التعديل
      return (
        adjustedD1.getFullYear() === adjustedD2.getFullYear() &&
        adjustedD1.getMonth() === adjustedD2.getMonth() &&
        adjustedD1.getDate() === adjustedD2.getDate()
      );
    }
  
    checkSameDayShifts(tblTimes: { StartDate: string, OpenTime: string, ClosedDate: string, EndTime: string }[], startHour: number) {
      for (let i = 0; i < tblTimes.length; i++) {
        for (let j = i + 1; j < tblTimes.length; j++) {
          console.log(
            this.isSameDay(tblTimes[i].StartDate + ' ' + tblTimes[i].OpenTime, tblTimes[j].StartDate + ' ' + tblTimes[j].OpenTime, startHour),
            this.isSameDay(tblTimes[i].StartDate + ' ' + tblTimes[i].OpenTime, tblTimes[j].ClosedDate + ' ' + tblTimes[j].EndTime, startHour),
            this.isSameDay(tblTimes[i].ClosedDate + ' ' + tblTimes[i].EndTime, tblTimes[j].StartDate + ' ' + tblTimes[j].OpenTime, startHour),
            this.isSameDay(tblTimes[i].ClosedDate + ' ' + tblTimes[i].EndTime, tblTimes[j].ClosedDate + ' ' + tblTimes[j].EndTime, startHour)
          );
          if (
            this.isSameDay(tblTimes[i].StartDate + ' ' + tblTimes[i].OpenTime, tblTimes[j].StartDate + ' ' + tblTimes[j].OpenTime, startHour) ||
            this.isSameDay(tblTimes[i].StartDate + ' ' + tblTimes[i].OpenTime, tblTimes[j].ClosedDate + ' ' + tblTimes[j].EndTime, startHour) ||
            this.isSameDay(tblTimes[i].ClosedDate + ' ' + tblTimes[i].EndTime, tblTimes[j].StartDate + ' ' + tblTimes[j].OpenTime, startHour) ||
            this.isSameDay(tblTimes[i].ClosedDate + ' ' + tblTimes[i].EndTime, tblTimes[j].ClosedDate + ' ' + tblTimes[j].EndTime, startHour)
          ) {
            return false;
          }
        }
      }
      return true;
    }
  
    isEditDisabled(item) {
      // console.log(this.tblTimes.filter(x => x.Selected == true).length > 0 );
      if (this.tblTimes.filter(x => x.Selected == true).length > 0 && item.Selected == false) {
        return true;
      } else {
        return false;
      }
    }
  
    edit(item) {
      this.IsMultiSelect = false;
      this.IsEnableEditTime = true;
      if (this.tblTimes.filter(x => x.Selected == true).length > 0) {
        this.IsMultiSelect = true;
  
        this.IsEnableEditTime = this.checkSameDayShifts(this.tblTimes.filter(x => x.Selected == true), this.all.RegisterData.AdditionalHoursForDay);
  
      }
  
      let StartDay = `${this.all.RegisterData.AdditionalHoursForDay.length == 1 ? '0' : ''}${this.all.RegisterData.AdditionalHoursForDay}:00`;
  
      this.TimeBeforEdit = this.all.deepCopy(item);
      this.EditingItem = this.all.deepCopy(item);
  
      this.TimeBeforEdit[`Time`] = {
        Active: true,
        Range: {
          lower: this.convertToInterval(item.OpenTime, StartDay),
          upper: this.convertToInterval(item.EndTime, StartDay),
        }
      }
      this.EditingItem[`Time`] = {
        Active: true,
        Range: {
          lower: this.convertToInterval(item.OpenTime, StartDay),
          upper: this.convertToInterval(item.EndTime, StartDay),
        }
      }
      this.IsEditModal = true;
    }
  
    IsMultiSelect = false;
    IsEnableEditTime = true;
    // editSelected() {
    //   this.IsMultiSelect = true;
    //   let StartDay = `${this.all.RegisterData.AdditionalHoursForDay.length == 1 ? '0' : ''}${this.all.RegisterData.AdditionalHoursForDay}:00`;
  
    //   // this.EditingItem = item;
    //   this.EditingItem[`Time`] = {
    //     Active: true,
    //     Range: {
    //       lower: this.convertToInterval(this.tblTimes.filter(x => x.Selected == true)[0].OpenTime, StartDay),
    //       upper: this.convertToInterval(this.tblTimes.filter(x => x.Selected == true)[0].EndTime, StartDay),
    //     }
    //   }
    //   this.IsEditModal = true;
    // }
  
    convertToInterval(time: string, startDay: string = "05:00"): number {
      // تقسيم الوقت إلى ساعات ودقائق
      const [hoursStr, minutesStr] = time.split(":");
      const [startHoursStr, startMinutesStr] = startDay.split(":");
  
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      const startHours = parseInt(startHoursStr, 10);
      const startMinutes = parseInt(startMinutesStr, 10);
  
      // حساب العدد الإجمالي للدقائق
      let totalMinutes = hours * 60 + minutes;
      let startTotalMinutes = startHours * 60 + startMinutes;
  
      // في حال كان الوقت أقل من StartDay، نتابع العد بعد منتصف الليل
      if (totalMinutes < startTotalMinutes) {
        totalMinutes += 24 * 60; // نضيف 24 ساعة بالعدد الإجمالي للدقائق
      }
  
      // حساب قيمة interval
      return Math.floor(totalMinutes / 5);
    }
  
    convertToTime(interval: number): string {
      // حساب عدد الدقائق من الرقم المدخل
      const totalMinutes = interval * 5;
      // حساب الساعات والدقائق
      const hours = Math.floor(totalMinutes / 60) % 24;
      const minutes = totalMinutes % 60;
      // تنسيق الإخراج بنمط 24 ساعة
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  
    // convertToInterval(time: string): number {
    //   // تقسيم الوقت إلى ساعات ودقائق
    //   const [hoursStr, minutesStr] = time.split(":");
    //   const hours = parseInt(hoursStr, 10);
    //   const minutes = parseInt(minutesStr, 10);
  
    //   // حساب العدد الإجمالي للدقائق
    //   const totalMinutes = hours * 60 + minutes;
  
    //   // حساب قيمة interval
    //   return Math.floor(totalMinutes / 5);
    // }
  
  
  
    // Update ScheduleTime set IDBranch=   1,StartDate=  "2025-03-22",ClosedTime= "2025-03-25 03:00:00",OpenTime=   "21:00:00",WaitingCount    =0,Description="",ADate=Now() Where ID in (587320,589166); -- ,0,51 
  
    saveUpdate() {
      // alert(this.EditingItem.Time.Range.upper);
      // alert(this.convertToTime(this.EditingItem.Time.Range.upper));
      // return;
      let Query0 = ``;
      if (this.IsEnableEditTime && this.EditingItem.Time.Range.lower >= this.EditingItem.Time.Range.upper) {
        this.all.ngxToast(`Time Range is invalid`, ``, `warning`);
        return;
      }
  
      console.log(this.EditingItem, this.TimeBeforEdit);
      if (JSON.stringify(this.EditingItem) == JSON.stringify(this.TimeBeforEdit)) {
        this.IsEditModal = false;
      }
  
      if (this.EditingItem.IDBranch == this.TimeBeforEdit.IDBranch
        && this.EditingItem.ShiftNo == this.TimeBeforEdit.ShiftNo
        && this.EditingItem.WaitingCount == this.TimeBeforEdit.WaitingCount
        && this.EditingItem.OverbookingCount == this.TimeBeforEdit.OverbookingCount
        && this.EditingItem.Description == this.TimeBeforEdit.Description
        && this.EditingItem.Time.Range.lower == this.TimeBeforEdit.Time.Range.lower
        && this.EditingItem.Time.Range.upper == this.TimeBeforEdit.Time.Range.upper
      ) {
        this.IsEditModal = false;
      }
  
      if (this.IsMultiSelect) {
  
        let IDs = ``;
        for (let item of this.tblTimes.filter(x => x.Selected == true)) {
          if (IDs.length > 0) {
            IDs += ",";
          }
          IDs += item.ID;
        }
        if (IDs == ``) {
          return;
        }
  
        // Query0 = `[Update ScheduleTime set `;
        // Query0 += this.EditingItem.IDBranch == this.TimeBeforEdit.IDBranch ? `` : ` IDBranch=   ${this.EditingItem.IDBranch},`;
        // Query0 += this.EditingItem.ShiftNo == this.TimeBeforEdit.ShiftNo ? `` : ` ShiftNo=   ${this.EditingItem.ShiftNo},`;
        // Query0 += this.EditingItem.Time.Range.upper == this.TimeBeforEdit.Time.Range.upper ? `` : ` ClosedTime=   "${this.EditingItem.ClosedDate} ${this.convertToTime(this.EditingItem.Time.Range.upper)}:00",`;
        // Query0 += this.EditingItem.Time.Range.lower == this.TimeBeforEdit.Time.Range.lower ? `` : ` OpenTime=   "${this.convertToTime(this.EditingItem.Time.Range.lower)}:00",`;
        // Query0 += this.EditingItem.WaitingCount == this.TimeBeforEdit.WaitingCount ? `` : ` WaitingCount=   ${this.EditingItem.WaitingCount},`;
        // Query0 += this.EditingItem.OverbookingCount == this.TimeBeforEdit.OverbookingCount ? `` : ` OverbookingCount=   ${this.EditingItem.OverbookingCount},`;
        // Query0 += this.EditingItem.Description == this.TimeBeforEdit.Description ? `` : ` OverbookingCount=   ${this.EditingItem.Description},`;
        // Query0 += ` ADate= Now() `;
        // Query0 += ` Where ID in (${IDs})]`;
  
  
        for (let item of this.tblTimes.filter(x => x.Selected == true)) {
          if (Query0 != ``) {
            Query0 += `;`;
          }
          Query0 += `[Update ScheduleTime set `;
          Query0 += this.EditingItem.IDBranch == this.TimeBeforEdit.IDBranch ? `` : ` IDBranch=   ${this.EditingItem.IDBranch},`;
          Query0 += this.EditingItem.ShiftNo == this.TimeBeforEdit.ShiftNo ? `` : ` ShiftNo=   ${this.EditingItem.ShiftNo},`;
          Query0 += this.EditingItem.Time.Range.upper == this.TimeBeforEdit.Time.Range.upper ? `` : ` ClosedTime=   "${item.ClosedDate} ${this.convertToTime(this.EditingItem.Time.Range.upper)}:00",`;
          Query0 += this.EditingItem.Time.Range.lower == this.TimeBeforEdit.Time.Range.lower ? `` : ` OpenTime=   "${this.convertToTime(this.EditingItem.Time.Range.lower)}:00",`;
          Query0 += this.EditingItem.WaitingCount == this.TimeBeforEdit.WaitingCount ? `` : ` WaitingCount=   ${this.EditingItem.WaitingCount},`;
          Query0 += this.EditingItem.OverbookingCount == this.TimeBeforEdit.OverbookingCount ? `` : ` OverbookingCount=   ${this.EditingItem.OverbookingCount},`;
          Query0 += this.EditingItem.Description == this.TimeBeforEdit.Description ? `` : ` OverbookingCount=   ${this.EditingItem.Description},`;
          Query0 += ` ADate= Now() `;
          Query0 += ` Where ID =${item.ID}]`;
        }
  
  
      } else {
        if (this.EditingItem.Time.Range.upper >= 288) {
          this.EditingItem.ClosedDate = this.datetime.addDaysToDate(this.EditingItem.ClosedDate, 1);
        }
  
        if (new Date(this.EditingItem.StartDate) >= new Date(this.EditingItem.ClosedDate)) {
          this.all.ngxToast(`Closed Date is invalid`, ``, `warning`);
          return;
        }
  
        Query0 = `[Update ScheduleTime set 
        IDBranch=   ${this.EditingItem.IDBranch},
        ShiftNo=${this.EditingItem.ShiftNo},
        StartDate=  "${this.EditingItem.StartDate}",
        ClosedTime= "${this.EditingItem.ClosedDate} ${this.convertToTime(this.EditingItem.Time.Range.upper)}:00",
        OpenTime=   "${this.convertToTime(this.EditingItem.Time.Range.lower)}:00",
        WaitingCount    =${this.EditingItem.WaitingCount},
        OverbookingCount=${this.EditingItem.OverbookingCount},
        Description="${this.EditingItem.Description}",
        ADate=Now() 
        Where ID = ${this.EditingItem.ID}]`;
      }
      // alert(this.convertToTime(this.EditingItem.Time.Range.upper));
      // Update ScheduleTime set IDBranch=   6,ShiftNo=1,StartDate=  "2025-03-20",ClosedTime= "2025-03-21 01:40:00",OpenTime=   "21:00:00",WaitingCount    =0,OverbookingCount=1,Description="",ADate=Now() Where ID in (587925); -- ,0,51 
      // Update ScheduleTime set IDBranch=   1,ShiftNo=1,StartDate=  "2025-03-19",ClosedTime= "2025-03-19 22:10:00",OpenTime=   "09:00:00",WaitingCount    =0,OverbookingCount=1,Description="",ADate=Now() Where ID in (556042)
  
  
      let Query = `${Query0}`;
      console.log(`Query= `, Query);
      // return;
  
      const body = new HttpParams()
        .set('Mtype', 'A16')
        .set('Query', Query);
  
      this.all.postData(body).then(res => {
        console.log(`save res= `, res);
        if (res[`Q0Error`] != "") {
          this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
          console.log(`Q0Error= `, res[`Q0Error`]);
          return;
        }
        this.IsEditModal = false;
        this.all.ngxToast(`Updated Successfully`, ``, `success`);
        this.getDoctorRoomTimes();
      });
    }
  
    segmentChange() {
      this.tblTimes = [];
    }
  
    delSelected() {
      if (this.tblTimes.length == 0) {
        return;
      }
      this.all.confirm(this.all.translate.instant(`Are you sure you want to delete?`)).then(yes => {
        if (yes) {
          let Query = ``;
          for (let item of this.tblTimes.filter(x => x.Selected == true)) {
            if (Query.length > 0) {
              Query += `;`;
            }
            Query += `[insert into ScheduleTimeUndo (IDTransUser,IDTransaction,IDC,IDBranch, IDP,IDUser,ADate,IDDoctor,IDOperatingRoom,DayNo,ShiftNo,StartDate,EndDate,OpenTime,ClosedTime,State,IsRepeated,IDGroup,RealApp,WaitingApp,Schedule,WaitingCount,OverbookingCount,Description,IDGroupNew,OldID,ChangeStatus) Select 17,@a:=ifnull(@a,(Select IfNull(Max(IDTransaction),0)+1 from ScheduletimeUnDo)) IDTransaction,s.IDC,IDBranch,s.IDP,s.IDUser,s.ADate,s.IDDoctor,s.IDOperatingRoom,s.DayNo,s.ShiftNo,s.StartDate,s.EndDate,s.OpenTime,s.ClosedTime,s.State,s.IsRepeated,s.IDGroup,s.RealApp,s.WaitingApp,s.Schedule,s.WaitingCount,s.OverbookingCount,s.Description,s.IDGroup IDGroupNew,0 OldID,1 ChangeStatus from ScheduleTime s 
            Where s.ID in (${item.ID})];`;
            Query += `[Delete s from ScheduleTime s Where s.ID in (${item.ID})]`;
          }
  
          console.log(`Query= `, Query);
  
          const body = new HttpParams()
            .set('Mtype', 'A16')
            .set('Query', Query);
  
          this.all.postData(body).then(res => {
            console.log(`save res= `, res);
            if (res[`Q0Error`] != "") {
              this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
              console.log(`Q0Error= `, res[`Q0Error`]);
              return;
            }
            if (res[`Q1Error`] != "") {
              this.all.ngxToast(`Q1Error= `, res[`Q1Error`], `warning`);
              console.log(`Q1Error= `, res[`Q1Error`]);
              return;
            }
  
            this.tblTimes = [];
            if (this.SegmentNo == 1) {
              this.tblDoctorTimes = [];
            } else if (this.SegmentNo == 2) {
              this.tblRoomTimes = [];
            }
            this.all.ngxToast(`Deleted Successfully`, ``, `success`);
  
          });
        }
      });
    }
  
    del(item) {
      this.all.confirm(this.all.translate.instant(`Are you sure you want to delete?`)).then(yes => {
        if (yes) {
  
          // insert into ScheduleTimeUndo (IDTransUser,IDTransaction,IDC,IDBranch, IDP,IDUser,ADate,IDDoctor,IDOperatingRoom,DayNo,ShiftNo,StartDate,EndDate,OpenTime,ClosedTime,State,IsRepeated,IDGroup,RealApp,WaitingApp,Schedule,WaitingCount,OverbookingCount,Description,IDGroupNew,OldID,ChangeStatus) Select 17,@a:=ifnull(@a,(Select IfNull(Max(IDTransaction),0)+1 from ScheduletimeUnDo)) IDTransaction,s.IDC,IDBranch,s.IDP,s.IDUser,s.ADate,s.IDDoctor,s.IDOperatingRoom,s.DayNo,s.ShiftNo,s.StartDate,s.EndDate,s.OpenTime,s.ClosedTime,s.State,s.IsRepeated,s.IDGroup,s.RealApp,s.WaitingApp,s.Schedule,s.WaitingCount,s.OverbookingCount,s.Description,s.IDGroup IDGroupNew,0 OldID,1 ChangeStatus from ScheduleTime s Where s.ID in (587337); -- ,0,51 
          // -- _____________________
          // Delete s from ScheduleTime s Where s.ID in (587337); -- ,0,51 
          let Query0 = `insert into ScheduleTimeUndo (IDTransUser,IDTransaction,IDC,IDBranch, IDP,IDUser,ADate,IDDoctor,IDOperatingRoom,DayNo,ShiftNo,StartDate,EndDate,OpenTime,ClosedTime,State,IsRepeated,IDGroup,RealApp,WaitingApp,Schedule,WaitingCount,OverbookingCount,Description,IDGroupNew,OldID,ChangeStatus) Select 17,@a:=ifnull(@a,(Select IfNull(Max(IDTransaction),0)+1 from ScheduletimeUnDo)) IDTransaction,s.IDC,IDBranch,s.IDP,s.IDUser,s.ADate,s.IDDoctor,s.IDOperatingRoom,s.DayNo,s.ShiftNo,s.StartDate,s.EndDate,s.OpenTime,s.ClosedTime,s.State,s.IsRepeated,s.IDGroup,s.RealApp,s.WaitingApp,s.Schedule,s.WaitingCount,s.OverbookingCount,s.Description,s.IDGroup IDGroupNew,0 OldID,1 ChangeStatus from ScheduleTime s 
            Where s.ID in (${item.ID})`;
          let Query1 = `Delete s from ScheduleTime s Where s.ID in (${item.ID})`;
  
  
          let Query = `[${Query0}];[${Query1}]`;
          console.log(`Query= `, Query);
  
          const body = new HttpParams()
            .set('Mtype', 'A16')
            .set('Query', Query);
  
          this.all.postData(body).then(res => {
            console.log(`save res= `, res);
            if (res[`Q0Error`] != "") {
              this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
              console.log(`Q0Error= `, res[`Q0Error`]);
              return;
            }
            if (res[`Q1Error`] != "") {
              this.all.ngxToast(`Q1Error= `, res[`Q1Error`], `warning`);
              console.log(`Q1Error= `, res[`Q1Error`]);
              return;
            }
  
            this.tblTimes = this.tblTimes.filter(x => x.ID != item.ID);
            if (this.SegmentNo == 1) {
              this.tblDoctorTimes = this.tblDoctorTimes.filter(x => x.ID != item.ID);
            } else if (this.SegmentNo == 2) {
              this.tblRoomTimes = this.tblRoomTimes.filter(x => x.ID != item.ID);
            }
            this.all.ngxToast(`Deleted Successfully`, ``, `success`);
  
          });
  
        }
      });
    }
  
  
  
  
    calculateTime(value: number, day: string): string {
      // قائمة بأيام الأسبوع
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
      // حساب عدد الساعات والدقائق
      const totalMinutes = value * 5; // كل وحدة تمثل 5 دقائق
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
  
      // حساب اليوم
      const currentDayIndex = daysOfWeek.indexOf(day);
      const additionalDays = Math.floor(hours / 24); // عدد الأيام المضافة
      const newDayIndex = (currentDayIndex + additionalDays) % 7; // اليوم الجديد
      const newDay = daysOfWeek[newDayIndex];
  
      // حساب الوقت داخل اليوم
      const timeInDay = hours % 24;
      const period = timeInDay < 12 ? 'AM' : 'PM'; // الفترة الزمنية
      const formattedHour = timeInDay % 12 || 12; // الساعات في صيغة 12 ساعة
  
      // return `${this.translate.instant(newDay)} <br> ${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`;
      return `${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  
    disableEdit() {
      return this.tblTimes.filter(x => x.Selected).length == 0;
    }
  
  
  }
  