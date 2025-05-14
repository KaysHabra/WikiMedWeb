import { Component, OnInit,  } from '@angular/core';

@Component({
  selector: 'app-tmp1',
  templateUrl: './tmp1.page.html',
  styleUrls: ['./tmp1.page.scss'],
})
export class Tmp1Page implements OnInit {
  columns = [
    { name: 'Column 1', width: 200 },
    { name: 'Column 2', width: 200 },
    { name: 'Column 3', width: 200 }
  ];
  data = [
    [{ value: 'Row 1 Col 1', width: 200 }, { value: 'Row 1 Col 2', width: 200 }, { value: 'Row 1 Col 3', width: 200 }],
    [{ value: 'Row 2 Col 1', width: 200 }, { value: 'Row 2 Col 2', width: 200 }, { value: 'Row 2 Col 3', width: 200 }]
  ];

  constructor() { }

  ngOnInit() { }

  onMouseDown(event: MouseEvent, column: any) {
    event.preventDefault();
    const startX = event.pageX;
    const startWidth = column.width;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.pageX - startX);
      column.width = newWidth > 50 ? newWidth : 50; // الحد الأدنى لعرض العمود 50 بكسل
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
    this.data.forEach(row => {
      row.forEach((cell, index) => {
        cell.width = this.columns[index].width;
      });
    });
  }
}
