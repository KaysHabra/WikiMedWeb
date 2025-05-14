import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-med-form-panel',
  templateUrl: './med-form-panel.component.html',
  styleUrls: ['./med-form-panel.component.scss'],
})
export class MedFormPanelComponent implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter<any>();
  @Input() Lang = `E`;
  @Input() IsPrinting = true;
  // @Input() item = {};
  // @Input() tblRows = [
  //   {
  //     tblItems: [
  //       {
  //         ItemType: `Title`,
  //         Label: `PAIN REASSESSMENT`,
  //         Value: ``,
  //         Width: `100%`,
  //       },
  //     ]
  //   },
  //   {
  //     tblItems: [
  //       {
  //         ItemType: `Combo`,
  //         Label: `Pain Score`,
  //         Width: `200px`,
  //         Options: [{ val: 1 }, { val: 2 }, { val: 3 }],
  //         Value: ``,
  //       },
  //       {
  //         ItemType: `Text`,
  //         Label: `Onset`,
  //         Width: `200px`,
  //         Value: ``,
  //       },
  //       {
  //         ItemType: `Text`,
  //         Label: `Location`,
  //         Width: `400px`,
  //         Value: ``,
  //       },
  //     ]
  //   },


  // ];

  tblRows = [];

  Item = null; // "PAIN Score[Text100];Location[Text100]"
  // "PAIN REASSESSMENT[Title]
  // Pain Score[Combo100](0=0&1=1&2=2&3=3&4=4&5=5&6=6);Onset[Text100];Location[Text200]
  // Type/Quality[Label600]
  // [CheckList600](Cramping=1&Dull=2&Burning=3&Radiating=4&Intermittent=5&Squeezing/Pressure=6&Stabbing=7);Other[Text250]
  @Input()
  set item(data: any) {
    this.Item = data;
    console.log(`qqqwwwwwwwwwww= `, data.ListValues);
    if (this.Item.ListValues != '') {
      this.tblRows = this.parseToJSON(this.Item.ListValues);
      console.log(`tttt5555555555= `, this.tblRows);
      // this.Item.ReportVal = this.Item.ReportVal.split(` `)[0];
    }

    let tmpRes = this.convertTextToJson(data.Report);

    // alert(JSON.stringify(this.Item.ReportVal));
    for (let row of this.tblRows) {
      for (let item of row.tblItems) {
        if (tmpRes[item.Label] && tmpRes[item.Label] != '') {
          item.Value = tmpRes[item.Label];
        }
      }
    }


  }

  convertTextToJson(originalText) {
    let result: { [key: string]: string | number } = {};
    const pairs = originalText.split(';');
    pairs.forEach(pair => {
      if (pair) { // تأكد من أن الزوج غير فارغ
        const [key, value] = pair.split('=');
        result[key] = value || ''; // استخدم '' إذا كانت القيمة غير معرفة
      }
    });
    return result;
  }

  constructor() { }

  ngOnInit() { }

  export() {

  }
  setTime($event, Time) {
    console.log($event);
    Time = $event;
  }

  // parseToJSON(inputText) {
  //   const lines = inputText.trim().split('\n');
  //   const tblRows = [];

  //   for (let line of lines) {
  //     line = line.trim();
  //     if (!line) continue;

  //     const row = { tblItems: [] };

  //     // تقسيم العناصر بالسطر الواحد
  //     const parts = line.split(';');

  //     for (let part of parts) {
  //       const match = part.match(/^(.+?)\[(.+?)\](?:\((.*?)\))?$/);
  //       if (!match) continue;

  //       const label = match[1].trim();
  //       const typeAndWidth = match[2].trim();
  //       const optionsRaw = match[3] || '';

  //       const itemType = typeAndWidth.replace(/\d+$/, '');
  //       const widthMatch = typeAndWidth.match(/\d+$/);
  //       const width = widthMatch ? `${widthMatch[0]*2}px` : '100%';

  //       const item:any = {
  //         ItemType: itemType === 'Label' ? 'Title' : itemType,
  //         Label: label,
  //         Width: width,
  //         Value: ''
  //       };

  //       if (['Combo', 'CheckList'].includes(item.ItemType)) {
  //         item.Options = optionsRaw.split('&').map(opt => {
  //           const [k, v] = opt.split('=');
  //           return { Name: k.trim(), Val: parseInt(v) };
  //         });
  //       }

  //       row.tblItems.push(item);
  //     }

  //     tblRows.push(row);
  //   }

  //   return tblRows;
  // }


  // parseToJSON(inputText) {
  //   const lines = inputText.trim().split('\n');
  //   const tblRows = [];

  //   for (let line of lines) {
  //     line = line.trim();
  //     if (!line) continue;

  //     const row = { tblItems: [] };
  //     const parts = line.split(';');

  //     for (let part of parts) {
  //       const match = part.match(/^(.+?)\[(.+?)\](?:\((.*?)\))?$/);
  //       if (!match) continue;

  //       const label = match[1].trim();
  //       let typeWidthExtra = match[2].trim();
  //       const optionsRaw = match[3] || '';

  //       let itemType = '';
  //       let width = '100%';
  //       let rows = undefined;
  //       let noCaption = false;
  //       if (typeWidthExtra.includes('NoCaption')) {
  //         noCaption = true;
  //         typeWidthExtra = typeWidthExtra.replace('NoCaption', '');
  //       }

  //       // معالجة NoCaptionMemo ذات التنسيق الخاص
  //       const ncmMatch = typeWidthExtra.match(/(NoCaptionMemo)(\d+)-(\d+)/);
  //       if (ncmMatch) {
  //         itemType = ncmMatch[1];
  //         width = `${ncmMatch[2] * 2}px`;
  //         rows = parseInt(ncmMatch[3]);
  //       } else {
  //         // النوع العادي
  //         itemType = typeWidthExtra.replace(/\d+$/, '');
  //         const widthMatch = typeWidthExtra.match(/\d+$/);
  //         if (widthMatch) {
  //           width = `${widthMatch[0] * 2}px`;
  //         }
  //       }

  //       const item: any = {
  //         ItemType: itemType === 'Label' ? 'Title' : itemType,
  //         Label: label,
  //         Width: width,
  //         Value: ''
  //       };

  //       if (rows !== undefined) {
  //         item.Rows = rows;
  //       }
  //       if (itemType == 'NoCaptionDateTime') {
  //         item.Date = ``;
  //         item.Time = ``;
  //       }

  //       if (['Combo', 'CheckList', 'RadioList'].includes(item.ItemType)) {
  //         item.Options = optionsRaw.split('&').map(opt => {
  //           const [k, v] = opt.split('=');
  //           return { Name: k.trim(), Val: parseInt(v) };
  //         });
  //       }

  //       row.tblItems.push(item);
  //     }

  //     tblRows.push(row);
  //   }

  //   return tblRows;
  // }

  // parseToJSON(inputText) {
  //   const lines = inputText.trim().split('\n');
  //   const tblRows = [];

  //   for (let line of lines) {
  //     line = line.trim();
  //     if (!line) continue;

  //     const row = { tblItems: [] };
  //     const parts = line.split(';');

  //     for (let part of parts) {
  //       const match = part.match(/^(.+?)\[(.+?)\](?:\((.*?)\))?$/);
  //       if (!match) continue;

  //       const label = match[1].trim();
  //       let typeWidthExtra = match[2].trim();
  //       const optionsRaw = match[3] || '';

  //       let itemType = '';
  //       let width = '100%';
  //       let rows = undefined;
  //       let noCaption = false;
  //       if (typeWidthExtra.includes('NoCaption')) {
  //         noCaption = true;
  //         typeWidthExtra = typeWidthExtra.replace('NoCaption', '');
  //       }

  //       // معالجة NoCaptionMemo ذات التنسيق الخاص
  //       const ncmMatch = typeWidthExtra.match(/([A-Za-z]+)(\d+)-(\d+)/);
  //       if (ncmMatch) {
  //         itemType = ncmMatch[1];
  //         width = `${ncmMatch[2] * 2}px`;
  //         rows = parseInt(ncmMatch[3]);
  //       } else {
  //         // النوع العادي
  //         itemType = typeWidthExtra.replace(/\d+$/, '');
  //         const widthMatch = typeWidthExtra.match(/\d+$/);
  //         if (widthMatch) {
  //           width = `${widthMatch[0] * 2}px`;
  //         }
  //       }

  //       const item: any = {
  //         ItemType: itemType === 'Label' ? 'Title' : itemType,
  //         Label: label,
  //         Width: width,
  //         Value: ''
  //       };

  //       if (rows !== undefined) {
  //         item.Rows = rows;
  //       }
  //       if (itemType == 'NoCaptionDateTime') {
  //         item.Date = ``;
  //         item.Time = ``;
  //       }

  //       // if (noCaption) {
  //         item.NoCaption = noCaption;
  //       // }

  //       if (['Combo', 'CheckList', 'RadioList'].includes(item.ItemType)) {
  //         item.Options = optionsRaw.split('&').map(opt => {
  //           const [k, v] = opt.split('=');
  //           return { Name: k.trim(), Val: parseInt(v) };
  //         });
  //       }

  //       row.tblItems.push(item);
  //     }

  //     tblRows.push(row);
  //   }

  //   return tblRows;
  // }

  parseToJSON(inputText) {
    const lines = inputText.trim().split('\n');
    const tblRows = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      const row = { tblItems: [] };
      const parts = line.split(';');

      for (let part of parts) {
        const match = part.match(/^(.+?)\[(.+?)\](?:\((.*?)\))?$/);
        if (!match) continue;

        const label = match[1].trim();
        let typeWidthExtra = match[2].trim();
        const optionsRaw = match[3] || '';

        let itemType = '';
        let widthPx = 100;
        let rows = undefined;
        let noCaption = false;

        // التحقق من وجود NoCaption
        if (typeWidthExtra.includes('NoCaption')) {
          noCaption = true;
          typeWidthExtra = typeWidthExtra.replace('NoCaption', '');
        }

        // Memo أو TextArea مثل Memo450-10
        const memoMatch = typeWidthExtra.match(/([A-Za-z]+)(\d+)-(\d+)/);
        if (memoMatch) {
          itemType = memoMatch[1];
          widthPx = parseInt(memoMatch[2]);
          rows = parseInt(memoMatch[3]);
        } else {
          itemType = typeWidthExtra.replace(/\d+$/, '');
          const widthMatch = typeWidthExtra.match(/\d+$/);
          if (widthMatch) {
            widthPx = parseInt(widthMatch[0]);
          }
        }

        const item: any = {
          ItemType: itemType === 'Label' ? 'Title' : itemType,
          Label: label,
          WidthPx: widthPx, // سنستخدمه لاحقًا لحساب النسبة
          Value: ''
        };

        if (rows !== undefined) item.Rows = rows;
        if (noCaption) item.NoCaption = true;

        if (['Combo', 'CheckList', 'RadioList'].includes(item.ItemType)) {
          item.Options = optionsRaw.split('&').map(opt => {
            const [k, v] = opt.split('=');
            return { Name: k.trim(), Val: parseInt(v) };
          });
        }

        // if (['Date'].includes(item.ItemType)) {
        //   item.WidthPx += 100;
        // }

        row.tblItems.push(item);
      }

      // حساب عرض العناصر كنسبة مئوية
      const totalWidthPx = row.tblItems.reduce((sum, item) => sum + item.WidthPx, 0);
      const itemCount = row.tblItems.length;

      row.tblItems.forEach(item => {
        if (itemCount === 1) {
          item.Width = '100%';
        } else {
          const percent = Math.round((item.WidthPx / totalWidthPx) * 100);
          item.Width = `${percent}%`;
        }
        delete item.WidthPx; // نحذف WidthPx بعد الحساب
      });

      tblRows.push(row);
    }

    return tblRows;
  }



  // const inputText = `PAIN REASSESSMENT[Title]
  // Pain Score[Combo100](0=0&1=1&2=2&3=3&4=4&5=5&6=6);Onset[Text100];Location[Text200]
  // Type/Quality[Label600]
  // [CheckList600](Cramping=1&Dull=2&Burning=3&Radiating=4&Intermittent=5&Squeezing/Pressure=6&Stabbing=7);Other[Text250]`;

  // const jsonOutput = convertTextToJson(inputText);
  // console.log(jsonOutput);

  convertTo12HourFormat(time24: string): string {
    if (!time24) return '';

    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    if (isNaN(hour) || isNaN(minute)) return '';

    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;

    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  // setCombo($event, row, item) {
  //   console.log(item);
  // }

  // setText($event, row, item) {
  //   console.log(item);
  // }

  resultReady() {
    let Result = ``;
    let IsFill = false;
    for (let row of this.tblRows) {
      for (let item of row.tblItems) {
        if (item.Value != ``) {
          IsFill = true;
        }
      }
    }
    for (let row of this.tblRows) {
      for (let item of row.tblItems) {
        if (item.ItemType != `Title`) {
          if (Result != ``) { Result += `;`; }
          Result += `${item.Label}=${item.Value}`;
        }
      }
    }
    this.getData.emit(Result);
  }

}
