import { Injectable } from '@angular/core';
import { ApptService } from './appt.service';
import { AllService } from './all.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  constructor(private apptService: ApptService, private all: AllService) { }

  drwaDoctorEventHtml(appt) {

    let IsOnCallIcon = appt.IsOnCall == 1 ? `<ion-icon name="call" color="warning"></ion-icon>` : ``;

    let VisitTypeSymbols = [`F`, `N`, `R`, `P`, `C`, ``, ``, ``, ``];
    let VisitTypeIcon = `<ion-badge color="warning" class="visit-type-icon">&nbsp;${VisitTypeSymbols[appt.VisitType]}&nbsp;</ion-badge>`;

    let Balance = appt.Balance == 0 ? `` : `<div class="event-balance-${appt.Balance > 0 ? `green` : `red`}">${Math.abs(appt.Balance)}RS</div>`;


    let MonyStatus = this.apptService.getMonyStatus(appt.MonyStatus);

    let OperatingRoom = ``;
    if (appt.IDOperatingRoom) {
      let RoomName = this.all.tblRooms.filter(x => x.IDP == appt.IDOperatingRoom)[0]['Name' + this.all.LangLetter];
      OperatingRoom = `<ion-badge style="width:100%;padding: 0px;" color="warning">${RoomName} </ion-badge>`;
    }

    let Required = ``;
    if (appt.Required == 1) {
      Required = `<ion-icon src="./assets/icons/req.svg" color="danger"></ion-icon>`
    } else if (appt.Required == 2) {
      Required = `<ion-icon src="./assets/icons/req.svg" color="success"></ion-icon>`
    }

    // Answer  ConfirmCount  ConfirmCount1  ConfirmDate  ConfirmStatus
    let ConfirmStatus = ``;
    if (appt.ConfirmStatus >= 1 && appt.ConfirmStatus <= 4) {
      ConfirmStatus = ` ${appt.ConfirmCount} <ion-icon src="./assets/icons/telephone-confirm.svg" color="danger"></ion-icon>`;
    } else if (appt.ConfirmStatus >= 5 && appt.ConfirmStatus <= 8) {
      ConfirmStatus = ` ${appt.ConfirmCount} <ion-icon src="./assets/icons/telephone-confirm.svg" color="success"></ion-icon>`;
    } else if (appt.ConfirmStatus >= 9 && appt.ConfirmStatus <= 11) {
      ConfirmStatus = ` ${appt.ConfirmCount} <ion-icon src="./assets/icons/telephone-confirm.svg" color="warning"></ion-icon>`;
    }


    let HeaderTime = ``; 
    // let HeaderFlash = ``;
    if (appt.AOut > 0) {
      HeaderTime = `Out ${this.all.convertTo12HourFormatWithoutSecound(appt.AttendOut)}`
    } else if (appt.Attend > 0 && appt.Enter > 0) {
      // HeaderFlash = ``;
      // HeaderTime = `<span id="timer-${appt.ID}" class="timer-item">${ this.calculateElapsedTime(appt)}</span>`;
      // HeaderTime = `E`;
      // HeaderTime = this.apptService.calculateAppointmentTimes(appt.ADate, appt.Duration);
    }else if (appt.Attend > 0) {
      // HeaderFlash = `header-flash`;
      // HeaderTime = `<span id="timer-${appt.ID}" class="timer-item">${ this.calculateElapsedTime(appt)}</span>`;
      // HeaderTime = `S`;
      // HeaderTime = this.apptService.calculateAppointmentTimes(appt.ADate, appt.Duration);
    } else {
      HeaderTime = this.apptService.calculateAppointmentTimes(appt.ADate, appt.Duration);
    }

    let EventHeader = `
      <ion-row class="event-header-row ">
        <ion-col size="auto">${VisitTypeIcon}</ion-col>
        <ion-col>${HeaderTime}</ion-col>
        <ion-col size="auto">${ConfirmStatus}</ion-col>
      </ion-row>`;

    let title = ` 
      <ion-row class="event-patient">
        <ion-col size="4">${appt.Ac_Num}</ion-col>
        <ion-col size="${appt.Required == 0 ? '8' : '6'}">${IsOnCallIcon} ${appt.PNameE.substring(0, 30)}  ${MonyStatus} </ion-col>
        ${appt.Required == 0 ? '' : `<ion-col size="2">${Required} </ion-col>`}              
      </ion-row>
      <div class="patient-name">${appt.PNameE.substring(0, 30)}</div>
    ${Balance}
    ${OperatingRoom}`;

    title += `<div class="event-desc">${appt.Description.substring(0, 40)}</div>`;

    if (appt.IDProcedure > 0) { // ServiceName
      let Service = appt.ServiceCode + ` ` + appt.ServiceName;
      title += `<div class="event-service">${Service}</div>`;
    }

    let EventFooter = this.apptService.getEventFooter(appt);


    // title = `<div class="tooltip-container" >
    // ${appt.Description != '' ? `<span class="tooltiptext">${appt.Description}</span>` : ''} 
    // ${title}${EventFooter}</div>`;
    // let TooltipContainer = `<span class="tooltiptext">${EventHeader} <div class="event-body"> ${title} </div></span>`;

    title = `${EventHeader} <div class="event-body"> ${title}${EventFooter} </div>`;
    return title;
  }


  getAttendDateTime(attendTime) {
    const today = new Date();
    const [hours, minutes, seconds] = attendTime.split(':').map(Number);

    const attendDate = new Date();
    attendDate.setHours(hours);
    attendDate.setMinutes(minutes);
    attendDate.setSeconds(seconds);

    // إذا كان الوقت المحدد قد مر اليوم، نضيف يومًا
    if (attendDate > today) {
      attendDate.setDate(attendDate.getDate() - 1);
    }

    return attendDate;
  }



  // calculateElapsedTime(item) {
  //   const now: any = new Date();
  //   const attendDate: any = this.getAttendDateTime(item.AttendTime);
  //   const elapsed = now - attendDate;
  //   const totalSeconds = Math.floor(elapsed / 1000);
  //   const minutes = Math.floor(totalSeconds / 60);
  //   const seconds = totalSeconds % 60;
  //   return { minutes, seconds };
  //   // return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  // }

  calculateElapsedTime(item, fromTime = 'AttendTime') {
    const now: any = new Date();
    const attendDate: any = this.getAttendDateTime(item[fromTime]);
    const elapsed = now - attendDate;
    const totalSeconds = Math.floor(elapsed / 1000);
    
    // حساب الساعات والدقائق والثواني
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    return { hours, minutes, seconds };
}
}
