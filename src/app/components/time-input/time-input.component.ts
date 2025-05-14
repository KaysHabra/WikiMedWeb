import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true
    }
  ]
})
export class TimeInputComponent  implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter<any>();

  @Input() appearance: any =`outline`;
  @Input("Label") Label: any = true;
  @Input("disabled") disabled: any = false;

  @Input("isBtnNow") IsBtnNow = false;

  TimeStr='';


  // Function to call when the data changes.
  onChange: any = () => { };
  // Function to call when the component is touched.
  onTouched: any = () => { };

  

  writeValue(value: any): void {
    setTimeout(() => {
      if (value && value) {
        this.TimeStr = value;
      }
    }, 250);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  // Call this method when the data changes inside the component
  updateData(newValue: any) {
    console.log(`updateData`);
    this.TimeStr = newValue;
    this.getData.emit(newValue);
    this.onChange(newValue);
    this.onTouched();
  }

  constructor() { }

  ngOnInit() {}

  setTime(){
    console.log(this.TimeStr);
    if(this.isValid24HourTime(this.TimeStr)){
      this.updateData(this.TimeStr);
    }
  }

  isValidTimeFormat(time: string): boolean {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    return timeRegex.test(time);
  }

  isValid24HourTime(time: string): boolean {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(time);
  }
  
  // onTimeChange(event: any): void {
  //   const time = event.target.value;
  //   const [hours, minutes] = time.split(':');
  //   let ampm = 'AM';
  //   let hours12 = parseInt(hours, 10);

  //   if (hours12 >= 12) {
  //     ampm = 'PM';
  //     if (hours12 > 12) {
  //       hours12 -= 12;
  //     }
  //   } else if (hours12 === 0) {
  //     hours12 = 12;
  //   }

  //   this.timeInputValue = `${hours12.toString().padStart(2, '0')}${minutes.padStart(2, '0')}`;
  //   this.showTimePicker = false;
  // }

  setTimeNow(){
    this.updateData(this.setTimeWithoutSecound(new Date())) 
  }
  
  setTimeWithoutSecound(isoDateTime) {
    // تحويل النص إلى كائن Date
    const date = new Date(isoDateTime);

    // استخراج التاريخ والوقت باستخدام دوال UTC
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // إضافة الصفر إلى الشهر إذا كان أقل من رقمين
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // تنسيق النص الجديد
    return `${hours}:${minutes}`;
  }
}
