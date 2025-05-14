import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
// import { AllService } from '../services/all.service';
// import { ApptService } from '../services/appt.service';
import { HttpParams } from '@angular/common/http';
import { AllService } from 'src/app/services/all.service';
import { RtfService } from 'src/app/services/rtf.service';
import { ApptService } from 'src/app/services/appt.service';
import { DatetimeService } from 'src/app/services/datetime.service';
// import { RtfService } from '../services/rtf.service';
// import { DatetimeService } from '../services/datetime.service';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import umalqura from '@umalqura/core';

@Component({
  selector: 'app-appointmen1',
  templateUrl: './appointmen1.page.html',
  styleUrls: ['./appointmen1.page.scss'],
})
export class Appointmen1Page implements OnInit {
  // tblDoctors = [
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
  //     ID: 5, IDP: 5, IDF: 1, NameA: 'Dr.maher', No: `0015`, Progress: 0.2
  //   },
  // ];
  DrInfo = '';
  tblDrName = [`SName`, `NameA`, `NameE`];
  DoctorName = 0; // `NameA` `NameE`  sName
  changeDrName() {
    if (this.DoctorName == 2) {
      this.DoctorName = 0;
    } else {
      this.DoctorName++;
    }
  }
  constructor(private nav: NavController, public all: AllService,
    public appt: ApptService, private rtf: RtfService,
    public popoverController: PopoverController,
    private alertController: AlertController, private datetime: DatetimeService) { }



  ngOnInit() {
    // this.all.getData(`?MType=200&HCode=15341452`).then(res=>{
    //   console.log(res);
    // });
    var currentDate = new Date(new Date().getTime());
    // var now = umalqura(currentDate);
    var now2 = this.all.getHijriDate(currentDate.toString());
    // alert(JSON.stringify(now));
    // console.log(`now= `, now);
    console.log(`now2= `, now2);
    // console.log(`hy= `, now[`hy`]);
    // console.log(`hm= `, now[`hm`]);
    // console.log(`hd= `, now[`hd`]);


    this.all.getfirstLoad().then(res => {
      if (res) {
        console.log(`qqq= `, JSON.stringify(this.all.tblDoctors.filter(x => x.SchedulePersent > 100)));
        // let Query1 = `Call DoctorsList(1,"","","0")`;
        // let Query2 = `SELECT ID,IDP,IDC,Datastream FROM employees e where e.ID_Job=7 and e.IDC=1 and not (e.Emp_Status in (2,3))`;
        // let Query3 = `Select * from ( select 0 RType,b.IDC,10000*b.IDP IDP,0 IDF,b.IDP IDBranch,0 ID_Dept,b.NameA, b.NameE,"" SName,0 DurationTime, 0 IDAttendance,b.Serial IDSort ,0 RoomType,0 IDDoctor,0 Checked from Branchs b inner join OperatingRooms o on b.idc=o.idc and b.idp=o.idbranch where b.IDC=1 and O.Active=1 union All SELECT 2 RType,O.IDC,O.IDP          ,10000*O.IDBranch IDF,O.IDBranch    ,O.ID_Dept,if(Trim(O.NameA)="",O.NameE,O.NameA) NameA, O.NameE,"" SName,O.DurationTime, O.IDAttendance,O.IDSort ,O.RoomType,O.IDDoctor ,0 Checked FROM OperatingRooms o where O.Active=1 and O.IDC=1 ) a Order by Rtype,if(IDBranch=2,IDBranch,IDBranch+100),IDSort`;

        // // this.all.getData(`?Mtype=A16&HCode=2827045&Query=${Query1}`).then(res => {
        // //   console.log(`DoctorsList= `, res[`Q0`]);
        // // });
        // // this.all.getData(`?Mtype=A16&HCode=2827045&Query=${Query2}`).then(res => {
        // //   console.log(`q2= `, res[`Q0`]);
        // // });

        // const body = new HttpParams()
        //   .set('Mtype', 'A16')
        //   .set('Query', Query1+`;${Query2};${Query3}`);

        // this.all.postData(body).then(res => {
        //   // alert(JSON.stringify(res));
        //   this.all.tblDoctors =  res[`Q0`];
        //   console.log(`DoctorsList,  Q0= `, res[`Q0`]);
        //   console.log(`Q1= `, res[`Q1`]);

        //   console.log(`Q2= `, res[`Q2`]);
        //   let tblRooms:any = res[`Q2`];
        //   tblRooms = Array.from(
        //     new Set(tblRooms.map(item => JSON.stringify(item)))
        //   ).map(item => JSON.parse(item as string));
        //   this.all.tblRooms = tblRooms;
        // });

      }
    });
  }


