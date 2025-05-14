import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AllService } from './all.service';
import { NavController } from '@ionic/angular';
const APPT_DATA = `APPT_DATA`;
@Injectable({
  providedIn: 'root'
})
export class ApptService {
  tblSelectedDoctor = [];
  tblSelectedRoom = [];
  ViewDayCount = 1;
  SelectedPatient;
  constructor(private storage: Storage, private all: AllService) {
    storage.create();
    // storage.clear();
    storage.get(APPT_DATA).then(val => {
      if (val) {
        this.tblSelectedDoctor = val.tblSelectedDoctor;
        this.tblSelectedRoom = val.tblSelectedRoom;
      }
    });
  }

  saveSelect() {
    this.storage.set(APPT_DATA, {
      tblSelectedDoctor: this.tblSelectedDoctor,
      tblSelectedRoom: this.tblSelectedRoom,
    });
  }



  getMinStartDate(data) {
    if (!data || data.length === 0) return null; // التحقق من وجود بيانات

    // تحويل التواريخ إلى كائنات Date وإيجاد الأصغر
    return data.reduce((min, item) => {
      const currentDate = new Date(item.StartDate);
      const minDate = new Date(min.StartDate);
      return currentDate < minDate ? item : min;
    }).StartDate;
  }


  getMaxClosedTime(data) {
    if (!data || data.length === 0) return null; // التحقق من وجود بيانات

    // تحويل التواريخ إلى كائنات Date وإيجاد الأكبر
    return data.reduce((max, item) => {
      const currentDate = new Date(item.ClosedTime);
      const maxDate = new Date(max.ClosedTime);
      return currentDate > maxDate ? item : max;
    }).ClosedTime;
  }

  findDateInSlotsRange(cellDate, data) {
    if (!data || data.length === 0) return null; // التحقق من وجود بيانات

    const targetDate = new Date(cellDate).getTime();

    return data.find(item => {
      const startDate = new Date(item.StartDate).getTime();
      const closedTime = new Date(item.ClosedTime).getTime();
      return targetDate >= startDate && targetDate <= closedTime;
    });
  }

  // removeOverlappingEntries(data) {
  //   const uniqueData = [];

  //   data.forEach(item => {
  //     const startDateTime = new Date(`${item.StartDate} ${item.OpenTime}`).getTime();
  //     const closedDateTime = new Date(item.ClosedTime).getTime();

  //     const currentRange = { start: startDateTime, end: closedDateTime };

  //     // التحقق من التداخل مع العناصر الموجودة في uniqueData
  //     const isDuplicateOrOverlap = uniqueData.some(existingItem => {
  //       const existingStart = new Date(`${existingItem.StartDate} ${existingItem.OpenTime}`).getTime();
  //       const existingEnd = new Date(existingItem.ClosedTime).getTime();
  //       const existingRange = { start: existingStart, end: existingEnd };

  //       return this.isOverlapping(currentRange, existingRange);
  //     });

  //     // إذا لم يكن هناك تداخل أو تكرار، نضيف العنصر إلى uniqueData
  //     if (!isDuplicateOrOverlap) {
  //       uniqueData.push(item);
  //     }
  //   });

  //   return uniqueData;
  // }

  // isOverlapping(range1, range2) {
  //   return (
  //     range1.start < range2.end &&
  //     range1.end > range2.start
  //   );
  // }



  isOverlapping(range1, range2) {
    return (
      range1.start < range2.end &&
      range1.end > range2.start &&
      range1.RealApp === range2.RealApp &&
      range1.WaitingApp === range2.WaitingApp &&
      range1.State === range2.State &&
      range1.ShiftNo === range2.ShiftNo &&
      range1.IDOperatingRoom === range2.IDOperatingRoom &&
      range1.IDOperaIDDoctortingRoom === range2.IDDoctor
    );
  }

  // دالة لإزالة الأوقات المتداخلة أو المكررة مع الشروط الإضافية
  removeOverlappingEntries(data) {
    const uniqueData = [];

    data.forEach(item => {
      const startDateTime = new Date(`${item.StartDate} ${item.OpenTime}`).getTime();
      const closedDateTime = new Date(item.ClosedTime).getTime();

      const currentRange = {
        start: startDateTime,
        end: closedDateTime,
        RealApp: item.RealApp,
        WaitingApp: item.WaitingApp,
        State: item.State,
        ShiftNo: item.ShiftNo,
        IDDoctor: item.IDDoctor,
        IDOperatingRoom: item.IDOperatingRoom,
      };

      // التحقق من التداخل مع العناصر الموجودة في uniqueData
      const isDuplicateOrOverlap = uniqueData.some(existingItem => {
        const existingStart = new Date(`${existingItem.StartDate} ${existingItem.OpenTime}`).getTime();
        const existingEnd = new Date(existingItem.ClosedTime).getTime();
        const existingRange = {
          start: existingStart,
          end: existingEnd,
          RealApp: existingItem.RealApp,
          WaitingApp: existingItem.WaitingApp,
          State: existingItem.State,
          ShiftNo: existingItem.ShiftNo,
          IDDoctor: existingItem.IDDoctor,
          IDOperatingRoom: existingItem.IDOperatingRoom,
        };

        return this.isOverlapping(currentRange, existingRange);
      });

      // إذا لم يكن هناك تداخل أو تكرار، نضيف العنصر إلى uniqueData
      if (!isDuplicateOrOverlap) {
        uniqueData.push(item);
      }
    });

    return uniqueData;
  }


