import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { NewAppComponent } from '../components/new-app/new-app.component';
import { AllService } from '../services/all.service';
import { RtfService } from '../services/rtf.service';
import { HttpParams } from '@angular/common/http';
declare const FullCalendar: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public calendar: any;
  public contextMenu: any;
  CurrentDate = new Date().toISOString();

  rtf_html = ``;
  rtfText = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
{\\*\\generator Riched20 10.0.19041}\\viewkind4\\uc1 
\\pard\\sa200\\sl276\\slmult1\\f0\\fs22\\lang9 Hello, this is a sample RTF document.\\par
}`;
  constructor(private modalCtrl: ModalController, public all: AllService, public rtf: RtfService) {
    rtf.convertRtfToHtml(this.rtfText).then(html => {
      this.rtf_html = html;
    });
  }

  ionViewWillEnter() {
    this.all.MenuSplitPane = true;
  }

  tblfilterPatient = [];
  tblAllPatient = [];

  getPatients() {
    // let Query = `select
    // IDP, IDBranch, IDAcc, NameE, NameA, SocialID, Phon1, Phon2, Phon3, LastModifyDate
    // from patients`;

    let Query = `select p.IDP, p.IDBranch, ifnull(a.Ac_Num,0) FileNo ,p.NameE, p.NameA, p.SocialID, p.Phon1, p.Phon2, p.Phon3, p.LastModifyDate
    from patients p
    Left join acc a on p.idc=a.idc and p.idAcc=a.IDP`;
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
      this.tblAllPatient = res[`Q0`];
      this.tblfilterPatient = res[`Q0`].slice(0, 10);
      console.log(`res= `, res);

    });
  }

  TestSearch = ``;
  onSearchChange($event) {
    this.tblfilterPatient = this.tblAllPatient.filter(item => item.NameE.toLowerCase().includes(this.TestSearch)
      || item.NameA.toLowerCase().includes(this.TestSearch)
    ).slice(0, 10);
  }

  ngOnInit() {

    // alert(this.charSetCorrect('Óáíã'));

    setTimeout(() => {
      this.reRender();
    }, 500);

    // إخفاء القائمة عند النقر خارجها
    document.addEventListener('click', () => {
      const menu = document.getElementById('context-menu');
      if (menu) {
        menu.style.display = 'none';
      }
    });


  }

  SelectedSlot: any;
  reRender() {
    var calendarEl = document.getElementById('calendar');
    this.contextMenu = document.getElementById('contextMenu');
    this.calendar = new FullCalendar.Calendar(calendarEl, {


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
        console.log('info.resourceIds= ', info.resource.id);
        console.log('selected ' + info.startStr + ' to ' + info.endStr);
        this.SelectedSlot = info;
      },


      eventResize: function (info: any) {
        alert(info.event.title + " end is now " + info.event.end.toISOString());

        if (!confirm("is this okay?")) {
          info.revert();
        }
      },
      eventDrop: function (info: any) {
        alert(info.event.title + " was dropped on " + info.event.start.toISOString());

        if (!confirm("Are you sure about this change?")) {
          info.revert();
        }
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

      slotDuration: '00:05',
      slotMinTime: '08:00:00',  // يبدأ من الساعة 8 صباحًا
      slotMaxTime: '26:00:00',  // ينتهي عند الساعة 3 صباحًا من اليوم التالي

      editable: true, // يحدد ما إذا كان من الممكن تعديل الأحداث الموجودة في التقويم.
      eventResizableFromStart: true, // ما إذا كان بإمكان المستخدم تغيير حجم حدث من حافته الأولية.

      dragScroll: true, // ما إذا كان سيتم مسح حاويات التمرير تلقائيًا أثناء سحب الحدث وإفلاته وتحديد التاريخ.

      // defaultAllDay: false,
      timeZone: 'UTC',

      datesAboveResources: true,
      selectable: true,
      selectMirror: true, // ما إذا كان سيتم رسم حدث "عنصر نائب" أثناء قيام المستخدم بالسحب.
      unselectAuto: false, // ما إذا كان النقر في أي مكان آخر على الصفحة سيؤدي إلى مسح التحديد الحالي.

      nowIndicator: true, now: new Date(), // '2024-12-04T13:23:00', // رسم خط التوقيت الان

      // initialView: 'resourceTimeGridFourDay',
      // views: {
      //   resourceTimeGridFourDay: {
      //     type: 'resourceTimeGrid',
      //     duration: { days: this.ViewDayCount },
      //     buttonText: `4 days`,
      //   }
      // },

      initialView: 'resourceTimeGridFourDay',
      views: {
        resourceTimeGridFourDay: {
          type: 'resourceTimeGrid',
          duration: { days: this.ViewDayCount },
          buttonText: `${this.ViewDayCount} days`
        }
      },





      resources: [
        { id: 'a', title: 'Dr.Name' },
        { id: 'b', title: 'Wait' },
      ],
      // eventColor: '#378006',
      eventClassNames: ['event-class1'],
      events: [
        {
          id: '1',
          resourceId: 'a', // مرتبط بـ Room A
          // title: "First Line<br>Second Line",
          title: `<div style="background:red; padding:3px; border-radius: 3px;">Header</div>`,
          start: '2024-12-03T10:00:00',
          end: '2024-12-03T12:00:00',
          // resourceEditable: false,
          color: '#9c88ff',
          display: 'auto',
        },
        {
          id: '2',
          resourceId: 'b', // مرتبط بـ Room B
          title: 'Workshop',
          start: '2024-12-04T14:00:00',
          end: '2024-12-04T16:00:00',
          editable: false, // غير قابل للتعديل خارج اليوم
          // resourceEditable: true,
          display: 'block',
        },
        {
          id: '3',
          resourceId: 'b', // مرتبط بـ Room B
          title: 'Workshop2',
          start: '2024-12-03T14:00:00',
          end: '2024-12-03T16:00:00',
          // resourceEditable: true,
          // eventClassNames: ['event-class1'],
          editable: true, // يمكن نقله لأي مكان
          durationEditable: true,
          display: 'list-item',
        },
        {
          id: '4',
          resourceId: 'a', // مرتبط بـ Room B
          title: 'Workshop2',
          start: '2024-12-03T14:00:00',
          end: '2024-12-03T16:00:00',
          // resourceEditable: true,
          // eventClassNames: ['event-class1'],
          editable: true, // يمكن نقله لأي مكان
          durationEditable: true,
          display: 'list-item',
        },
        {
          id: '5',
          resourceId: 'a', // مرتبط بـ Room B
          title: 'Workshop2',
          start: '2024-12-06T08:15:00',
          end: '2024-12-06T10:00:00',
          // resourceEditable: true,
          // eventClassNames: ['event-class1'],
          editable: true, // يمكن نقله لأي مكان
          durationEditable: true,
          display: 'list-item',
        },
        {
          id: '6',
          resourceId: 'a', // مرتبط بـ Room B
          title: 'Workshop3333',
          start: '2024-12-13T08:15:00',
          end: '2024-12-13T10:00:00',
          // resourceEditable: true,
          // eventClassNames: ['event-class1'],
          editable: true, // يمكن نقله لأي مكان
          durationEditable: true,
          display: 'list-item',
        },

        // {
        //   id: '4',
        //   resourceId: 'b', // مرتبط بـ Room B
        //   title: 'Workshop2',
        //   start: '2024-12-03T02:00:00',
        //   end: '2024-12-03T03:00:00',
        //   // resourceEditable: true,
        //   classNames:['event-class1'],
        //   editable:true, // يمكن نقله لأي مكان
        //   durationEditable: true,
        //   display: 'background',
        // },
        // { // تلوين قسم الانتظار
        //   id: 'S0',
        //   resourceId: 'b', // مرتبط بـ Room B
        //   title: 'wait',
        //   start: '2022-12-04T02:00:00',
        //   end: '2022-12-04T03:00:00',
        //   // resourceEditable: true,
        //   // classNames: ['event-class1'],
        //   color: '#7ed6df',
        //   editable: true, // يمكن نقله لأي مكان
        //   durationEditable: true,
        //   display: 'inverse-background',
        // },
      ],


      navLinks: true,
      titleFormat: { year: 'numeric', month: 'numeric', day: 'numeric' },
      headerToolbar: {
        left: 'prev,next,today, custom1,custom2',
        center: 'title',
        right: 'dayGridMonth,resourceTimeGridDay,resourceTimeGridFourDay'
      },
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
          click: function () {
            alert('clicked custom button 1!');
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

        console.log(`arg= `, arg);
        const eventId = arg.event.id;
        arg.el.addEventListener("contextmenu", (jsEvent: any) => {
          jsEvent.preventDefault()
          console.log("contextMenu", eventId);
          this.showContextMenu(jsEvent, eventId);
        })

        // arg.el.addEventListener('contextmenu',  (e:any) =>{
        //   e.preventDefault();
        //   this.showContextMenu(e.pageX, e.pageY);
        // });

      },

      dayCellDidMount: (info: any) => {

        const today = new Date().setHours(0, 0, 0, 0); // تاريخ اليوم بدون الوقت
        const cellDate = new Date(info.date).getTime(); // تاريخ الخلية
        if (cellDate < today) {
          info.el.classList.add('past-days');
          // info.el.style.backgroundColor = '#95afc0'; // تغيير اللون إلى الأحمر
        }

        if (info.resource.title === 'Wait') {
          info.el.style.backgroundColor = '#f6e58d3d';// '#f6e58d7c'; // تغيير خلفية العنوان إلى أصفر
        }

        var dateObj = new Date(info.date);
        var hours = dateObj.getHours(); // الساعة
        var minutes = dateObj.getMinutes(); // الدقائق

        // console.log(hours);
        // if (hours > 10 && hours < 12) {
        //   info.el.classList.add('hide-slot');
        // }
      },


      resourceLabelDidMount: (info: any) => {
        if (info.resource.title === 'Wait') {
          info.el.style.backgroundColor = '#f6e58d7c'; // تغيير خلفية العنوان إلى أصفر
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




    });

    setTimeout(() => {
      this.calendar.render();
    }, 250);



  }

  getEventByID() {
    var event = this.calendar.getEventById('1') // an event object!
    var start = event.start // a property (a Date object)
    console.log(start);
  }


  // showContextMenu(x:any, y:any) {
  //   this.contextMenu.style.display = 'block';
  //   this.contextMenu.style.left = `${x}px`;
  //   this.contextMenu.style.top = `${y}px`;
  // }

  hideContextMenu() {
    this.contextMenu.style.display = 'none';
  }

  showContextMenu(event: MouseEvent, eventId: string) {
    let menu = document.getElementById('context-menu');
    if (!menu) {
      // alert(1);
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
    menu.style.display = 'block';
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
  }

  async newApp() {
    console.log(`this.SelectedSlot= `, this.SelectedSlot);
    alert(`eventId` + this.SelectedSlot.startStr);
    const modal = await this.modalCtrl.create({
      component: NewAppComponent,
      componentProps: { StartDate: this.SelectedSlot.startStr },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {

    }
  }

  setDate() {
    console.log(`this.CurrentDate= `, this.CurrentDate);
    this.calendar.gotoDate(this.CurrentDate);
  }

  ViewDayCount = 5;
  viewDays(dayCount: number) {
    this.ViewDayCount = dayCount;
    this.reRender();
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


  // charSetCorrect(text) {
  //   const map = {
  //     'A': 'ش', 'B': 'لا', 'C': 'ؤ', 'D': 'ي', 'E': 'ث', 'F': 'ب', 'G': 'ل',
  //     'H': 'ا', 'I': 'ه', 'J': 'ت', 'K': 'ن', 'L': 'م', 'M': 'ة', 'N': 'ى',
  //     'O': 'خ', 'P': 'ح', 'Q': 'ض', 'R': 'ق', 'S': 'س', 'T': 'ف', 'U': 'ع',
  //     'V': 'ر', 'W': 'ص', 'X': 'ء', 'Y': 'غ', 'Z': 'ئ',

  //     'a': 'ش', 'b': 'لا', 'c': 'ؤ', 'd': 'ي', 'e': 'ث', 'f': 'ب', 'g': 'ل',
  //     'h': 'ا', 'i': 'ه', 'j': 'ت', 'k': 'ن', 'l': 'م', 'm': 'ة', 'n': 'ى',
  //     'o': 'خ', 'p': 'ح', 'q': 'ض', 'r': 'ق', 's': 'س', 't': 'ف', 'u': 'ع',
  //     'v': 'ر', 'w': 'ص', 'x': 'ء', 'y': 'غ', 'z': 'ئ',

  //     'É': 'ت', 'Ç': 'ا', 'ã': 'م', 'Ñ': 'ر', 'æ': 'و'
  //   };

  //   return text.split('').map(char => map[char] || char).join('');
  // }
}
