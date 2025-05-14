import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-temp1',
  templateUrl: './temp1.page.html',
  styleUrls: ['./temp1.page.scss'],
})
export class Temp1Page implements OnInit {
  columns = [
    { name: 'Column 1', width: 200 },
    { name: 'Column 2', width: 200 },
    { name: 'Column 3', width: 200 }
  ];
  data = [
    [{ value: 'Row 1 Col 1', width: 200 }, { value: 'Row 1 Col 2', width: 200 }, { value: 'Row 1 Col 3', width: 200 }],
    [{ value: 'Row 2 Col 1', width: 200 }, { value: 'Row 2 Col 2', width: 200 }, { value: 'Row 2 Col 3', width: 200 }]
  ];

  constructor(private renderer: Renderer2) { }

  ngOnInit() { }

  onMouseDown(event: MouseEvent, column: any) {
    event.preventDefault();
    const startX = event.pageX;
    const startWidth = column.width;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.pageX - startX);
      column.width = newWidth > 50 ? newWidth : 50; // الحد الأدنى لعرض العمود 50 بكسل
      this.syncColumnWidths(column, newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  syncColumnWidths(column: any, newWidth: number) {
    const colIndex = this.columns.indexOf(column);
    this.data.forEach(row => {
      const cell = row[colIndex];
      this.renderer.setStyle(cell, 'width', `${newWidth}px`);
    });
  }
}