  calculateEndTime(ADate, Duration) {
    // تحويل ADate إلى كائن Date
    const startDate = new Date(ADate);

    // إضافة المدة (بالدقائق) إلى تاريخ البدء
    const endDate = new Date(startDate.getTime() + Duration * 60000); // 60000 مللي ثانية = 1 دقيقة

    // إرجاع النتيجة بتنسيق "YYYY-MM-DD HH:MM:SS"
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0'); // الأشهر من 0 إلى 11
    const day = String(endDate.getDate()).padStart(2, '0');
    const hours = String(endDate.getHours()).padStart(2, '0');
    const minutes = String(endDate.getMinutes()).padStart(2, '0');
    const seconds = String(endDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  calculateAppointmentTimes(startTime, Duration) {
    // تحويل startTime إلى كائن Date
    const startDate = new Date(startTime);

    // حساب وقت النهاية بإضافة المدة (بالدقائق)
    const endDate = new Date(startDate.getTime() + Duration * 60000); // 60000 مللي ثانية = 1 دقيقة

    // تنسيق وقت البداية والنهاية
    const formattedStartTime = this.formatTime(startDate);
    const formattedEndTime = this.formatTime(endDate);

    // إرجاع النتيجة بالشكل المطلوب
    return `${formattedStartTime}-${formattedEndTime}`;
  }

  formatTime(date) {
    // تحويل الوقت إلى تنسيق 12 ساعة مع AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // تحويل الساعات إلى تنسيق 12 ساعة
    hours = hours % 12 || 12; // الساعة 0 تصبح 12

    return `${hours}:${minutes} ${ampm}`;
  }

  addUniqueElements(array1, array2) {
    // جلب العناصر الغير مكررة
    array1.forEach(item => {
      if (!array2.some(existingItem => JSON.stringify(existingItem) === JSON.stringify(item))) {
        array2.push(item);
      }
    });
    return array2;
  }

  getUpdatedElements(newArr, prevArr) {
    return newArr.filter(newItem => {
      // البحث عن العنصر المقابل في prevArr باستخدام IDP
      const prevItem = prevArr.find(prev => prev.IDP === newItem.IDP);

      // إذا وجد العنصر وكانت هناك خصائص مختلفة (باستثناء IDP)
      if (prevItem) {
        return Object.keys(newItem).some(key => {
          if (key !== 'IDP') { // تجاهل مقارنة IDP
            return newItem[key] !== prevItem[key];
          }
          return false;
        });
      }
      // إذا لم يتم العثور على العنصر في prevArr، لا نعيده
      return false;
    });
  }

  getNewElements(newArr, prevArr) {
    // جلب العنصار الجديدة فقط في المصفوفة الجديدة
    const newElements = [];

    newArr.forEach(item => {
      if (!prevArr.some(existingItem => existingItem.IDP === item.IDP)) {
        newElements.push(item);
      }
    });

    // newArr.forEach(item => {
    //   if (!prevArr.some(existingItem => JSON.stringify(existingItem) === JSON.stringify(item))) {
    //     newElements.push(item);
    //   }
    // });

    return newElements;
  }


  getChangedEvent(array1, array2) {
    // جلب العناصر الحدث الذي تم تعديل قيمه داخله بدلالة IDP
    return array1.filter(item1 => {
      // البحث عن العنصر الذي له نفس الـ IDP في المصفوفة الثانية
      const item2 = array2.find(item2 => item2.IDP === item1.IDP);

      // إذا وجد عنصر بنفس الـ IDP
      if (item2) {
        // مقارنة جميع الخصائص بين العنصرين
        return Object.keys(item1).some(key => item1[key] !== item2[key]);
      }

      // إذا لم يكن هناك عنصر بنفس الـ IDP، نهمله
      return false;
    });
  }

  getDurationInMinutes(date1, date2) {
    // تحويل التاريخين إلى ميلي ثانية
    const time1 = date1.getTime();
    const time2 = date2.getTime();
    // حساب الفرق بالميلي ثانية
    const differenceInMilliseconds = Math.abs(time2 - time1);
    // تحويل الفرق من ميلي ثانية إلى دقائق
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes;
  }


  getMonyStatus(MonyStatus) {
    // let mstyle = `border: solid 2px; border-radius: 50%; font-size: 15px; margin-bottom: -5px; box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.75);`;
    switch (MonyStatus) {
      case 1:
        return `<ion-icon class="mony-status-icon" name="ribbon" style="color:#b2bec3"></ion-icon>`;
        break;
      case 2:
        return `<ion-icon class="mony-status-icon" name="star" color="warning"></ion-icon>`;
        break;
      case 3:
        return `<ion-icon class="mony-status-icon" name="diamond" color="success"></ion-icon>`;
        break;
      case 4:
        return `<ion-icon class="mony-status-icon" name="rose" style="color:#00b894"></ion-icon>`;
        break;
      default:
        return ``;
        break;
    }
  }

  // console.log(`getEventFooter= `, appt);
  //   "FutureAppt": 1,// سماوية
  // "AttendCount": 3, // اخضر
  // "AttendLate": 0, // صفراء
  // "NotAttend": 1,// رمادية
  // "NotAttendAfterConfirm": 0,// سوداء
  // "BlackPoints": 0,// سوداء
  // "AttendAndDelayedCount": 0,// حمراء

  getEventFooter(appt) {
    const categories = {
      AttendLate: "bg-yellow",  // #feca57
      AttendAndDelayedCount: "bg-red",  // #ee5253
      AttendCount: "bg-green",  // #10ac84
      NotAttend: "bg-gray",  // #b2bec3
      NotAttendAfterConfirm: "bg-black",  // #222f3e
      BlackPoints: "bg-black",  // #222f3e
      FutureAppt: "bg-blue"  // #48dbfb
    };

    let iconsHTML = Object.entries(categories)
      .map(([key, className]) =>
        Array(appt[key]).fill(`<div class="icon-box ${className}"></div>`).join('')
      ).join('');

    return `<div class="event-footer">
      <div class="row">
        <div class="branch-box">${appt.IDBranch}</div>
        ${iconsHTML}
      </div>
    </div>`;
  }

  getEventFooterXX(appt) {
    const categories = {
      AttendLate: "bg-yellow",  // #feca57
      AttendAndDelayedCount: "bg-red",  // #ee5253
      AttendCount: "bg-green",  // #10ac84
      NotAttend: "bg-gray",  // #b2bec3
      NotAttendAfterConfirm: "bg-black",  // #222f3e
      BlackPoints: "bg-black",  // #222f3e
      FutureAppt: "bg-blue"  // #48dbfb
    };

    let iconsHTML = Object.entries(categories)
      .map(([key, className]) =>
        Array(appt[key]).fill(`<ion-col size="auto" class="icon-box ${className}"></ion-col>`).join('')
      ).join('');

    return `<div class="event-footer">
      <ion-row class="row-no-padding">
        <ion-col size="auto">
          <div class="branch-box">${appt.IDBranch}</div>
        </ion-col>
        ${iconsHTML}
      </ion-row>
    </div>`;
  }

  getEventFooterX(appt) {
    try {

      let ColStart = `<ion-col size="auto" style="padding:0;"><div style="margin-inline: 0.5px;border: solid 1px; width: 8px; height: 8px;`;
      let ColEnd = `margin-top: 7px;"></div></ion-col>`;

      let AttendLate = ``;
      for (let i = 0; i < appt.AttendLate; i++) {
        AttendLate += `${ColStart}background:#feca57;${ColEnd}`;
      }

      let AttendAndDelayedCount = ``;
      for (let i = 0; i < appt.AttendAndDelayedCount; i++) {
        AttendAndDelayedCount += `${ColStart}background:#ee5253;${ColEnd}`;
      }

      let AttendCount = ``;
      for (let i = 0; i < appt.AttendCount; i++) {
        AttendCount += `${ColStart}background:#10ac84;${ColEnd}`;
      }



      let NotAttend = ``;
      for (let i = 0; i < appt.NotAttend; i++) {
        NotAttend += `${ColStart}background:#b2bec3;${ColEnd}`;
      }

      let NotAttendAfterConfirm = ``;
      for (let i = 0; i < appt.NotAttendAfterConfirm; i++) {
        NotAttendAfterConfirm += `${ColStart}background:#222f3e;${ColEnd}`;
      }
      let BlackPoints = ``;
      for (let i = 0; i < appt.BlackPoints; i++) {
        BlackPoints += `${ColStart}background:#222f3e;${ColEnd}`;
      }

      let FutureAppt = ``;
      for (let i = 0; i < appt.FutureAppt; i++) {
        FutureAppt += `${ColStart}background:#48dbfb;${ColEnd}`;
      }

      let EventFooter = `<div style="margin-top: auto;">
          <ion-row class="row-no-padding">
            <ion-col size="auto" ><div style="margin-inline: 0.5px;border: solid 1px; background:#ad5900;line-height: 1;height: 15px;"> ${appt.IDBranch} </div></ion-col>
            ${AttendLate}
            ${AttendAndDelayedCount}
            ${AttendCount}
            
            ${NotAttend}
            ${NotAttendAfterConfirm}${BlackPoints}
            ${FutureAppt}
          </ion-row>
        </div>`;

      return EventFooter;
    } catch {
      return "";
    }
  }


  errorSavedResult(lang, k) {
    const result = [];
    if (k < 0) {
      const B = this.getMySet(Math.abs(k)).B; // استدعاء الدالة getMySet للحصول على المصفوفة B
      for (let i = 0; i < B.length; i++) {
        let se = '';
        let sa = '';

        switch (B[i]) {
          case 0:
            se = 'The Time Attendance for doctor does not allow';
            sa = 'جدول دوام الطبيب لا يسمح';
            break;
          case 1:
            se = 'Schedule operating room time does not allow';
            sa = 'جدول دوام غرفة العمليات لا يسمح';
            break;
          case 2:
            se = 'Appointment within the period of blocked part of the agenda doctor';
            sa = 'الموعد ضمن فترة محجوبة من جدول دوام الطبيب';
            break;
          case 3:
            se = 'Appointment within the period of blocked part of the agenda operating room';
            sa = 'الموعد ضمن فترة محجوبة من جدول دوام غرفة العمليات';
            break;
          case 4:
            se = 'Appointment Table does not allow';
            sa = 'جدول المواعيد لا يسمح';
            break;
          case 5:
            se = 'The Appointment time less than Now time';
            sa = 'وقت الموعد يسبق الوقت الحالي';
            break;
          case 6:
            se = 'Appointment Table of operating room does not allow';
            sa = 'جدول المواعيد لغرفة العمليات لا يسمح';
            break;
          case 7:
            se = 'Waiting List Schedule does not allow';
            sa = 'جدول الانتظار لا يسمح';
            break;
          case 8:
            se = 'This patient has an appointment on the same day';
            sa = 'هذا المريض لديه موعد في نفس اليوم';
            break;
          case 9:
            se = 'The waiting schedule has reached the maximum allowed';
            sa = 'جدول مواعيد الانتظار وصل الحد الأقصى المسموح به';
            break;
        }

        if (lang === 'sArabic') {
          result.push(sa); // إضافة النص العربي إلى النتيجة
        } else {
          result.push(se); // إضافة النص الإنجليزي إلى النتيجة
        }
      }
    }
    return result;
  }
  // ErrorSavedResult(Lang, k) {
  //   const result = []; // بديل عن TStringList في Delphi

  //   if (k < 0) {
  //     const B = this.GetMySet(Math.abs(k)); // استدعاء الدالة GetMySet للحصول على المصفوفة B

  //     for (let i = 0; i < B.length; i++) {
  //       let se = ''; // النص بالإنجليزية
  //       let sa = ''; // النص بالعربية

  //       switch (B[i]) {
  //         case 0:
  //           se = 'The Time Attendance for doctor does not allow';
  //           sa = 'جدول دوام الطبيب لا يسمح';
  //           break;
  //         case 1:
  //           se = 'Schedule operating room time does not allow';
  //           sa = 'جدول دوام غرفة العمليات لا يسمح';
  //           break;
  //         case 2:
  //           se = 'Appointment within the period of blocked part of the agenda doctor';
  //           sa = 'الموعد ضمن فترة محجوبة من جدول دوام الطبيب';
  //           break;
  //         case 3:
  //           se = 'Appointment within the period of blocked part of the agenda operating room';
  //           sa = 'الموعد ضمن فترة محجوبة من جدول دوام غرفة العمليات';
  //           break;
  //         case 4:
  //           se = 'Appointment Table does not allow';
  //           sa = 'جدول المواعيد لا يسمح';
  //           break;
  //         case 5:
  //           se = 'The Appointment time less than Now time';
  //           sa = 'وقت الموعد يسبق الوقت الحالي';
  //           break;
  //         case 6:
  //           se = 'Appointment Table of operating room does not allow';
  //           sa = 'جدول المواعيد لغرفة العمليات لا يسمح';
  //           break;
  //         case 7:
  //           se = 'Waiting List Schedule does not allow';
  //           sa = 'جدول الإنتظار لا يسمح';
  //           break;
  //         case 8:
  //           se = 'This patient has an appointment on the same day';
  //           sa = 'هذا المريض لديه موعد في نفس اليوم';
  //           break;
  //         case 9:
  //           se = 'The waiting schedule has reached the maximum allowed';
  //           sa = 'جدول مواعيد الانتظار وصل الحد الأقصى المسموح به';
  //           break;
  //         default:
  //           // إذا كانت القيمة غير معروفة
  //           se = 'Unknown error';
  //           sa = 'خطأ غير معروف';
  //           break;
  //       }

  //       // إضافة النص المناسب بناءً على اللغة
  //       if (Lang === 'ar') {
  //         result.push(sa);
  //       } else {
  //         result.push(se);
  //       }
  //     }
  //   }

  //   return result; // إرجاع النتيجة كمصفوفة
  // }

  // دالة وهمية لـ GetMySet (يجب استبدالها بالدالة الفعلية)
  getMySet(S, byPower = false) {
    let B = [];
    let result = 0;
    let a = S.toString(2); // تحويل الرقم إلى تمثيل ثنائي (Binary)
    let k = 0;
    let j = 0;

    for (let i = a.length - 1; i >= 0; i--) {
      if (a[i] === '1') {
        j++;
        B[j - 1] = byPower ? Math.pow(2, k) : k;
      }
      k++;
    }

    result = j;
    return { result, B };
  }


  getSubWindow(no) {
    // alert(no);
    let Query = ``;
    switch (no) {
      case 1:
        Query = `select
          a.IDP,
          if((p.IDAcc>0 and Date(ifnull(a.ADate,0))=ifnull(p.createdDate,0)) or p.IDAcc<=0,"New","Old") PatientStatus,
          IfNull(c.Ac_Num,a.IDPatient) FileNo,p.NameE PatientName,
          cast(if(1=0 and a.AType=1 , Date(ifnull(a.ADate,0)) , ifnull(a.ADate,0) )  as DateTime) ADate,
          IfNull(i.PartNo,0) ServiceCode,IfNull(i.NameE,"") ServiceName,
          a.VisitType,Case a.VisitType when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end VType,
          e.SName DoctorCode,e.Full_Name_Eng DoctorName,
          IfNull(O.NameE,"") OperatingRoom ,
          a.Description,
          u.UserName OwnerUser,uu.UserName LastUser,
          a.AType, case a.Atype when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end ApintmentType,
          a.Duration,
          a.ConfirmCount, ifnull(a.CreatedDate,0) CreatedDate,
                  case When a.Attend=1 and cast(TIMEDIFF(a.AttendTime,Time(a.ADate)) as signed)<=0 then "Attend Early"
                        when a.Attend=1 and cast(TIMEDIFF(a.AttendTime,Time(a.ADate)) as signed)>=700 then "Attend Late"
                        when a.Attend<=0 then "Not Attend"
                        Else "Attend On time"
                  end AttendStatus,
                  case when a.Enter=1 and cast(TIMEDIFF(a.AttendEnter,Time(a.ADate)) as signed)<=0 then "Enter Early"
                        when a.Enter=1 and cast(TIMEDIFF(a.AttendEnter,Time(a.ADate)) as signed)>=700 then "Enter Late"
                        when a.Enter<=0 then "Not Enter"
                        Else "Enter On Time"
                  end EnterStatus,
                  case when a.AOut=1 and cast(TIMEDIFF(a.AttendOut,Time(a.ADate)+interval a.Duration minute) as signed)<=0 then "Out Early"
                        when a.AOut=1 and cast(TIMEDIFF(a.AttendOut,Time(a.ADate)+interval a.Duration minute) as signed)>=700 then "Out Late"
                        when a.AOut<=0 then "Not Out"
                        Else "Out On Time"
                  end OutStatus,
                  case when a.Attend=1 and a.Enter=1 and a.AOut=1 and TIME_TO_SEC(TIMEDIFF(a.AttendOut,a.AttendEnter))/60>a.Duration+5 then "Exceeded"
                        when a.Attend=1 and a.Enter=1 and a.AOut=1 and TIME_TO_SEC(TIMEDIFF(a.AttendOut,a.AttendEnter))/60<=a.Duration+5 then "Normal"
                        Else ""
                  end ExceededStatus,
          a.IDAgreement,IfNull(g.NameE,"") Agreement,
          a.Deleted,
          p.IDP TempFileNo,
          a.IDPatient,a.IDDoctor,a.IDOperatingRoom,a.Attend
          FROM appointments a Left join Employees e on e.IDC=a.IDC and a.IDDoctor=e.IDP
                              Left join OperatingRooms o on o.IDC=a.IDC and a.IDOperatingRoom=o.IDP
                              Left Join Items i on i.IDC=a.IDC and a.IDProcedure=i.IDP
                              Left Join Users u on u.ID=a.CreatedUser
                              Left Join Users uu on uu.ID=a.IdUser
                              Left Join agreements g on g.IDC=a.IDC and g.IDP=a.IDAgreement
                  ,Patients p Left join acc c on p.IDC=c.IDC and p.IDAcc=c.IDP
          where a.IDPatient=p.IDP and a.IDC=${this.all.User.IDC} and a.IDPatient=${this.all.Patient.IDP} 
        order by  a.Adate`;
        break;

      case 2:
        Query = `Select
        Concat(
        if(a.Status='Delete' , "Deleted ",""),
        if(a.Status='OutChange' , "Out Change ",""),
        if(a.AType<>a.ATypeChange,concat("AType Change From ",
                                        case a.Atype       when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end,
                                        " To ",
                                        case a.AtypeChange when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end," ")
                                ,""),

        if(Date(a.ADate)<>Date(a.ADateChange),Concat("ADate Changed From ",a.ADate," To ",a.ADateChange," "),""),
        if(Date(a.ADate)=Date(a.ADateChange) and a.ADate<>a.ADateChange,Concat("ATime Changed From ",Time(a.ADate)," To ",Time(a.ADateChange)," "),""),

        if(a.IDAgreement<>a.IDAgreementChange,Concat("Agreement Changed From ",g.NameE," To ",gg.NameE," "),""),
        if(a.IDOperatingRoom<>a.IDOperatingRoomChange,Concat("OperatingRoom Changed From ",O.NameE," To ",Oo.NameE," "),""),
        if(a.IDDoctor<>a.IDDoctorChange,Concat("Doctor Changed From ",e.SName ," ",e.Full_Name_Eng," To ",ee.SName ," ",ee.Full_Name_Eng," "),""),
        if(a.IDProcedure<>a.IDProcedureChange,Concat("Service Changed From ",i.PartNo," ",i.NameE," To ",ii.PartNo," ",ii.NameE," "),""),
        if(a.VisitType<>a.VisitTypeChange,concat("VisitType Change From ",
                                                        Case a.VisitType when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end,
                                                        " To ",
                                                        Case a.VisitTypeChange when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end," "),""),
        if(a.Duration<>a.DurationChange,Concat("Duration Changed From ",a.Duration," To ",a.DurationChange," "),""),
        if(a.Description<>a.DescriptionChange,Concat("Description Changed From (",a.Description,") To (",a.DescriptionChange,")"," "),""),
        if(a.IDPatient<>a.IDPatientChange , Concat("Patient Changed From ",IfNull(c.Ac_Num,a.IDPatient)," ",p.NameE," To ",IfNull(cc.Ac_Num,a.IDPatientChange)," ",pp.NameE," "),""),
        Concat("By ",uu.UserName)
        ) ChangeStatus,
        a.AppointmentID,
        uc.UserName CreatedUser,
        a.ChangeDate,
        a.Status,
        a.ConfirmCount,
        a.AType , case a.Atype when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end ApintmentType,
        a.ATypeChange,case a.ATypeChange when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end ApintmentTypeChange,
        a.ADate,
        a.ADateChange,
        a.IDAgreement,IfNull(g.NameE,"") Agreement,
        a.IDAgreementChange,IfNull(gg.NameE,"") AgreementChange,
        a.IDOperatingRoom      ,IfNull(O.NameE,"") OperatingRoom ,
        a.IDOperatingRoomChange,IfNull(Oo.NameE,"") OperatingRoomChange ,
        a.IDDoctor           ,e.SName DoctorCode,e.Full_Name_Eng DoctorName,
        a.IDDoctorChange     ,ee.SName DoctorCodeChange,ee.Full_Name_Eng DoctorNameChange,
        a.IDProcedure      ,IfNull(i.PartNo,0) ServiceCode,IfNull(i.NameE,"") ServiceName,
        a.IDProcedureChange,IfNull(ii.PartNo,0) ServiceCodeChange,IfNull(ii.NameE,"") ServiceNameChange,
        a.VisitType,Case a.VisitType when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end VType,
        a.VisitTypeChange,Case a.VisitTypeChange when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end VTypeChange,
        a.Duration,
        a.DurationChange,
        a.Description,
        a.DescriptionChange,
        a.IDPatient      ,IfNull( c.Ac_Num,a.IDPatient)       FileNo      , p.NameE PatientName,
        a.IDPatientChange,IfNull(cc.Ac_Num,a.IDPatientChange) FileNoChange,pp.NameE PatientNameChange,
        a.IDUser           ,u.UserName LastUser,
        a.IDUserChange     ,uu.UserName LastUserChange
        FROM appointmentChange a Left join Employees e on e.IDC=a.IDC and a.IDDoctor=e.IDP
                                Left join Employees ee on ee.IDC=a.IDC and a.IDDoctorChange=ee.IDP
                                Left join OperatingRooms o on o.IDC=a.IDC and a.IDOperatingRoom=o.IDP
                                Left join OperatingRooms oo on oo.IDC=a.IDC and a.IDOperatingRoomChange=oo.IDP
                                Left Join Items i on i.IDC=a.IDC and a.IDProcedure=i.IDP
                                Left Join Items ii on ii.IDC=a.IDC and a.IDProcedureChange=ii.IDP
                                Left Join Users uc on uc.ID=a.CreatedUser
                                Left Join Users u on u.ID=a.IdUser
                                Left Join Users uu on uu.ID=a.IdUserChange
                                Left Join Patients p on p.IDC=a.IDC and a.IDPatient=p.IDP
                                Left join acc c on p.IDC=c.IDC and p.IDAcc=c.IDP
                                Left join Patients pp on pp.IDC=a.IDC and a.IDPatientChange=pp.IDP
                                Left join acc cc on pp.IDC=cc.IDC and pp.IDAcc=cc.IDP
                                Left Join agreements g on g.IDC=a.IDC and g.IDP=a.IDAgreement
                                Left Join agreements gg on gg.IDC=a.IDC and gg.IDP=a.IDAgreementChange
        where a.IDC=${this.all.User.IDC} and
        (
        (1=0 and a.AppointmentID=0) Or
        (0=0 and a.IDPatient=${this.all.Patient.IDP}) or
        (2=0 and Date(a.ChangeDate)>=Date("2010-03-21") and Date(a.ChangeDate)<=Date("2010-03-22") and Find_In_Set(a.IDDoctor, "")>0)
        )
        Order by ChangeDate`;
        break;
      case 3:

        //       call PatientStatment(1,"2005-01-01","2025-03-18",0); -- ,0,51 ; -- [218]
        // -- _____________________
        // SELECT 0 ID,0 IDP,"None" NameE,"None" NameA Union All SELECT ID,IDP,NameE,NameA FROM agreements a where IDC=1; -- ,0,51 ; -- [1171]
        // -- _____________________
        // Call UpdateLogON2("192.168.48.1",17,1,"D:/Musef/WikiMed/MedAcc.exe",2002000774,1,"2307078464","00-50-56-C0-00-01","wikimed.selfip.com","Windows 11 (Version 24H2, OS Build 26100.3476, 64-bit Edition)","Nitro",1,1); -- ,0,51 ; -- [250]
        // -- _____________________
        // Select ID,IDUser,Active,CreateDate,ExpireDate,FileName,TargetFolder,UpdateIfExist,UpdateCount,MessageForClient,DoneClientsPC,IsLocked From FilesForCopyToClients Where active=1 and IsLocked=0 and ExpireDate>=CurDate(); -- ,0,51 ; -- [140]

        // console.log(`this.all.Patient= `, this.all.Patient);

        // Query = `call PatientStatment(${this.all.User.IDC},"2005-01-01",now(),149018)`;
        // alert(JSON.stringify(this.all.Patient));
        console.log(this.all.Patient);
        if (this.all.Patient.IDAcc == undefined) {
          this.all.tblSubWinItems = [];
          this.all.SubScheduleWindows = {
            No: no,
            Visible: true,
            tblItem: [],
            Footer: {
              NetInvoice: 0,
              Cash: 0,
              Credit: 0,
              Reciept: 0,
              Payment: 0,
              Debit: 0,
              Balance: 0,
            },
          }
          return;
        }

        Query = `call PatientStatment(${this.all.User.IDC},"2005-01-01",now(),${this.all.Patient.IDAcc})
        ;SELECT 0 ID,0 IDP,"None" NameE,"None" NameA Union All SELECT ID,IDP,NameE,NameA FROM agreements a where IDC=${this.all.User.IDC}`;
        // alert(Query);
        break;
      case 4:
        Query = `Select ifNull(ac.Ac_Num,0) FileNo,p.NameE,p.NameA,p.Phon1 , q.ADate OrderDate,
        q.ID, q.IDC, q.IDY, q.IDP, q.IDBranch, q.IDAppointment, q.IDDoctor,e.SName Doctor, q.IDOperatingRoom, q.IDPatient,
        q.IDUser,ifnull(u.UserName,"") RequiredUser, q.DateFrom, q.WithinDays, q.AType, q.IDService, q.Duration, q.Description, 
        q.IDAppt, q.IDTranDoctor, q.join_url ,
        ifNull(Date(af.ADate),"2010-01-01") DoneDate, ifNull(af.CreatedUser,0) DoneIDUser, ifNull(uf.UserName,0) DoneUser
        from AppointmentsRequired q
        inner join patients p on q.idc=p.idc and q.IDPatient=p.IDP
        inner join Employees e on e.idc=q.idc and e.idp=q.IDDoctor
        Left join users u on u.id=q.IDUser
        Left join Acc ac on ac.idc=p.idc and ac.IDP=p.IDAcc
        Left join appointments af on q.idc=af.idc and q.IDAppt=af.idp and q.IDy=af.IDY
        Left join users uf on uf.id=af.CreatedUser

        Where q.IDC=${this.all.User.IDC} 
        and Date(q.ADate)>=CurDate()-interval 14 Day
        and Date(q.ADate)<=CurDate()
        order by if(DoneDate<=0,OrderDate,"2060-01-01")`;
        break;
      // default:
      //   break;
    }


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
      console.log(`Q0= `, res[`Q0`]);
      // this.nav.navigateForward(page);D
      // this.all.tblSubWinItems = res[`Q0`];
      this.all.tblSubWinItems = [];
      let tblItem = res[`Q0`];

      let Footer: any = {};

      switch (no) {
        case 1:
          for (let item of tblItem) {
            this.all.tblSubWinItems.push({
              PrivateID: item.IDP,
              PatientStatus: item.PatientStatus,
              FileNo: item.FileNo,
              PatientName: item.PatientName,
              Date: item.ADate,
              ServiceCode: item.ServiceCode,
              ServiceName: item.ServiceName,
              VType: item.VType,
              DoctorCode: item.DoctorCode,
              DoctorName: item.DoctorName,
              OperatingRoom: item.OperatingRoom,
              Description: item.Description,
              OwnerUser: item.OwnerUser,
              LastUser: item.LastUser,
              ApintmentType: item.ApintmentType,
              Duration: item.Duration,
              ConfirmCount: item.ConfirmCount,
              CreatedDate: item.CreatedDate,
              AttendStatus: item.AttendStatus,
              EnterStatus: item.EnterStatus,
              OutStatus: item.OutStatus,
              ExceededStatus: item.ExceededStatus,
              Agreement: item.Agreement,
              Deleted: item.Deleted,
              TempFileNo: item.TempFileNo,
            });
          }
          break;
        case 2:
          for (let item of tblItem) {
            this.all.tblSubWinItems.push({
              AppointmentID: item.AppointmentID,
              CreatedUser: item.CreatedUser,
              ChangeDate: item.ChangeDate,
              Status: item.Status,
              ConfirmCount: item.ConfirmCount,

              ApintmentType: item.ApintmentType,
              ApintmentTypeChange: item.ApintmentTypeChange,

              DateTime: item.ADate,
              DateTimeChange: item.ADateChange,

              Agreement: item.Agreement,
              AgreementChange: item.AgreementChange,

              OperatingRoom: item.OperatingRoom,
              OperatingRoomChange: item.OperatingRoomChange,

              DoctorCode: item.DoctorCode,
              DoctorName: item.DoctorName,

              DoctorCodeChange: item.DoctorCodeChange,
              DoctorNameChange: item.DoctorNameChange,

              ServiceCode: item.ServiceCode,
              ServiceName: item.ServiceName,
              ServiceCodeChange: item.ServiceCodeChange,
              ServiceNameChange: item.ServiceNameChange,


              VType: item.VType,
              VTypeChange: item.VTypeChange,

              Duration: item.Duration,
              DurationChange: item.DurationChange,

              Description: item.Description,
              DescriptionChange: item.DescriptionChange,

              FileNo: item.FileNo,
              PatientName: item.PatientName,
              FileNoChange: item.FileNoChange,
              PatientNameChange: item.PatientNameChange,

              LastUser: item.LastUser,
              LastUserChange: item.LastUserChange,
            });
          }
          break;
        case 3:
          let tblAgr = res[`Q1`];

          let NetInvoice = 0;
          let Cash = 0;
          let Credit = 0;
          let Reciept = 0;
          let Payment = 0;
          let Debit = 0;
          let Balance = 0;
          for (let item of tblItem) {
            NetInvoice += +item.TotalInvoice;
            Cash += +item.Cash;
            Credit += +item.Credit;
            Reciept += +item.Reciept;
            Payment += +item.Payment;
            Debit += +item.Debit;
            Balance += +item.Balance;

            this.all.tblSubWinItems.push({
              Date: item.ADate,
              IDV: item.IDV,
              VType: item.VType,
              Doctor: item.DoctorName,
              Agreement: item.IDAgreement == 0 ? '' : tblAgr.find(x => x.IDP == item.IDAgreement)['Name' + this.all.LangLetter],
              Description: item.Description,
              TotalPrice: item.TotalPrice,
              TotalDiscount: item.TotalDiscount,
              NetInvoice: item.TotalInvoice,
              Cash: item.Cash,
              Credit: item.Credit,
              Reciept: item.Reciept,
              Payment: item.Payment,
              Debit: item.Debit,
              Balance: item.Balance,
            });
          }


          Footer = {
            NetInvoice: NetInvoice,
            Cash: Cash,
            Credit: Credit,
            Reciept: Reciept,
            Payment: Payment,
            Debit: Debit,
            Balance: Balance,
          };
          // this.all.tblSubWinItems = res[`Q0`];
          break;

        case 4:
          for (let item of tblItem) {
            this.all.tblSubWinItems.push({
              ID: item.ID,
              RequiredUser: item.RequiredUser,
              OrderDate: item.OrderDate,
              Branch: this.all.tblBranch.find(x => x.IDP == item.IDBranch)[`Name` + this.all.LangLetter],
              FileNo: item.FileNo,
              NameE: item.NameE,
              Phon1: item.Phon1,
              Doctor: item.Doctor,
              DateFrom: item.DateFrom,
              WithinDaysCount: item.WithinDays,
              AppointmentType: this.all.tblAType.find(x => x.ID == item.AType)[`Name` + this.all.LangLetter],
              Duration: item.Duration,
              Description: item.Description,
              DoneDate: item.DoneDate,
              DoneUser: item.DoneUser
            });
          }
          // alert( this.all.tblSubWinItems.filter(x=>x.DoneDate=="").length );
          // alert( this.all.tblSubWinItems.filter(x=>x.DoneDate=='2010-01-01').length );
          // this.all.tblSubWinItems = res[`Q0`];
          break;
      };


      //   {
      //     "IDP": 101199372,
      //     "PatientStatus": "New",
      //     "FileNo": 100357137,
      //     "PatientName": "Salem Saleem",
      //     "ADate": "2025-03-09 16:30:00",
      //     "ServiceCode": "0",
      //     "ServiceName": "",
      //     "VisitType": 0,
      //     "VType": "First Visit",
      //     "DoctorCode": "0114",
      //     "DoctorName": "TC.Aldna",
      //     "OperatingRoom": "",
      //     "Description": "",
      //     "OwnerUser": "Administrator",
      //     "LastUser": "Administrator",
      //     "AType": 0,
      //     "ApintmentType": "Real",
      //     "Duration": 10,
      //     "ConfirmCount": 0,
      //     "CreatedDate": "2025-03-07 14:03:42",
      //     "AttendStatus": "Not Attend",
      //     "EnterStatus": "Not Enter",
      //     "OutStatus": "Not Out",
      //     "ExceededStatus": "",
      //     "IDAgreement": 0,
      //     "Agreement": "",
      //     "Deleted": 0,
      //     "TempFileNo": 100357137,
      //     "IDPatient": 100357137,
      //     "IDDoctor": 77,
      //     "IDOperatingRoom": 0,
      //     "Attend": 0
      // }

      console.log(`tblItem= `, tblItem);
      this.all.SubScheduleWindows = {
        No: no,
        Visible: true,
        tblItem: tblItem,
        Footer: Footer,
      }
    });
  }


