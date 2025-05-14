import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AllService } from 'src/app/services/all.service';


@Component({
  selector: 'app-grid-doctor',
  templateUrl: './grid-doctor.component.html',
  styleUrls: ['./grid-doctor.component.scss'],
})
export class GridDoctorComponent implements OnInit {

  @Input() IsBtnEdit = false;
  @Input() IsBtnDel = false;
  @Input() IsPager = false;
  @Input() IsFilter = false;
  @Input() IsPrint = false;
  @Input() IsExcel = false;
  @Input() SelectedRow = null;

  @Input() colData: any[] = [];
  // @Input() data: any[] = [];
  data = [];
  @Input()
  set rows(tblJson: any) {
    this.data = this.deepCopy(tblJson);
    this.filteredData = [...this.data];
    this.setColWidth();
  }

  @Input()
  set TableHeight(height: any) {
    if (height) {
      // alert(height);
      setTimeout(() => {
        document.getElementById('table-wrapper').style.maxHeight = height;
      }, 250);

    }
  }

  // @Input()
  // set colData(tblJson: any) {
  //   this.data = this.deepCopy(tblJson);
  //   this.setColWidth();
  // }

  // @Input() itemOptions: any[] = [{
  //   ID: 1,
  //   Label: `Delete`,
  //   Icon: `trash`,
  //   Color: `danger`
  // }];
  @Input() itemOptions: any[] = [];

  @Output() startSearch = new EventEmitter<any>();
  SearchStr = ``;

  @Output() selectSubmit = new EventEmitter<any>();
  @Output() menuBtn = new EventEmitter<any>();
  ngOnInit() { }

  searchEnter() {
    alert(2);
  }
  // data = [
  //   { name: 'Ali', age: 30, ADate: '2025-01-02' },
  //   { name: 'Sara', age: 25, ADate: '2025-05-06' },
  //   { name: 'Omar', age: 35, ADate: '2025-03-08' }
  // ];

  sortColumn: string = '';
  sortAsc: boolean = true;
  columnWidths: { [key: string]: number } = {};

  resizingColumn: string | null = null;
  startX: number = 0;
  startWidth: number = 0;

  constructor(private popoverController: PopoverController, public all: AllService) {

  }

  getColName(colName) {
    // console.log(this.colData);
    if (this.colData.length == 0) return colName;
    return this.colData.find(x => x.prop == colName).name;
  }

  setColWidth() {
    const defaultWidth = 150;
    if (this.data.length) {
      Object.keys(this.data[0]).forEach(key => {
        this.columnWidths[key] = defaultWidth;
      });
    }
  }

  get columns() {
    return this.data.length ? Object.keys(this.data[0]) : [];
  }