  convertSimpleRtfToHtml(rtf: string): string {
    rtf = rtf.replace(/^{\\rtf1\\ansi\\deff0\s*/, '').replace(/}$/, '');
    rtf = rtf.replace(/\\b\s*/g, '<strong>').replace(/\\b0\s*/g, '</strong>');
    rtf = rtf.replace(/\\i\s*/g, '<em>').replace(/\\i0\s*/g, '</em>');
    rtf = rtf.replace(/\\[^\s]*\s*/g, '');
    return rtf.trim();
  }

  getDocInfo(event) {
    this.DrInfo = ``;
    let Info = this.all.tblDoctorsInfo.filter(x => x.IDP == event.IDDoctor);
    console.log(Info[0].Datastream);
    if (Info.length > 0 && Info[0].Datastream.length > 0) {
      this.rtf.convertRtfToHtml(Info[0].Datastream).then(html => {
        // this.all.alert(html);
        this.DrInfo = html;
      });
    }

    // console.log(event);
    // console.log(this.all.tblDoctorsInfo);
    // this.DrInfo = ``;
    // let Info = this.all.tblDoctorsInfo.filter(x => x.IDP == event.IDDoctor);
    // console.log(Info);
    // if (Info.length > 0) {
    //   const html = this.convertSimpleRtfToHtml(Info[0].Datastream);
    //   this.DrInfo = this.sanitizer.bypassSecurityTrustHtml(html); 
    // }
  }

  getResult(event: any) {
    console.log(`event= `, event);
  }
  isOpen = false;
  next() {
    // let sel = [];
    // for(let itm of this.tblSelectedDoctor){
    //   sel.push({
    //     id: itm.ID,
    //     Name:
    //   });
    // }

    if (this.appt.tblSelectedDoctor.length == 0 && this.appt.tblSelectedRoom.length == 0) {
      this.all.ngxToast(`Select Doctor[s] or Operating Room[s]`, ``, `warning`);
      return;
    }

    this.appt.saveSelect();
    this.nav.navigateForward(`appointmen2`);
  }

  // addPatient() {

  // }

  selectDoctorThisDay() {
    let Query0 = `SELECT IDDoctor FROM Scheduletime s 
      where IDC=${this.all.User.IDC} and IDBranch=${this.all.RegisterData.Branch} and (Schedule=1 or State=1) and startDate>=CurDate() and startDate<=CurDate()+interval 24+5 hour group by IDDoctor`;
    let Query = Query0;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`delete res= `, res);
      let tblDoctorsIDs = res[`Q0`];
      console.log(`tblDoctorsIDs= `, tblDoctorsIDs);
      this.selectDoctors(tblDoctorsIDs)