  // getPatientAppts(no) {
  //   // alert(this.all.Patient.IDP); // 300125565
  //   let Query = `select
  //     a.IDP,
  //     if((p.IDAcc>0 and Date(ifnull(a.ADate,0))=ifnull(p.createdDate,0)) or p.IDAcc<=0,"New","Old") PatientStatus,
  //     IfNull(c.Ac_Num,a.IDPatient) FileNo,p.NameE PatientName,
  //     cast(if(1=0 and a.AType=1 , Date(ifnull(a.ADate,0)) , ifnull(a.ADate,0) )  as DateTime) ADate,
  //     IfNull(i.PartNo,0) ServiceCode,IfNull(i.NameE,"") ServiceName,
  //     a.VisitType,Case a.VisitType when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end VType,
  //     e.SName DoctorCode,e.Full_Name_Eng DoctorName,
  //     IfNull(O.NameE,"") OperatingRoom ,
  //     a.Description,
  //     u.UserName OwnerUser,uu.UserName LastUser,
  //     a.AType, case a.Atype when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end ApintmentType,
  //     a.Duration,
  //     a.ConfirmCount, ifnull(a.CreatedDate,0) CreatedDate,
  //             case When a.Attend=1 and cast(TIMEDIFF(a.AttendTime,Time(a.ADate)) as signed)<=0 then "Attend Early"
  //                   when a.Attend=1 and cast(TIMEDIFF(a.AttendTime,Time(a.ADate)) as signed)>=700 then "Attend Late"
  //                   when a.Attend<=0 then "Not Attend"
  //                   Else "Attend On time"
  //             end AttendStatus,
  //             case when a.Enter=1 and cast(TIMEDIFF(a.AttendEnter,Time(a.ADate)) as signed)<=0 then "Enter Early"
  //                   when a.Enter=1 and cast(TIMEDIFF(a.AttendEnter,Time(a.ADate)) as signed)>=700 then "Enter Late"
  //                   when a.Enter<=0 then "Not Enter"
  //                   Else "Enter On Time"
  //             end EnterStatus,
  //             case when a.AOut=1 and cast(TIMEDIFF(a.AttendOut,Time(a.ADate)+interval a.Duration minute) as signed)<=0 then "Out Early"
  //                   when a.AOut=1 and cast(TIMEDIFF(a.AttendOut,Time(a.ADate)+interval a.Duration minute) as signed)>=700 then "Out Late"
  //                   when a.AOut<=0 then "Not Out"
  //                   Else "Out On Time"
  //             end OutStatus,
  //             case when a.Attend=1 and a.Enter=1 and a.AOut=1 and TIME_TO_SEC(TIMEDIFF(a.AttendOut,a.AttendEnter))/60>a.Duration+5 then "Exceeded"
  //                   when a.Attend=1 and a.Enter=1 and a.AOut=1 and TIME_TO_SEC(TIMEDIFF(a.AttendOut,a.AttendEnter))/60<=a.Duration+5 then "Normal"
  //                   Else ""
  //             end ExceededStatus,
  //     a.IDAgreement,IfNull(g.NameE,"") Agreement,
  //     a.Deleted,
  //     p.IDP TempFileNo,
  //     a.IDPatient,a.IDDoctor,a.IDOperatingRoom,a.Attend
  //     FROM appointments a Left join Employees e on e.IDC=a.IDC and a.IDDoctor=e.IDP
  //                         Left join OperatingRooms o on o.IDC=a.IDC and a.IDOperatingRoom=o.IDP
  //                         Left Join Items i on i.IDC=a.IDC and a.IDProcedure=i.IDP
  //                         Left Join Users u on u.ID=a.CreatedUser
  //                         Left Join Users uu on uu.ID=a.IdUser
  //                         Left Join agreements g on g.IDC=a.IDC and g.IDP=a.IDAgreement
  //             ,Patients p Left join acc c on p.IDC=c.IDC and p.IDAcc=c.IDP
  //     where a.IDPatient=p.IDP and a.IDC=${this.all.User.IDC} and a.IDPatient=${this.all.Patient.IDP} 
  //   order by  a.Adate`;

