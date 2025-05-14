import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTimeInputMask]',
  standalone: false
})
export class TimeInputMaskDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let input = this.el.nativeElement.value;
    // حذف الأحرف غير المسموح بها (نسمح بالأرقام والنقطتين)
    input = input.replace(/[^0-9:]/g, '');

    // إضافة النقطتين تلقائيًا إذا لم تكن موجودة بعد إدخال ساعتين
    if (input.length > 2 && input.indexOf(':') === -1) {
      input = input.slice(0, 2) + ':' + input.slice(2);
    }

    // تقسيم النص إلى ساعات ودقائق
    const parts = input.split(':');
    if (parts.length > 1) {
      let hours = parts[0];
      let minutes = parts[1].replace(/[^0-9]/g, ''); // حذف أي رموز غير رقمية في الدقائق

      // التحقق من صحة الساعات
      let hourNum = parseInt(hours, 10);
      if (!isNaN(hourNum)) {
        if (hourNum < 1) { 
          hourNum = 1;
        }
        if (hourNum > 12) { 
          hourNum = 12;
        }
        hours = hourNum < 10 ? '0' + hourNum : '' + hourNum;
      }

      // التحقق من صحة الدقائق
      let minuteNum = parseInt(minutes, 10);
      if (!isNaN(minuteNum)) {
        if (minuteNum < 0) {
          minuteNum = 0;
        }
        // إذا كانت الدقائق 60 فأكثر (مثلاً 94) يتم إعادة ضبطها إلى 0 كما طلبت
        if (minuteNum > 59) { 
          minuteNum = 0;
        }
        minutes = minuteNum < 10 ? '0' + minuteNum : '' + minuteNum;
      }
      input = hours + ':' + minutes;
    }
    this.el.nativeElement.value = input;
  }
}