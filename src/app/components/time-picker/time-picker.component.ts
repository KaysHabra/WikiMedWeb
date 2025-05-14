import { Component, OnInit, ViewChild } from '@angular/core';
import { Directive, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent  implements OnInit {


  constructor(private el: ElementRef) {}

  ngOnInit() {}

  // المتغير الذي يخزن الوقت المُدخل (مثلاً "08:30 AM")
  time: string = '';

  @ViewChild('hiddenTimeInput', { static: false }) hiddenTimeInput!: ElementRef;

  // دالة لفتح عنصر الـ time-picker المخفي
  openTimePicker() {
    this.hiddenTimeInput.nativeElement.click();
  }

  // عند تغيير الوقت من الـ time-picker
  onTimePickerChange(event: any) {
    const value = event.target.value; // يكون بالشكل "HH:mm" (نظام 24 ساعة)
    const [hour, minute] = value.split(':');
    let hourNum = +hour;
    const period = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12;
    if (hourNum === 0) {
      hourNum = 12;
    }
    // تحديث المتغير مع التنسيق المناسب
    this.time = (hourNum < 10 ? '0' + hourNum : hourNum) + ':' + minute + ' ' + period;
  }

}