  //   console.log(`Query= `, Query);

  //   const body = new HttpParams()
  //     .set('Mtype', 'A16')
  //     .set('Query', Query);

  //   this.all.postData(body).then(res => {
  //     if (res[`Q0Error`] != "") {
  //       this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
  //       console.log(`Q0Error= `, res[`Q0Error`]);
  //       return;
  //     }
  //     // this.nav.navigateForward(page);
  //     this.all.tblSubWinItems = res[`Q0`];
  //     this.all.SubScheduleWindows = {
  //       No: no,
  //       Visible: true,
  //     }
  //   });
  // }

  // getPatientApptModifications1(no) {
  //   let Query = `Select
  //     Concat(
  //     if(a.Status='Delete' , "Deleted ",""),
  //     if(a.Status='OutChange' , "Out Change ",""),
  //     if(a.AType<>a.ATypeChange,concat("AType Change From ",
  //                                     case a.Atype       when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end,
  //                                     " To ",
  //                                     case a.AtypeChange when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end," ")
  //                             ,""),

  //     if(Date(a.ADate)<>Date(a.ADateChange),Concat("ADate Changed From ",a.ADate," To ",a.ADateChange," "),""),
  //     if(Date(a.ADate)=Date(a.ADateChange) and a.ADate<>a.ADateChange,Concat("ATime Changed From ",Time(a.ADate)," To ",Time(a.ADateChange)," "),""),