      this.popoverController.dismiss();
    });
  }



  selectDoctorThisBranch() {
    this.popoverController.dismiss();
    let alertInputs = [];
    for (let b of this.all.tblBranch) {
      if (b.IDP == 0) continue;
      alertInputs.push({
        label: b["Name" + this.all.LangLetter],
        // type: 'radio',
        type: 'checkbox',
        value: b.IDP,
      });
    }

    this.alertController.create({
      header: this.all.translate.instant(`Select Branch`),
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
            this.getDoctorThisBranch(data);
          }
        }
      ]
    }).then((confirm) => {
      confirm.present();
    });
  }

  getDoctorThisBranch(data) {
    if (data.length == 0) {
      return;
    }

    let d = new Date();
    let Today = d.toISOString().split('T')[0];
    let Tomorrow = Today;
    // alert(d.getHours());
    if (this.all.RegisterData.AdditionalHoursForDay > 0 && d.getHours() > this.all.RegisterData.AdditionalHoursForDay) {
      Tomorrow = this.datetime.addDaysToDate(Today, 1);
    }
    // alert(this.all.RegisterData.AdditionalHoursForDay);
    let HH = (this.all.RegisterData.AdditionalHoursForDay.length == 1 ? '0' : '') + this.all.RegisterData.AdditionalHoursForDay;
    // alert(HH);

    let Query0 = `SELECT IDDoctor FROM Scheduletime where startDate between "${Today}" and "${Tomorrow} ${HH}:00:00" and (Schedule=1 or State=1) and IDBranch in (${data.join(",")}) group by IDDoctor`;
    let Query = Query0;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`delete res= `, res);
      let tblDoctorsIDs = res[`Q0`];
      console.log(`tblDoctorsIDs= `, tblDoctorsIDs);
      this.selectDoctors(tblDoctorsIDs)

    });
  }

  selectDoctorCurrentDay() {
    let d = new Date();
    let Today = d.toISOString().split('T')[0];
    let Tomorrow = Today;
    // alert(d.getHours());
    if (this.all.RegisterData.AdditionalHoursForDay > 0 && d.getHours() > this.all.RegisterData.AdditionalHoursForDay) {
      Tomorrow = this.datetime.addDaysToDate(Today, 1);
    }
    // alert(this.all.RegisterData.AdditionalHoursForDay);
    let HH = (this.all.RegisterData.AdditionalHoursForDay.length == 1 ? '0' : '') + this.all.RegisterData.AdditionalHoursForDay;


    let Query0 = `Select IDDoctor from Appointments where IDC=${this.all.User.IDC} and IDY>0 and IDP>0 and IDBranch=${this.all.RegisterData.Branch} and Deleted=0 and ADate>=CurDate()+interval 5 hour and ADate<=CurDate()+interval 24+5 hour group by IDDoctor`;
    let Query = Query0; // 

    //     set @c=CurDateReal();
    // Select IDDoctor
    // from Appointments
    // where IDC=1 and IDY>0 and IDP>0 and Deleted=0 and
    // -- ADate>=CurDate()+interval 5 hour and ADate<=CurDate()+interval 24+5 hour
    //  ADate>=@c and ADate<=@c+interval 24+5 hour
    // group by IDDoctor; -- ,0,51 ; -- [0]
    // select CurDateReal()

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`delete res= `, res);
      let tblDoctorsIDs = res[`Q0`];
      console.log(`tblDoctorsIDs= `, tblDoctorsIDs);
      this.selectDoctors(tblDoctorsIDs)

      this.popoverController.dismiss();
    });
  }

  IsShowNotAllowDoctor = false;
  showNotAllowDoctors() {
    let Query0 = ``;
    if (this.IsShowNotAllowDoctor) {
      Query0 = `Call DoctorsList(1,"","","0")`;
    } else {
      Query0 = `Call DoctorsList(1,"","",10)`;
    }

    let Query = Query0;

    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`delete res= `, res);
      this.all.tblDoctors = res[`Q0`];
      this.IsShowNotAllowDoctor = !this.IsShowNotAllowDoctor;

      this.popoverController.dismiss();
    });

  }

  selectDoctors(tblDoctorsIDs) {
    this.appt.tblSelectedDoctor = [];
    for (let d of tblDoctorsIDs) {
      if (!this.all.tblDoctors.find(x => x.IDP == d.IDDoctor)) {
        continue;
      }

      if (this.appt.tblSelectedDoctor.length == 0 || this.all.tblDoctors.find(x => x.IDP == d.IDDoctor).ApptSlotsPeriod == this.all.tblDoctors.find(x => x.IDP == this.appt.tblSelectedDoctor[0]).ApptSlotsPeriod) {
        this.appt.tblSelectedDoctor.push(d.IDDoctor);
      }
    }
  }


  isDoctorControlPanelModal = false;
  tblService: any = [{
    NameE: `sss`, NameA: `www`, IDP: 0
  }];
  SelectedService = 0;
  DoctorBeforEdit = null;
  EditDoctor = {
    "ID": 2,
    "IsDoctor": 1,
    "RType": 1,
    "IDC": 1,
    "IDP": 2,
    "IDDoctor": 2,
    "IDUserConected": 206,
    "IDF": 10001,
    "ID_Dept": 1,
    "IDNature": 0,
    "IDAcc": 17473,
    "ApptSlotsPeriod": 5,
    "UseApptDefaultPeriod": 0,
    "WaitOver": 3,
    "NameA": "Dr. آلمزيد",
    "NameE": "Dr.Almzed",
    "SName": "0030",
    "Emp_Status": "0",
    "IDSort": 0,
    "DoctorPriority": 4,
    "DOrder": 1,
    "ID_Job_Iqamah": 9,
    "IDAgreement": 66,
    "InsuranceEnable": 1,
    "Invoiceable": 1,
    "ShowByInternet": 0,
    "TimeSchedule": 1350,
    "Max(e.Last_Update)": "2024-07-20 19:32:30",
    "DoctorOnDuty": 1,
    "DoctorBranches": "1,6",
    "TotalDuration": 660,
    "SchedulePersent": 5,
    "WaitingSchedulePersent": 0,
    "TodayNewPatients": 0,
    "ThreeDaysNewPatients": 0,
    "WeekNewPatients": 0,
    "Checked": 0
  };
  EmployeeBeforEdit = null;
  Employee = {
    "ID": 111,
    "SName": "0000",
    "Full_Name_Eng": "Dr.Ayedh",
    "Full_Name_Ar": "Dr. آآييده",
    "ShowByInternet": 0,
    "IDItem": 0,
    "ApptSlotsPeriod": 5,
    "UseApptDefaultPeriod": 0,
    "WaitOver": 3,
    "PntBlackPointsMessage": 0,
    "ApptConfirmMustPay": 0,
    "ApptConfirmMustPayValue": 0,
    "InsuranceEnable": 1,
    "DuplicatePntAppt": 1,
    "DuplicatePntWaitAppt": 1,
    "EnablePntSMS": 1,
    "CanSeePatientsInfoCard": 0,
    "Invoiceable": 1
  };

  openDoctorControlPanel(ev) {
    console.log(ev);

    this.EditDoctor = ev;
    this.DoctorBeforEdit = this.all.deepCopy(ev);

    let Query0 = `Select 0 IDP,1 IDC,0 IDNature,0 It_Level,0 PartNo,0 IDHand,"Any" NameE,"Any" NameA,"" NickName,0 DurationTime union all Select IDP,IDC,IDNature,It_Level,PartNo,IDHand,NameE,NameA,NickName,DurationTime from Items where IDC=${this.all.User.IDC} AND IDNature in (13,14,15,16)`;
    let Query1 = `Select ID,SName,Full_Name_Eng,Full_Name_Ar,ShowByInternet,IDItem,ApptSlotsPeriod,UseApptDefaultPeriod,WaitOver,PntBlackPointsMessage,ApptConfirmMustPay,ApptConfirmMustPayValue,If(Position(",3," in concat(",",e.DOptions,","))>0,1,0) InsuranceEnable, If(Position(",4," in concat(",",e.DOptions,","))>0,1,0) DuplicatePntAppt, If(Position(",5," in concat(",",e.DOptions,","))>0,1,0) DuplicatePntWaitAppt, If(Position(",6," in concat(",",e.DOptions,","))>0,1,0) EnablePntSMS, If(Position(",7," in concat(",",e.DOptions,","))>0,1,0) CanSeePatientsInfoCard, if(Position(",8," in concat(",",e.DOptions,","))>0,1,0) Invoiceable From Employees e Where IDC=${this.all.User.IDC} and IDp=${this.EditDoctor.IDP}`;

    let Query = `${Query0};${Query1}`;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`delete res= `, res);
      this.tblService = res[`Q0`];
      this.EmployeeBeforEdit = this.all.deepCopy(res[`Q1`][0]);
      this.Employee = res[`Q1`][0];

      this.isDoctorControlPanelModal = true;

    });
  }
  www() {
    console.log(this.Employee.ApptSlotsPeriod);
  }

  saveDoctorPanel() {
    // update `employees`  set
    //   `DOptions` = '1,2,3,4,5,6,8,7'

    // update `employees`  set
    //  `ShowByInternet` = '1'
    // where
    //  `ID` = '142' 
    // ; -- ,0,51 

    // update employees  set
    //  ShowByInternet = '0',
    //  IDItem = '38',
    //  ApptSlotsPeriod = '10',
    //  UseApptDefaultPeriod = '1',
    //  WaitOver = '5',
    //  PntBlackPointsMessage = '1',
    //  ApptConfirmMustPay = '1',
    //  ApptConfirmMustPayValue = '10.000000',
    //  DOptions = '1,2,3,5,6,8,4,7'
    // where
    //  ID = '142'; -- ,0,51 
    let Query0 = ``;
    // if (this.EditDoctor == this.DoctorBeforEdit) {
    Query0 = `update employees set `;
    //  ShowByInternet = '0',
    if (this.Employee.ShowByInternet != this.EmployeeBeforEdit.ShowByInternet) {
      Query0 += `ShowByInternet = '${this.Employee.ShowByInternet}',`;
    }
    if (this.Employee.IDItem != this.SelectedService) {
      Query0 += `IDItem = '${this.SelectedService}',`;
    }
    if (this.Employee.ApptSlotsPeriod != this.EmployeeBeforEdit.ApptSlotsPeriod) {
      Query0 += `ApptSlotsPeriod = '${this.Employee.ApptSlotsPeriod}',`;
    }
    if (this.Employee.UseApptDefaultPeriod != this.EmployeeBeforEdit.UseApptDefaultPeriod) {
      Query0 += `UseApptDefaultPeriod = '${this.Employee.UseApptDefaultPeriod}',`;
    }
    if (this.Employee.WaitOver != this.EmployeeBeforEdit.WaitOver) {
      Query0 += `WaitOver = '${this.Employee.WaitOver}',`;
    }
    Query0 += `PntBlackPointsMessage = '${this.Employee.PntBlackPointsMessage}',`;
    Query0 += `ApptConfirmMustPay = '${this.Employee.ApptConfirmMustPay}',`;
    Query0 += `ApptConfirmMustPayValue = '${this.Employee.ApptConfirmMustPayValue}',`;


    let DOptionArr = [];
    if (this.Employee.InsuranceEnable) DOptionArr.push(3);
    if (this.Employee.DuplicatePntAppt) DOptionArr.push(4);
    if (this.Employee.DuplicatePntWaitAppt) DOptionArr.push(5);
    if (this.Employee.EnablePntSMS) DOptionArr.push(6);
    if (this.Employee.CanSeePatientsInfoCard) DOptionArr.push(7);
    if (this.Employee.Invoiceable) DOptionArr.push(8);

    Query0 += ` DOptions = '${DOptionArr.join(",")}' `;
    Query0 += ` where ID = '${this.Employee.ID}'`;

    let Query = `[${Query0}]`;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      console.log(`delete res= `, res);
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
        return;
      }
      this.all.ngxToast(`Saved Successfully`, '', 'success');


      this.all.tblDoctors.filter(x => x.ID == this.EditDoctor.ID)[0].ApptSlotsPeriod = this.Employee.ApptSlotsPeriod;
      this.all.tblDoctors.filter(x => x.ID == this.EditDoctor.ID)[0].ShowByInternet = this.Employee.ShowByInternet;
      this.all.tblDoctors.filter(x => x.ID == this.EditDoctor.ID)[0].UseApptDefaultPeriod = this.Employee.UseApptDefaultPeriod;
      this.all.tblDoctors.filter(x => x.ID == this.EditDoctor.ID)[0].WaitOver = this.Employee.WaitOver;
      this.all.tblDoctors.filter(x => x.ID == this.EditDoctor.ID)[0].InsuranceEnable = this.Employee.InsuranceEnable;

      this.isDoctorControlPanelModal = false;
    });



    // cdd.Open;
    // cdd.Edit;
    // AppendRecFromRec(cd,cdd,['ID','SName','Full_Name_Eng','Full_Name_Ar']);
    // cdd['DOptions'].AsString:='';
    // if (cd['InsuranceEnable'].AsInteger=1) and (Pos(',3,',','+cdd['DOptions'].AsString+',')<=0) then cdd['DOptions'].AsString:=cdd['DOptions'].AsString+',3';
    // if (cd['DuplicatePntAppt'].AsInteger=1) and (Pos(',4,',','+cdd['DOptions'].AsString+',')<=0) then cdd['DOptions'].AsString:=cdd['DOptions'].AsString+',4';
    // if (cd['DuplicatePntWaitAppt'].AsInteger=1) and (Pos(',5,',','+cdd['DOptions'].AsString+',')<=0) then cdd['DOptions'].AsString:=cdd['DOptions'].AsString+',5';
    // if (cd['EnablePntSMS'].AsInteger=1) and (Pos(',6,',','+cdd['DOptions'].AsString+',')<=0) then cdd['DOptions'].AsString:=cdd['DOptions'].AsString+',6';
    // if (cd['CanSeePatientsInfoCard'].AsInteger=1) and (Pos(',7,',','+cdd['DOptions'].AsString+',')<=0) then cdd['DOptions'].AsString:=cdd['DOptions'].AsString+',7';
    // if (cd['Invoiceable'].AsInteger=1) and (Pos(',8,',','+cdd['DOptions'].AsString+',')<=0) then cdd['DOptions'].AsString:=cdd['DOptions'].AsString+',8';
    // cdd.CheckBrowseMode;
    // cdd.ApplyUpdatesSure;
    // cdd.Close;

  }
}
