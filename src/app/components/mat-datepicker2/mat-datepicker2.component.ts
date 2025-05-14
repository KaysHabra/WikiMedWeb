import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-mat-datepicker2',
  templateUrl: './mat-datepicker2.component.html',
  styleUrls: ['./mat-datepicker2.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatDatepicker2Component),
      multi: true
    }
  ]
})
export class MatDatepicker2Component implements OnInit {
  // [(ngModel)]من اجل تفعيل 
  // دالة تُستدعى عند تغيير القيمة
  onChange: any = () => { };

  // دالة تُستدعى عند لمس المكون
  onTouched: any = () => { };
  // تعيين القيمة من ngModel إلى المكون
  writeValue(value: any): void {
    this.counterNumber = value;
  }

  // تسجيل دالة التغيير
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // تسجيل دالة اللمس
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // تعطيل أو تمكين المكون (اختياري)
  setDisabledState?(isDisabled: boolean): void {
    // يمكنك تنفيذ هذا إذا كنت تريد دعم تعطيل المكون
  }


  @Input() disabled = false;

  @Input() Label = '';

  @Input()
  counterNumber = '';

  @Output() counterNumberChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private popoverController:PopoverController) { }

  ngOnInit() { }

  export(ev) {
    
    // this.counterNumber = this.counterNumber.split("/").reverse().join("-");

    var date = new Date(ev.value);
    let newdate = this.formatDate(date);
    console.log(`cdcdcd= `, ev.value);
    this.counterNumberChange.emit(newdate);
    this.onChange(newdate);
    // alert(newdate);
    
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }







  // عند الإدخال
  // onDateInput(event: any): void {
  //   let value = event.target.value;

  //   // السماح فقط بالأرقام في المواضع الصحيحة والحفاظ على الفواصل
  //   value = value
  //     .replace(/[^\d/]/g, '') // إزالة الأحرف غير الأرقام أو '/'
  //     .replace(/^(\d{2})(?!\/)/, '$1/') // إضافة '/' بعد اليوم إذا لم يكن موجودًا
  //     .replace(/^(\d{2}\/\d{2})(?!\/)/, '$1/'); // إضافة '/' بعد الشهر إذا لم يكن موجودًا

  //   // تقليم النص بحيث لا يتجاوز التنسيق dd/mm/yyyy
  //   this.counterNumber = value.substring(0, 10);
  // }

  // // عند التركيز على الحقل
  // onDateFocus(): void {
  //   if (this.counterNumber === 'dd/mm/yyyy') {
  //     this.counterNumber = ''; // تفريغ القيمة الافتراضية
  //   }
  // }

  // // عند الخروج من الحقل
  // onDateBlur(): void {
  //   if (!this.counterNumber.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
  //     this.counterNumber = 'dd/mm/yyyy'; // إعادة التنسيق الافتراضي
  //   }
  // }


  onDateInput(event: any): void {
    let value = event.target.value;

    // السماح فقط بالأرقام
    value = value.replace(/[^\d]/g, '');

    // إضافة الفواصل تلقائيًا عند إدخال النص
    if (value.length > 4 && value.length <= 6) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    } else if (value.length > 6) {
      value = value.slice(0, 4) + '-' + value.slice(4, 6) + '-' + value.slice(6, 8);
    }

    // تقليم النص بحيث لا يتجاوز الطول المسموح به
    value = value.substring(0, 10);

    // تحديث القيمة
    this.counterNumber = value;
    console.log(` this.counterNumber= `, this.counterNumber);

    if (this.isValidDate(value)) {
      this.onChange(value);
      // alert(newdate);
      this.counterNumberChange.emit(value);
    }
  }

  // عند التركيز على الحقل
  onDateFocus(): void {
    if (this.counterNumber === 'yyyy-MM-dd') {
      this.counterNumber = ''; // تفريغ القيمة الافتراضية
    }
  }

  // عند الخروج من الحقل
  onDateBlur(): void {
    if (!this.isValidDate(this.counterNumber)) {
      this.counterNumber = 'yyyy-MM-dd'; // إعادة التنسيق الافتراضي
    }
  }

  isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    // التحقق من الصيغة العامة
    if (!regex.test(dateString)) return false;

    // تحويل النص إلى كائن تاريخ
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    // التحقق من القيم الفعلية
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  today() {
    this.popoverController.dismiss().then(() => {
      this.counterNumber = this.toLocalISOString(new Date()).split(`T`)[0];
      this.onChange(this.counterNumber);
      this.counterNumberChange.emit(this.counterNumber);
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

  getMonthDate(position) {
    this.popoverController.dismiss().then(() => {
      const today = new Date();
      let targetDate;

      if (position.toLowerCase() === 'first') {
        targetDate = new Date(today.getFullYear(), today.getMonth(), 1);
      } else if (position.toLowerCase() === 'last') {
        targetDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      } else {
        throw new Error("Use 'first' or 'last'");
      }

      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dd = String(targetDate.getDate()).padStart(2, '0');

      // return `${yyyy}-${mm}-${dd}`;

      this.counterNumber = `${yyyy}-${mm}-${dd}`;
      // setTimeout(() => {
      this.onChange(this.counterNumber);
      this.counterNumberChange.emit(this.counterNumber);
      // }, 500);


    });
  }

  getWeekdayDate(mode) {
    this.popoverController.dismiss().then(() => {
      const today = new Date();
      const day = today.getDay(); // 0=Sunday, 6=Saturday
      const targetDate = new Date(today);

      if (mode === 0) {
        // التعامل مع السبت (6)
        if (day === 6) {
          this.counterNumber = this.formatDate(today); // اليوم هو السبت
          this.onChange(this.counterNumber);
          this.counterNumberChange.emit(this.counterNumber);

          return;
        } else {
          const diff = day >= 6 ? day - 6 : day + 1;
          targetDate.setDate(today.getDate() - diff);
        }
      } else if (mode === 1) {
        // التعامل مع الخميس (4)
        if (day === 4) {
          this.counterNumber = this.formatDate(today); // اليوم هو الخميس
          this.onChange(this.counterNumber);
          this.counterNumberChange.emit(this.counterNumber);
          return;
        } else {
          const daysUntilThursday = (11 - day) % 7;
          targetDate.setDate(today.getDate() + daysUntilThursday);
        }
      } else {
        throw new Error("Invalid mode. Use 0 for Saturday or 1 for Thursday.");
      }

      this.counterNumber = this.formatDate(targetDate);
      this.onChange(this.counterNumber);
      this.counterNumberChange.emit(this.counterNumber);
    });
  }

  
}