  //     if(a.IDAgreement<>a.IDAgreementChange,Concat("Agreement Changed From ",g.NameE," To ",gg.NameE," "),""),
  //     if(a.IDOperatingRoom<>a.IDOperatingRoomChange,Concat("OperatingRoom Changed From ",O.NameE," To ",Oo.NameE," "),""),
  //     if(a.IDDoctor<>a.IDDoctorChange,Concat("Doctor Changed From ",e.SName ," ",e.Full_Name_Eng," To ",ee.SName ," ",ee.Full_Name_Eng," "),""),
  //     if(a.IDProcedure<>a.IDProcedureChange,Concat("Service Changed From ",i.PartNo," ",i.NameE," To ",ii.PartNo," ",ii.NameE," "),""),
  //     if(a.VisitType<>a.VisitTypeChange,concat("VisitType Change From ",
  //                                                     Case a.VisitType when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end,
  //                                                     " To ",
  //                                                     Case a.VisitTypeChange when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end," "),""),
  //     if(a.Duration<>a.DurationChange,Concat("Duration Changed From ",a.Duration," To ",a.DurationChange," "),""),
  //     if(a.Description<>a.DescriptionChange,Concat("Description Changed From (",a.Description,") To (",a.DescriptionChange,")"," "),""),
  //     if(a.IDPatient<>a.IDPatientChange , Concat("Patient Changed From ",IfNull(c.Ac_Num,a.IDPatient)," ",p.NameE," To ",IfNull(cc.Ac_Num,a.IDPatientChange)," ",pp.NameE," "),""),
  //     Concat("By ",uu.UserName)
  //     ) ChangeStatus,
  //     a.AppointmentID,
  //     uc.UserName CreatedUser,
  //     a.ChangeDate,
  //     a.Status,
  //     a.ConfirmCount,
  //     a.AType , case a.Atype when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end ApintmentType,
  //     a.ATypeChange,case a.ATypeChange when 0 then "Real" when 1 then "Waiting" when 2 then "All" when 3 then "WalkIn" end ApintmentTypeChange,
  //     a.ADate,
  //     a.ADateChange,
  //     a.IDAgreement,IfNull(g.NameE,"") Agreement,
  //     a.IDAgreementChange,IfNull(gg.NameE,"") AgreementChange,
  //     a.IDOperatingRoom      ,IfNull(O.NameE,"") OperatingRoom ,
  //     a.IDOperatingRoomChange,IfNull(Oo.NameE,"") OperatingRoomChange ,
  //     a.IDDoctor           ,e.SName DoctorCode,e.Full_Name_Eng DoctorName,
  //     a.IDDoctorChange     ,ee.SName DoctorCodeChange,ee.Full_Name_Eng DoctorNameChange,
  //     a.IDProcedure      ,IfNull(i.PartNo,0) ServiceCode,IfNull(i.NameE,"") ServiceName,
  //     a.IDProcedureChange,IfNull(ii.PartNo,0) ServiceCodeChange,IfNull(ii.NameE,"") ServiceNameChange,
  //     a.VisitType,Case a.VisitType when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end VType,
  //     a.VisitTypeChange,Case a.VisitTypeChange when 0 then "First Visit" when 1 then "Follow up" when 2 then "Return" when 3 then "Procedure Room" when 4 then "Clinic Procedure" end VTypeChange,
  //     a.Duration,
  //     a.DurationChange,
  //     a.Description,
  //     a.DescriptionChange,
  //     a.IDPatient      ,IfNull( c.Ac_Num,a.IDPatient)       FileNo      , p.NameE PatientName,
  //     a.IDPatientChange,IfNull(cc.Ac_Num,a.IDPatientChange) FileNoChange,pp.NameE PatientNameChange,
  //     a.IDUser           ,u.UserName LastUser,
  //     a.IDUserChange     ,uu.UserName LastUserChange
  //     FROM appointmentChange a Left join Employees e on e.IDC=a.IDC and a.IDDoctor=e.IDP
  //                             Left join Employees ee on ee.IDC=a.IDC and a.IDDoctorChange=ee.IDP
  //                             Left join OperatingRooms o on o.IDC=a.IDC and a.IDOperatingRoom=o.IDP
  //                             Left join OperatingRooms oo on oo.IDC=a.IDC and a.IDOperatingRoomChange=oo.IDP
  //                             Left Join Items i on i.IDC=a.IDC and a.IDProcedure=i.IDP
  //                             Left Join Items ii on ii.IDC=a.IDC and a.IDProcedureChange=ii.IDP
  //                             Left Join Users uc on uc.ID=a.CreatedUser
  //                             Left Join Users u on u.ID=a.IdUser
  //                             Left Join Users uu on uu.ID=a.IdUserChange
  //                             Left Join Patients p on p.IDC=a.IDC and a.IDPatient=p.IDP
  //                             Left join acc c on p.IDC=c.IDC and p.IDAcc=c.IDP
  //                             Left join Patients pp on pp.IDC=a.IDC and a.IDPatientChange=pp.IDP
  //                             Left join acc cc on pp.IDC=cc.IDC and pp.IDAcc=cc.IDP
  //                             Left Join agreements g on g.IDC=a.IDC and g.IDP=a.IDAgreement
  //                             Left Join agreements gg on gg.IDC=a.IDC and gg.IDP=a.IDAgreementChange
  //     where a.IDC=${this.all.User.IDC} and
  //     (
  //     (1=0 and a.AppointmentID=0) Or
  //     (0=0 and a.IDPatient=${this.all.Patient.IDP}) or
  //     (2=0 and Date(a.ChangeDate)>=Date("2010-03-21") and Date(a.ChangeDate)<=Date("2010-03-22") and Find_In_Set(a.IDDoctor, "")>0)
  //     )
  //     Order by ChangeDate`;

