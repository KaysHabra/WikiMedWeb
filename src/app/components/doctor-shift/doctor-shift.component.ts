import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-doctor-shift',
  templateUrl: './doctor-shift.component.html',
  styleUrls: ['./doctor-shift.component.scss'],
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DoctorShiftComponent),
        multi: true
      }
    ]
})
export class DoctorShiftComponent implements OnInit {
  // data: any;

  // Function to call when the data changes.
  onChange: any = () => { };
  // Function to call when the component is touched.
  onTouched: any = () => { };

  writeValue(value: any): void {
    console.log(value);
    this.Value = value;
    setTimeout(() => {
      this.updateMarkerPosition();
    }, 2500);
    
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
    this.Value = newValue;
    this.onChange(newValue);
    this.onTouched();
  }
  // ################ ngModel End ##################







  
  // Value = { lower: 96, upper: 192 };
  markerValue: number = 288; // القيمة المستهدفة
  markerPosition: number = 0;


  Value = { lower: 96, upper: 192 };
  @Input() min = 96;
  @Input() max = 400;
  @Input() DayName = `Saturday`;
  @Input() Active = true;
  @Input() IsDayName = true;
  // @Output() counterNumberChange: EventEmitter<any> = new EventEmitter<any>();

  // lang:any = "en";
  constructor(private translate: TranslateService, public language: LanguageService) {
    // this.lang = this.translate.getLangs();
    // alert(this.lang);
  }

  ngOnInit() {
    setTimeout(() => {
      this.setEndDayPosition();
      this.updateMarkerPosition();
    }, 300);
  }


  setEndDayPosition() {
    const min = this.min;
    const max = this.max;
    // حساب موقع الإشارة بناءً على القيمة المستهدفة
    this.markerPosition = ((this.markerValue - min) / (max - min)) * 100;
  }



  lowerValue = `0`;
  upperValue = `0`;
  lowerMarkerPosition = 0;
  upperMarkerPosition = 0;

  updateMarkerPosition() {
    const { lower, upper } = this.Value;

    this.lowerValue = this.calculateTime(lower, this.DayName); // حساب القيمة السفلية
    this.upperValue = this.calculateTime(upper, this.DayName); // حساب القيمة العليا

    // النسبة المئوية للمقبضين
    this.lowerMarkerPosition = ((lower - this.min) / (this.max - this.min)) * 100;
    this.upperMarkerPosition = ((upper - this.min) / (this.max - this.min)) * 100;

    this.updateData(this.Value)
    // this.counterNumberChange.emit(this.Value);

  }

  // changeMarker(event){
  //   console.log(`www`);
  //   setTimeout(() => {
  //     this.updateMarkerPosition();
  //   }, 250);
  // }
  calculateTime(value: number, day: string): string {
    // قائمة بأيام الأسبوع
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // حساب عدد الساعات والدقائق
    const totalMinutes = value * 5; // كل وحدة تمثل 5 دقائق
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // حساب اليوم
    const currentDayIndex = daysOfWeek.indexOf(day);
    const additionalDays = Math.floor(hours / 24); // عدد الأيام المضافة
    const newDayIndex = (currentDayIndex + additionalDays) % 7; // اليوم الجديد
    const newDay = daysOfWeek[newDayIndex];

    // حساب الوقت داخل اليوم
    const timeInDay = hours % 24;
    const period = timeInDay < 12 ? 'AM' : 'PM'; // الفترة الزمنية
    const formattedHour = timeInDay % 12 || 12; // الساعات في صيغة 12 ساعة

    // return `${this.translate.instant(newDay)} <br> ${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    return `${this.IsDayName? this.translate.instant(newDay) +'<br>': ''}  ${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

}