  sortBy(column: string) {
    console.log(column);
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }
    this.paginatedData.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];
      return this.sortAsc ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
    });
  }



  // sortBy(column: string) {
  //   console.log('Sorting by:', column);
    
  //   // تبديل اتجاه الترتيب إذا كان العمود نفسه
  //   if (this.sortColumn === column) {
  //     this.sortAsc = !this.sortAsc;
  //   } else {
  //     this.sortColumn = column;
  //     this.sortAsc = true;
  //   }
  
  //   this.paginatedData.sort((a, b) => {
  //     const valA = a[column];
  //     const valB = b[column];
  
  //     // تحديد نوع البيانات للترتيب المناسب
  //     if (this.isDate(valA))  {
  //       return this.sortDates(valA, valB);
  //     } else if (this.isNumeric(valA)) {
  //       return this.sortNumbers(valA, valB);
  //     } else {
  //       return this.sortStrings(valA, valB);
  //     }
  //   });
  // }
  
  // // دالة مساعدة للتحقق من أن القيمة تاريخ
  // isDate(value: any): boolean {
  //   if (value instanceof Date) return true;
  //   if (typeof value === 'string') {
  //     // تحقق من تنسيقات التاريخ الشائعة
  //     return !isNaN(Date.parse(value)) || 
  //            /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/.test(value);
  //   }
  //   return false;
  // }
  
  // // دالة مساعدة للتحقق من أن القيمة رقمية
  // isNumeric(value: any): boolean {
  //   return !isNaN(parseFloat(value)) && isFinite(value);
  // }
  
  // // دالة ترتيب التواريخ
  // sortDates(a: any, b: any): number {
  //   const dateA = a instanceof Date ? a : new Date(a);
  //   const dateB = b instanceof Date ? b : new Date(b);
  //   return this.sortAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  // }
  
  // // دالة ترتيب الأرقام
  // sortNumbers(a: any, b: any): number {
  //   return this.sortAsc ? Number(a) - Number(b) : Number(b) - Number(a);
  // }
  
  // // دالة ترتيب النصوص
  // sortStrings(a: any, b: any): number {
  //   const strA = String(a).toLowerCase();
  //   const strB = String(b).toLowerCase();
  //   return this.sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
  // }

  // ******************************

  executeAction(row: any) {
    alert(`تم تنفيذ أمر على: ${JSON.stringify(row)}`);
  }

  startResize(event: MouseEvent, column: string) {
    console.log(event, column, this.columnWidths);
    this.resizingColumn = column;
    this.startX = event.clientX;
    this.startWidth = this.columnWidths[column];
    console.log(this.startWidth);
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.resizingColumn) {
      const dx = event.clientX - this.startX;
      const newWidth = this.startWidth + dx;
      if (newWidth > 50) {
        this.columnWidths[this.resizingColumn] = newWidth;
      }
    }
  }

  @HostListener('document:mouseup')
  stopResize() {
    this.resizingColumn = null;
  }


  printTable() {
    this.popoverController.dismiss();
    // this.ShowCtrlButton = false;

    setTimeout(() => {
      const tableElement = document.getElementById('printableTable');
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
       </style>
     `;

      printWindow.document.write(`
       <html>
         <head>
           <title>طباعة الجدول</title>
           ${style}
         </head>
         <body>
           ${tableElement.outerHTML}
         </body>
       </html>
     `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      // this.ShowCtrlButton = true;
    }, 150);

  }


  @ViewChild('popover') popover!: HTMLIonPopoverElement;

  isOpen = false;
  ItemOption = null;
  presentPopover(e: Event, row) {
    this.popover.event = e;
    this.ItemOption = row;
    this.isOpen = true;
  }


  selectRow(row) {
    console.log(row);
    this.SelectedRow = row;
    this.selectSubmit.emit(row)
  }

  setOption(cmd) {
    // console.log(this.ItemOption, cmd);
    this.isOpen = false;
    this.menuBtn.emit({ Item: this.ItemOption, Cmd: cmd })
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

  filteredData = [];
  fitlerTable(ev) {
    console.log(ev);
    const query = ev.detail.value.toLowerCase();

    this.filteredData = this.data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      )
    )
  }

  // عدد العناصر لكل صفحة (يمكن تغييره ديناميكياً)
  itemsPerPage = 10;
  currentPage = 1;

  get paginatedData() {
    if (!this.IsPager) {
      return this.filteredData;
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredData.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  exportToCSV() {
    this.popoverController.dismiss();
    const separator = ';'; // ✅ استخدم ; بدلاً من , لفصل الأعمدة
    const headers = this.columns.map(col => `"${this.getColName(col)}"`).join(separator);
    const rows = this.filteredData.map(row =>
      this.columns.map(col => `"${row[col]}"`).join(separator)
    );
    const csvContent = [headers, ...rows].join('\n');

    const BOM = '\uFEFF'; // ✅ دعم العربية
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }


  // exportToExcel() {
  //   const table = document.getElementById('printableTable');
  //   if (!table) return;

  //   const tableHtml = table.outerHTML.replace(/ /g, '%20');

  //   const excelFile =
  //     `<html xmlns:o="urn:schemas-microsoft-com:office:office"
  //            xmlns:x="urn:schemas-microsoft-com:office:excel"
  //            xmlns="http://www.w3.org/TR/REC-html40">
  //     <head>
  //       <meta charset="UTF-8">
  //       <!-- Excel-specific styling -->
  //       <style>
  //         .table-class td, .table-class th {
  //           border: 1px solid #000;
  //           padding: 5px;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       ${table.outerHTML}
  //     </body>
  //     </html>`;

  //   const blob = new Blob([excelFile], {
  //     type: 'application/vnd.ms-excel'
  //   });

  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'table_export.xls';
  //   a.click();
  //   URL.revokeObjectURL(url);
  // }
  // calculateFontSize(text: string): number {
  //   const baseFontSize = 14;
  //   const minFontSize = 7;
  //   const maxLength = 20;

  //   if (!text) return baseFontSize;

  //   const excessLength = text.length - maxLength;

  //   if (excessLength <= 0) return baseFontSize;

  //   // تقليل نقطة واحدة لكل 5 أحرف زائدة تقريبًا
  //   const shrink = Math.floor(excessLength / 5);
  //   const newSize = baseFontSize - shrink;

  //   return newSize < minFontSize ? minFontSize : newSize;
  // }

  getCellStyle(text: string): { [key: string]: string | number } {
    const baseFontSize = 14;
    const minFontSize = 8;
    const maxLengthBeforeShrink = 8;

    const length = text?.length || 0;
    const excessLength = length - maxLengthBeforeShrink;

    const shrink = Math.floor(excessLength / 5);
    const fontSize = length > maxLengthBeforeShrink ? baseFontSize - shrink : baseFontSize;
    const finalFontSize = fontSize < minFontSize ? minFontSize : fontSize;

    return {
      'font-size.px': finalFontSize,
      'white-space': length > 50 ? 'normal' : 'nowrap',
      'overflow-wrap': 'break-word',
      'word-break': 'break-word',
      'max-width': '300px', // يمكن تعديله حسب الحاجة
    };
  }

  rowClass(row) {
    if (row == this.SelectedRow) { return 'selected-row'; }
    let className = ``;// `atype-${row.AType}`;
    switch (row.AType) {
      case 0:
        className = ``;// `event-real-class`;
        break;
      case 1:
        className = `event-wait-class`;
        break;
      case 3:
        // className = `event-walkin-class`;
        break;
      case 4:
        className = `event-real-class`;
        break;
      case 5:
        className = `atype-5`;
        break;
    }

    // if (row.Deleted) {
    //   className = `event-deleted-class`;
    // }

    // if (row.Invoiced) {
    //   className = `invoiced`;
    // } else if (row.Attend) {
    //   className = `invoiced`;
    // }

    // if (row.HasMedicalRcord) {
    //   className = `HasMedicalRcord`;
    // }

    if (this.isDateCurrentRange(row.ADate)) {
      className += ` current-appt`;
    }

    return className;
  }

  isDateCurrentRange(targetDate: string): boolean {
    const dateToCheck = new Date(targetDate);
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const twentyMinutesLater = new Date(now.getTime() + 20 * 60 * 1000);

    return dateToCheck >= tenMinutesAgo && dateToCheck <= twentyMinutesLater;
  }
}