  //   console.log(`Query= `, Query);

  //   const body = new HttpParams()
  //     .set('Mtype', 'A16')
  //     .set('Query', Query);
  //   this.all.postData(body).then(res => {
  //     if (res[`Q0Error`] != "") {
  //       this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
  //       console.log(`Q0Error= `, res[`Q0Error`]);
  //       return;
  //     }
  //     // this.nav.navigateForward(page);
  //     this.all.tblSubWinItems = res[`Q0`];
  //     this.all.SubScheduleWindows = {
  //       No: no,
  //       Visible: true,
  //     }
  //   });
  // }

  changeTime(dateString, newTime) {
    // تقسيم الساعة الجديدة إلى ساعات ودقائق
    let [newHours, newMinutes] = newTime.split(':');

    // تحويل التاريخ الأصلي إلى كائن Date
    let date = new Date(dateString.replace(' ', 'T'));

    // تحديث الساعة والدقائق في كائن Date
    date.setHours(parseInt(newHours, 10));
    date.setMinutes(parseInt(newMinutes, 10));
    date.setSeconds(0); // إعادة الثواني إلى الصفر

    // إنشاء النص المحدث يدويًا
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // الأشهر من 0 إلى 11
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    let updatedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return updatedDateString;
  }


  // ##################################

  // إنشاء عناصر العدادات في الصفحة
  // createTimers(Arr) {
  //   const container = document.getElementById('timersContainer');

