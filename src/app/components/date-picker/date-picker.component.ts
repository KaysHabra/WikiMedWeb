import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements OnInit {
  @Output() DateChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() placeholder: string = ''; // إضافة خاصية اختيارية إذا لزم الأمر

  // internalValue: string = ''; // القيمة الداخلية للمكون

  // دالة تُستدعى عند تغيير القيمة
  onChange: any = () => { };

  // دالة تُستدعى عند لمس المكون
  onTouched: any = () => { };

  // تعيين القيمة من ngModel إلى المكون
  writeValue(value: any): void {
    if (value) {
      // alert(value)
      this.dateValue = value.split(`T`)[0];
      this.DateChanged.emit(this.dateValue);
    }

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

  // عند تغيير القيمة في حقل الإدخال
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dateValue = value;
    this.onChange(value); // إعلام ngModel بالتغيير
    this.DateChanged.emit(this.dateValue);
  }

  @Input() Label = '';
  @Input() IsCalendar = true;
  @Input() LabelColor = `dark`;
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {

  }


  dateValue: string = '';
  showCalendar: boolean = false;

  @ViewChild('dateInput') dateInput!: ElementRef;

  // تفعيل قناع الإدخال (yyyy-mm-dd)
  onInputChange(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // إزالة أي حرف غير رقمي
    if (value.length > 4) value = value.slice(0, 4) + '-' + value.slice(4); // إضافة -
    if (value.length > 7) value = value.slice(0, 7) + '-' + value.slice(7); // إضافة -
    this.dateValue = value.slice(0, 10); // منع أكثر من 10 حروف


    if (this.isValidDate(this.dateValue)) {
      this.onChange(this.dateValue);
      this.DateChanged.emit(this.dateValue);
    }
  }

  // فتح التقويم عند الضغط على الأيقونة
  openCalendar() {
    this.showCalendar = true;
  }

  // تحديث الحقل عند اختيار تاريخ من التقويم
  onDateSelected(event: any) {
    this.dateValue = event.detail.value;
    this.showCalendar = false;
    if (this.isValidDate(this.dateValue)) {
      this.onChange(this.dateValue);
      this.DateChanged.emit(this.dateValue);
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
      this.dateValue = this.toLocalISOString(new Date()).split(`T`)[0];
      this.onChange(this.dateValue);
      this.DateChanged.emit(this.dateValue);
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

  // getWeekDate(targetDay) {
  //   this.popoverController.dismiss().then(() => {
  //     const today = new Date();
  //     const currentDay = today.getDay(); // 0 = الأحد, 6 = السبت
  //     const dayMap = { 'saturday': 6, 'thursday': 4 }; // مخصص حسب طلبك

  //     const target = dayMap[targetDay.toLowerCase()];
  //     if (target === undefined) throw new Error("Use 'saturday' or 'thursday'");

  //     const diff = target - currentDay;

  //     const targetDate = new Date(today);
  //     targetDate.setDate(today.getDate() + diff);

  //     const yyyy = targetDate.getFullYear();
  //     const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  //     const dd = String(targetDate.getDate()).padStart(2, '0');

  //     // return `${yyyy}-${mm}-${dd}`;

  //     this.dateValue = `${yyyy}-${mm}-${dd}`;
  //     this.onChange(this.dateValue);
  //     this.DateChanged.emit(this.dateValue);

  //   });

  // }

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

      this.dateValue = `${yyyy}-${mm}-${dd}`;
      // setTimeout(() => {
      this.onChange(this.dateValue);
      this.DateChanged.emit(this.dateValue);
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
          this.dateValue = this.formatDate(today); // اليوم هو السبت
          this.onChange(this.dateValue);
          this.DateChanged.emit(this.dateValue);

          return;
        } else {
          const diff = day >= 6 ? day - 6 : day + 1;
          targetDate.setDate(today.getDate() - diff);
        }
      } else if (mode === 1) {
        // التعامل مع الخميس (4)
        if (day === 4) {
          this.dateValue = this.formatDate(today); // اليوم هو الخميس
          this.onChange(this.dateValue);
          this.DateChanged.emit(this.dateValue);
          return;
        } else {
          const daysUntilThursday = (11 - day) % 7;
          targetDate.setDate(today.getDate() + daysUntilThursday);
        }
      } else {
        throw new Error("Invalid mode. Use 0 for Saturday or 1 for Thursday.");
      }

      this.dateValue = this.formatDate(targetDate);
      this.onChange(this.dateValue);
      this.DateChanged.emit(this.dateValue);
    });
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
