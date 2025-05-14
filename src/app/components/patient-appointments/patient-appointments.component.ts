import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { AllService } from 'src/app/services/all.service';
import { ApptService } from 'src/app/services/appt.service';

@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.scss'],
})
export class PatientAppointmentsComponent implements OnInit {
  tblItems = [];
  tblSourceItems = [];
  @Input()
  set Items(items: any) {
    this.tblSourceItems = items;
    this.tblItems = items;
    this.doneDayFilter();
  }

  @Output() childSubmit = new EventEmitter<any>();

  columnsW = [
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 }, { width: 100 },
    { width: 100 },

  ]


  // بحث في طلبات المواعيد
  // procedure TForm_ApptsSystem.CDAppointmentsRequiredFilterRecord(
  //   DataSet: TDataSet; var Accept: Boolean);
  // var OrderDate:TDate;
  // begin
  //      Accept:=True;
  //      if Trim(Edit1.Text)<>'' then
  //      begin
  //           if IsNo(Trim(Edit1.Text))
  //           then begin
  //                     if pos('05',Trim(Edit1.Text))=1
  //                     then Accept:=(Pos(Trim(Edit1.Text), CDAppointmentsRequired['PPhon1'].AsString)=1) or (Pos(Trim(Edit1.Text), CDAppointmentsRequired['FileNo'].AsString)>0)
  //                     Else Accept:= Pos(Trim(Edit1.Text), CDAppointmentsRequired['FileNo'].AsString)>0;
  //                end
  //           Else Accept:=(CPos(Trim(Edit1.Text), CDAppointmentsRequired['NameE'].AsString)>0) or (CPos(Trim(Edit1.Text), CDAppointmentsRequired['NameA'].AsString)>0);
  //      End;
  //      OrderDate:=DateOnly(CDAppointmentsRequired['OrderDate'].AsDateTime);
  //      if Accept then
  //      if (Co_DateFilter.ItemIndex>0) then
  //      begin
  //           case Co_DateFilter.ItemIndex of
  //           0:;
  //           1:Accept:=SameDate(Date,OrderDate);
  //           2:Accept:=(OrderDate<=Date) and (OrderDate>=AddDate(Date,0,0,-1) );
  //           3:Accept:=(OrderDate<=Date) and (OrderDate>=AddDate(Date,0,0,-2) );
  //           4:Accept:=(OrderDate<=Date) and (OrderDate>=AddDate(Date,0,0,-3) );
  //           5:Accept:=(OrderDate<=Date) and (OrderDate>=AddDate(Date,0,0,-4) );
  //           6:Accept:=(OrderDate<=Date) and (OrderDate>=AddDate(Date,0,0,-5) );
  //           7:Accept:=(OrderDate<=Date) and (OrderDate>=AddDate(Date,0,0,-6) );
  //           14:Accept:=(OrderDate<=Date) and (OrderDate>=AddDate(Date,0,0,-14) );


  //           end;
  //      end;

  //      if Accept then
  //      if (Co_DoneFilter.ItemIndex>0) then
  //      begin
  //           case Co_DoneFilter.ItemIndex of
  //           0:;
  //           1:Accept:=CDAppointmentsRequired['IDAppt'].AsInteger<=0;
  //           2:Accept:=CDAppointmentsRequired['IDAppt'].AsInteger>0;
  //           end;
  //      end;
  // end;

  constructor(public all: AllService, private apptService: ApptService) { }

  ngOnInit() {
    this.initializeResizer();
  }

  export(row) {
    
    if (+this.all.SubScheduleWindows.No == 1) {
      
      this.childSubmit.emit(this.all.SubScheduleWindows.tblItem.find(x => x.IDP == row.PrivateID));
    } if (+this.all.SubScheduleWindows.No == 4) {
      if(row.DoneDate=='2010-01-01'){
        this.childSubmit.emit(this.all.SubScheduleWindows.tblItem.find(x => x.ID == row.ID));
      }
      
    } else if (+this.all.SubScheduleWindows.No == 2 || +this.all.SubScheduleWindows.No == 3){
      // alert(`this.all.SubScheduleWindows.No`)
      this.childSubmit.emit(row);
    }

  }



  // ################## Col Resize ################
  onMouseDown(event: MouseEvent, column: any) {
    event.preventDefault();
    const startX = event.pageX;
    const startWidth = this.columnsW[column].width;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.pageX - startX);
      this.columnsW[column].width = newWidth > 50 ? newWidth : 50; // الحد الأدنى لعرض العمود 50 بكسل
      this.syncColumnWidths();
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  syncColumnWidths() {
    // this.data.forEach(row => {
    //   row.forEach((cell, index) => {
    //     cell.width = this.columns[index].width;
    //   });
    // });
  }

  // ################## Risizer ####################

  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @ViewChild('resizableDiv') resizableDiv!: ElementRef;
  @ViewChild('resizer') resizer!: ElementRef;
  private startY: number = 0;
  private startHeight: number = 0;
  private mouseMoveSubscription?: Subscription;
  private mouseUpSubscription?: Subscription;
  private initializeResizer() {
    // انتظر حتى يتم تحميل العناصر
    setTimeout(() => {
      if (this.resizer && this.resizableDiv) {
        // إضافة مستمع لحدث الضغط على الماوس
        fromEvent(this.resizer.nativeElement, 'mousedown')
          .subscribe((e: any) => this.initResize(e));
      }
    });
  }

  private initResize(e: MouseEvent) {
    e.preventDefault();

    this.startY = e.clientY;
    this.startHeight = this.resizableDiv.nativeElement.offsetHeight;

    // إنشاء مستمعات للحركة ورفع الماوس
    this.mouseMoveSubscription = fromEvent(document, 'mousemove')
      .subscribe((e: any) => this.resize(e));

    this.mouseUpSubscription = fromEvent(document, 'mouseup')
      .subscribe(() => this.stopResize());
  }

  private resize(e: MouseEvent) {
    const newHeight = this.startHeight + (e.clientY - this.startY);

    // يمكنك إضافة حدود للحجم الأدنى والأقصى
    const minHeight = 100;
    const maxHeight = 800;

    if (newHeight >= minHeight && newHeight <= maxHeight) {
      this.resizableDiv.nativeElement.style.height = `${+newHeight + 5}px`;
      this.gridContainer.nativeElement.style.height = `${newHeight - 40}px`;
    }
  }

  private stopResize() {
    // إلغاء الاشتراك في الأحداث
    if (this.mouseMoveSubscription) {
      this.mouseMoveSubscription.unsubscribe();
    }
    if (this.mouseUpSubscription) {
      this.mouseUpSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.stopResize();
  }

  addSpaceBeforeUpperCase(str) {
    if (str === str.toUpperCase()) {
      return str;
    }
    // return str.replace(/([A-Z])/g, ' $1').trim();
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  SearchStr = '';
  DaysCount = 0;
  DoneStatus = -1;
  tblItemsFiltered = [];
  onSearchChange($event) {
    if (this.SearchStr == '') {
      this.doneDayFilter();
      return;
    }
    // let gg = ('sds').toLowerCase().includes
    this.tblItems = this.tblItemsFiltered.filter(x =>
      x.NameA?.toString().toLowerCase().includes(this.SearchStr)
      || x.NameE?.toString().toLowerCase().includes(this.SearchStr)
      || x.OrderDate?.toString().toLowerCase().includes(this.SearchStr)
      || x.Phon1?.toString().toLowerCase().includes(this.SearchStr)
      || x.FileNo?.toString().toLowerCase().includes(this.SearchStr)
    )

    // OrderDate - NameA - NameE - PPhon1 - FileNo
  }

  doneDayFilter() {
    this.SearchStr = '';
    if (this.DoneStatus == -1) {
      this.tblItemsFiltered = this.all.deepCopy(this.tblSourceItems);
    } else if (this.DoneStatus == 0) {
      this.tblItemsFiltered = this.all.deepCopy(this.tblSourceItems.filter(x => x.DoneDate == '2010-01-01'));
    } else {
      this.tblItemsFiltered = this.all.deepCopy(this.tblSourceItems.filter(x => x.DoneDate != '2010-01-01'));
    }

    if (this.DaysCount > 0) {
      this.tblItemsFiltered = this.tblItemsFiltered.filter(x => x.WithinDaysCount == this.DaysCount);
    }
    this.tblItems = this.all.deepCopy(this.tblItemsFiltered);
    console.log(this.tblItems);
  }

  reGetData() {
    this.apptService.getSubWindow(4);

  }
}