  //   Arr.forEach((item, index) => {
  //     const timerElement = document.createElement('div');
  //     timerElement.className = 'timer-item';
  //     timerElement.id = `timer-${index}`;
  //     timerElement.textContent = '0:00';
  //     container.appendChild(timerElement);
  //   });
  // }

  // تحويل الوقت المحدد إلى كائن Date
  // getAttendDateTime(attendTime) {
  //   const today = new Date();
  //   const [hours, minutes, seconds] = attendTime.split(':').map(Number);

  //   const attendDate = new Date();
  //   attendDate.setHours(hours);
  //   attendDate.setMinutes(minutes);
  //   attendDate.setSeconds(seconds);

  //   // إذا كان الوقت المحدد قد مر اليوم، نضيف يومًا
  //   if (attendDate > today) {
  //     attendDate.setDate(attendDate.getDate() - 1);
  //   }

  //   return attendDate;
  // }



  // calculateElapsedTime(item) {
  //   const now: any = new Date();
  //   const attendDate: any = this.getAttendDateTime(item.AttendTime);
  //   const elapsed = now - attendDate;
  //   const totalSeconds = Math.floor(elapsed / 1000);
  //   const minutes = Math.floor(totalSeconds / 60);
  //   const seconds = totalSeconds % 60;
  //   return { minutes, seconds };
  // }

