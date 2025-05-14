import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatetimeService {

  constructor() { }

  addDaysToDate(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // getCurrentDateTime() {
  //   const now = new Date();

  //   const year = now.getFullYear();
  //   const month = String(now.getMonth() + 1).padStart(2, '0'); // الأشهر من 0 إلى 11
  //   const day = String(now.getDate()).padStart(2, '0');

  //   const hours = String(now.getHours()).padStart(2, '0');
  //   const minutes = String(now.getMinutes()).padStart(2, '0');
  //   const seconds = String(now.getSeconds()).padStart(2, '0');

  //   // التنسيق: yyyy-MM-dd HH:MM:SS
  //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // }

  getCurrentDateTime() {
    const now = new Date();

    // استخدام toLocaleString مع خيارات محددة
    const dateTime = now.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // استخدام تنسيق 24 ساعة
    });

    // تحويل التنسيق إلى yyyy-MM-dd HH:MM:SS
    const [date, time] = dateTime.split(', ');
    const [day, month, year] = date.split('/');
    const [hours, minutes, seconds] = time.split(':');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  getAdjacentDate(dateString, days) {
    // تحويل تاريخ النص إلى كائن Date
    const date = new Date(dateString);

    // إضافة أو طرح الأيام بناءً على المعامل days
    date.setDate(date.getDate() + days);

    // إرجاع التاريخ الجديد كسلسلة نصية بتنسيق YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // الأشهر من 0 إلى 11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  formatTimeAmPm(isoDate) { // yyyy-MM-ddThh:mm:ssZ -> yyyy-MM-dd hh:mm PM/AM
    // تحويل السلسلة النصية إلى كائن Date
    const date = new Date(isoDate);

    // استخراج السنة، الشهر، اليوم بالتوقيت العالمي (UTC)
    // const year = date.getUTCFullYear();
    // const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // الأشهر من 0 إلى 11
    // const day = String(date.getUTCDate()).padStart(2, '0');

    // استخراج الساعة والدقائق بالتوقيت العالمي (UTC)
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // تحويل الساعة من تنسيق 24 ساعة إلى تنسيق 12 ساعة
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // الساعة 0 تصبح 12 في تنسيق 12 ساعة

    // بناء السلسلة النصية النهائية
    return `${hours}:${minutes} ${ampm}`;
  }

  getDateTimeWithoutSecound(isoDateTime) {
    // تحويل النص إلى كائن Date
    const date = new Date(isoDateTime);

    // استخراج التاريخ والوقت باستخدام دوال UTC
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // إضافة الصفر إلى الشهر إذا كان أقل من رقمين
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // تنسيق النص الجديد
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  formatDateTimeAmPm(isoDate) { // yyyy-MM-ddThh:mm:ssZ -> yyyy-MM-dd hh:mm PM/AM
    // تحويل السلسلة النصية إلى كائن Date
    const date = new Date(isoDate);

    // استخراج السنة، الشهر، اليوم بالتوقيت العالمي (UTC)
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // الأشهر من 0 إلى 11
    const day = String(date.getUTCDate()).padStart(2, '0');

    // استخراج الساعة والدقائق بالتوقيت العالمي (UTC)
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // تحويل الساعة من تنسيق 24 ساعة إلى تنسيق 12 ساعة
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // الساعة 0 تصبح 12 في تنسيق 12 ساعة

    // بناء السلسلة النصية النهائية
    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  }
}
