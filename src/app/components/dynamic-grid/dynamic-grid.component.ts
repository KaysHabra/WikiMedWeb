import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.scss'],
})
export class DynamicGridComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}


  tblTemp = [
    {
      ID: 1, Name: `Kays`, BirthDay: `1980-01-20`,
    },
    {
      ID: 20, Name: `Samer`, BirthDay: `1982-01-20`,
    },
    {
      ID: 3, Name: `Malek`, BirthDay: `2002-03-20`,
    },
    {
      ID: 4, Name: `maher`, BirthDay: `1982-01-20`,
    }
  ];


  LSort = {
    sortBy: ``, order: ``,
  };
  getSortedIndices(
    sourceArray: any[],          // المصفوفة المصدر
    sortBy: string,             // الحقل المراد الفرز حسبه
    order: 'asc' | 'desc' = 'asc', // الترتيب
    isDate: boolean = false
  ): number[] {
    if (this.LSort.sortBy == sortBy) {
      if (this.LSort.order == `asc`) { order = `desc` }
      else { order = `asc` }
    }
    this.LSort = {
      sortBy: sortBy, order: order
    };
    // إنشاء مصفوفة المؤشرات [0, 1, 2, ...]
    const indices = Array.from({ length: sourceArray.length }, (_, i) => i);

    indices.sort((a, b) => {
      const valueA = sourceArray[a][sortBy];
      const valueB = sourceArray[b][sortBy];

      // معالجة القيم الفارغة
      if (valueA == null) return order === 'asc' ? 1 : -1;
      if (valueB == null) return order === 'asc' ? -1 : 1;

      // معالجة التواريخ
      if (isDate || valueA instanceof Date) {
        const dateA = new Date(valueA).getTime();
        const dateB = new Date(valueB).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // معالجة النصوص (حالة غير حساسة للأحرف)
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc'
          ? valueA.toLowerCase().localeCompare(valueB.toLowerCase())
          : valueB.toLowerCase().localeCompare(valueA.toLowerCase());
      }

      // معالجة الأرقام والقيم الأخرى
      return order === 'asc'
        ? valueA > valueB ? 1 : -1
        : valueA > valueB ? -1 : 1;
    });

    return indices;
  }
  // tblTempSort = this.getSortedIndices(this.tblTemp, 'ID', 'asc');
  tblTempSort =  Array.from({ length: this.tblTemp.length }, (_, i) => i);

}