  // // حساب الوقت المنقضي لكل عنصر
  // calculateElapsedTimes(Arr) {
  //   const now: any = new Date();
  //   return Arr.map(item => {
  //     const attendDate: any = this.getAttendDateTime(item.AttendTime);
  //     const elapsed = now - attendDate;

  //     const totalSeconds = Math.floor(elapsed / 1000);
  //     const minutes = Math.floor(totalSeconds / 60);
  //     const seconds = totalSeconds % 60;

  //     return { minutes, seconds };
  //   });
  // }

  // // تحديث جميع العدادات
  // updateAllTimers(Arr) {
  //   const elapsedTimes = this.calculateElapsedTimes(Arr);
  //   // console.log(Arr);
  //   elapsedTimes.forEach((time, index) => {
  //     // console.log(Arr[index]);
  //     const timerElement = document.getElementById(`timer-${Arr[index].ID}`);
  //     // console.log(`timerElement= `, timerElement);
  //     timerElement.textContent = `${time.minutes}:${time.seconds.toString().padStart(2, '0')}`;

  //     // فلاش الخلفية
  //     timerElement.classList.add('flash');
  //     setTimeout(() => {
  //       timerElement.classList.remove('flash');
  //     }, 300);
  //   });
  // }

  calculateTimeDifference(ADate, AttendTime) {
    // تحويل تاريخ الموعد إلى كائن Date
    const appointmentDate: any = new Date(ADate);

    // تقسيم وقت الحضور إلى ساعات، دقائق، ثواني
    const [attendHours, attendMinutes, attendSeconds] = AttendTime.split(':').map(Number);

    // إنشاء كائن تاريخ لوقت الحضور (بنفس يوم الموعد)
    const attendDate: any = new Date(appointmentDate);
    attendDate.setHours(attendHours, attendMinutes, attendSeconds);

    // حساب الفرق بالميلي ثانية
    const diffMs = attendDate - appointmentDate;

    // تحويل الفرق إلى ساعات، دقائق، ثواني
    const totalSeconds = Math.floor(Math.abs(diffMs) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // تحديد إذا كان الحضور مبكراً أم متأخراً
    const isLate = diffMs > 0;

    return {
      hours,
      minutes,
      seconds,
      isLate,
      diffMs
    };
  }

}
