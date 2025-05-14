import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-next-available',
  templateUrl: './next-available.component.html',
  styleUrls: ['./next-available.component.scss'],
})
export class NextAvailableComponent implements OnInit {

  @Input("IDDoctor") IDDoctor: any = 0;
  @Input("IDOperatingRoom") IDOperatingRoom: any = 0;
  @Input("Duration") Duration: any = 15;
  @Input("AType") AType: any = 0;

  // AType = 0;

  SearchDate = this.all.getDateNow(`-`);
  // tblNextAppt = [
  //   { "ID": "12", "IDBranch": "1", "AppDate": "2025-02-02T12:05:50.066Z", "AppDateH": "1443-08-25", "AppTime": "9:00:00 AM", "DayNo": "1", "Duration": "60" },
  //   { "ID": "12", "IDBranch": "1", "AppDate": "2025-02-02T18:05:50.066Z", "AppDateH": "1443-08-25", "AppTime": "9:00:00 AM", "DayNo": "1", "Duration": "60" },
  // ];
  tblNextAppt = [];
  // AppType = `Real`;
  constructor(public all: AllService, private modalController: ModalController) { }

  ngOnInit() {
    this.getNextAppt();
    // alert(this.IDDoctor);
  }

  getNext() {
    let LastOne = this.tblNextAppt[this.tblNextAppt.length - 1];
    let StartSearchAt = LastOne.AppDate + ' ' + LastOne.AppTime;
    this.getNextAppt(StartSearchAt);
  }

  roundToNearestMultipleOf5() {
    let rounded = Math.round(this.Duration / 5) * 5;
    this.Duration = rounded < 5 ? 5 : rounded;
  }


  getDoctor() {
    if (this.all.tblDoctors.filter(x => x.IDP == this.IDDoctor).length == 0) {
      return "";
    } else {
      return this.all.tblDoctors.filter(x => x.IDP == this.IDDoctor)[0]["Name" + this.all.LangLetter];
    }
  }

  getRoom() {
    if (this.all.tblRooms.filter(x => x.IDP == this.IDOperatingRoom).length == 0) {
      return "";
    } else {
      return this.all.tblRooms.filter(x => x.IDP == this.IDOperatingRoom)[0]["Name" + this.all.LangLetter];
    }
  }

  getNextAppt(StartSearchAt = null) {
    this.tblNextAppt = [];
    if (StartSearchAt == null) {
      StartSearchAt = this.SearchDate + " 00:00:00";
    }
    // alert(this.SearchDate);
    // return;
    let Query = `Call AppointmentNextAvailable(${this.all.User.IDC},${this.all.RegisterData.Branch},${this.IDDoctor},${this.IDOperatingRoom},"${StartSearchAt}",${this.Duration},${this.AType},2,0,1,0)`;
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

  close() {
    this.modalController.dismiss();
  }

  get(item) {
    console.log(item);
    let AppType = this.IDDoctor + "-" + (this.AType == 0 ? `Real` : `Wait`);
    if (this.IDDoctor == 0) {
      AppType = this.IDOperatingRoom + "-Room" ;
    }
    this.modalController.dismiss({ NextAppt: item, AppType: AppType }, 'confirm');

    // let AppType = this.AType == 0 ? `Real` : `Wait`;
    // this.modalController.dismiss({ NextAppt: item, AppType: this.IDDoctor + "-" + AppType }, 'confirm');
  }

  appTypeChanged(ev) {
    this.AType = ev.detail.value;

    this.getNextAppt();
  }

  getDayName(dayNumber) {
    const days = {
      1: { E: 'Sunday', A: 'الأحد' },
      2: { E: 'Monday', A: 'الاثنين' },
      3: { E: 'Tuesday', A: 'الثلاثاء' },
      4: { E: 'Wednesday', A: 'الأربعاء' },
      5: { E: 'Thursday', A: 'الخميس' },
      6: { E: 'Friday', A: 'الجمعة' },
      7: { E: 'Saturday', A: 'السبت' },
    };

    return days[dayNumber] || { E: 'Invalid day', A: 'يوم غير صحيح' };
  }

  formatTime(timeString) {
    // إزالة الثواني من الوقت
    return timeString.replace(/:\d{2}\s/, ' ');
  }


}


// Call AppointmentNextAvailable(1,1,77,0,"2025-03-16 00:00:00",30,0,2,0,1,0); -- ,0,51 ; -- [922]
// -- _____________________
// Call AppointmentNextAvailable(1,1,77,0,"2025-05-15 19:00:00",30,0,2,0,1,0);