import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AllService } from 'src/app/services/all.service';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { TextService } from 'src/app/services/text.service';
import { ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-med-form-image',
  templateUrl: './med-form-image.component.html',
  styleUrls: ['./med-form-image.component.scss'],
})
export class MedFormImageComponent implements OnInit {
  @Input() Lang = `E`;
  @Input() IsPrinting = true;
  @Input() ListValues = ``;
  @Input() Image = ``;
  // @Input() Report = ``;

  @Input() set Report(data: any) {
    // alert(data)
    let rows = data.split(/\r?\n/)         // تقسيم بناءً على \n أو \r\n
      .map(line => line.trim()) // حذف الفراغات و \r إن وجدت
      .filter(line => line !== ''); // تجاهل الأسطر الفارغة
    console.log(`sssssssssssssss`, rows);
    for (let r of rows) {
      this.tblResult.push({ data: r });
    }
  }

  // handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
  //   // The `from` and `to` properties contain the index of the item
  //   // when the drag started and ended, respectively
  //   console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

  //   // Finish the reorder and position the item in the DOM based on
  //   // where the gesture ended. This method can also be called directly
  //   // by the reorder group
  //   event.detail.complete();
  // }


  handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // Before complete is called with the items they will remain in the
    // order before the drag
    console.log('Before complete', this.tblResult);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. Update the items variable to the
    // new order of items
    this.tblResult = event.detail.complete(this.tblResult);

    // After complete is called the items will be in the new order
    console.log('After complete', this.tblResult);
  }

  // @Input() item = {
  //   "ID": 444,
  //   "IDForm": 1,
  //   "IDNature": 1,
  //   "IsDefault": 1,
  //   "Visible": 1,
  //   "SingleForm": 0,
  //   "FieldsGroupE": "General Form",
  //   "FieldsGroupA": "النموذج العام",
  //   "NameE": "NURSE’S FORM",
  //   "NameA": "نموذج التمريض",
  //   "FieldDataType": "Text",
  //   "FieldDataSize": 0,
  //   "FieldIsRequired": 0,
  //   "CharsInLine": 0,
  //   "LinesInHeight": 1,
  //   "DefaultColor": 12895487,
  //   "UserUnAllow": "",
  //   "Permissions": "",
  //   "AnswerTypes": "",
  //   "AnswerDegrees": 0,
  //   "HeaderDescriptions": "",
  //   "FooterDescriptions": "",
  //   "ListValues": "",
  //   "ListDefaultValue": -1,
  //   "GroupFields": "",
  //   "GroupColumns": 0,
  //   "GroupLines": 0,
  //   "Image": "",
  //   "DefaultDoc": "",
  //   "CalcName": "",
  //   ReportVal: ""
  // };

  tblResult = [];
  tblVals = [];

  @Output() ResultSubmit = new EventEmitter<any>();
  imageUrl = ``;

  tblForm = [];
  // tblFormItem = [];
  FormOpen = null;


  Result = ``;
  constructor(public all: AllService, private textService: TextService) { }

  ngOnInit() {
    this.getImageData();
  }

  getImageData() {
    let Query0 = `Select Image as Image_Base64,ListValues from FieldsMap where id=359`;
    let Query = `${Query0}`;
    console.log(`Query= `, Query);

    const body = new HttpParams()
      .set('Mtype', 'A16')
      .set('Query', Query);

    this.all.postData(body).then(res => {
      if (res[`Q0Error`] != "") {
        this.all.ngxToast(`Q0Error= `, res[`Q0Error`], `warning`);
        console.log(`Q0Error= `, res[`Q0Error`]);
      }
      let Image = res[`Q0`][0].Image_Base64;
      // console.log(`Image = `, Image );
      this.imageUrl = `data:image/png;base64,${res[`Q0`][0].Image_Base64}`;

      console.log(res[`Q0`][0].ListValues);
      this.tblVals = this.parseData(res[`Q0`][0].ListValues);
      console.log(this.tblVals);
      // console.log(JSON.stringify(jsonResult, null, 2));

    });
  }



  // convertBinaryStringToImage(binaryStr: string): string {
  //   const byteArray = new Uint8Array(binaryStr.length);
  //   for (let i = 0; i < binaryStr.length; i++) {
  //     byteArray[i] = binaryStr.charCodeAt(i);
  //   }
  //   const blob = new Blob([byteArray], { type: 'image/png' });
  //   return URL.createObjectURL(blob);
  // }

  splitMainPIDBlocks(input) {
    // استخدم RegEx لالتقاط كل المقاطع التي تبدأ بـ PID= (بدون < أو ^ قبلها)
    const regex = /(?<![<\^])PID=\d+,[^]*?(?=(?<![<\^])PID=\d+|$)/g;
    const matches = input.match(regex);
    return matches || []; // تأكد من إرجاع مصفوفة حتى لو لم يوجد تطابق
  }

  // parseData(text) {
  //   // let pattern = @"(?<![<\^])PID=";
  //   const lines = this.splitMainPIDBlocks(text);
  //   // alert(lines.length);
  //   const result = [];

  //   for (const line of lines) {
  //     const [main, fieldAreaRaw] = line.split('FieldAreas=<');
  //     // const fields:any = Object.fromEntries(main.split(',').map(part => {
  //     //   const [key, val] = part.split('=');
  //     //   return [key.trim(), isNaN(val) ? val : Number(val)];
  //     // }));

  //     const fieldsArray = main.split(',').map(part => {
  //       const [key, val] = part.split('=');
  //       return [key.trim(), isNaN(Number(val)) ? val : Number(val)];
  //     });
  //     const fields = fieldsArray.reduce((acc, [key, val]) => {
  //       acc[key] = val;
  //       return acc;
  //     }, {} as any);

  //     const fieldAreasText = fieldAreaRaw.replace(/>$/, '');
  //     const fieldAreas = fieldAreasText.split('^').filter(f => f.trim()).map(area => {
  //       // const areaFields:any = Object.fromEntries(area.split(',').map(part => {
  //       //   const [key, val] = part.split('=');
  //       //   return [key.trim(), key === 'DATA' ? val : (isNaN(val) ? val : Number(val))];
  //       // }));


  //       const fieldsArray2 = area.split(',').map(part => {
  //         const [key, val] = part.split('=');
  //         return [key.trim(), isNaN(Number(val)) ? val : Number(val)];
  //       });
  //       const areaFields = fieldsArray2.reduce((acc, [key, val]) => {
  //         acc[key] = val;
  //         return acc;
  //       }, {} as any);

  //       if (areaFields.Name === 'Service Type') {
  //         const items = areaFields.DATA.split('|').filter(x => x).map(x => x.trim());
  //         const grouped = {};
  //         for (const item of items) {
  //           const [group, value] = item.split('.');
  //           if (!grouped[group]) grouped[group] = [];
  //           grouped[group].push(value);
  //         }
  //         areaFields.DATA = Object.entries(grouped).map(([key, values]) => ({
  //           Name: key,
  //           Data: values
  //         }));
  //       } else {
  //         areaFields.DATA = [];
  //       }

  //       return areaFields;
  //     });

  //     result.push({
  //       PID: fields.PID,
  //       Name: fields.Name,
  //       Shape: fields.Shape,
  //       X: fields.X,
  //       Y: fields.Y,
  //       Width: fields.Width,
  //       Height: fields.Height,
  //       FieldAreas: fieldAreas
  //     });
  //   }

  //   return result;
  // }

  // parseData(text) {
  //   const lines = this.splitMainPIDBlocks(text);
  //   const result = [];

  //   for (const line of lines) {
  //     const [main, fieldAreaRaw] = line.split('FieldAreas=<');

  //     const fieldsArray = main.split(',').map(part => {
  //       const [key, val] = part.split('=');
  //       return [key.trim(), isNaN(Number(val)) ? val : Number(val)];
  //     });
  //     const fields = fieldsArray.reduce((acc, [key, val]) => {
  //       acc[key] = val;
  //       return acc;
  //     }, {} as any);

  //     const fieldAreasText = fieldAreaRaw.replace(/>$/, '');
  //     const fieldAreas = fieldAreasText.split('^').filter(f => f.trim()).map(area => {
  //       const fieldsArray2 = area.split(',').map(part => {
  //         const [key, val] = part.split('=');
  //         return [key.trim(), isNaN(Number(val)) ? val : Number(val)];
  //       });
  //       const areaFields = fieldsArray2.reduce((acc, [key, val]) => {
  //         acc[key] = val;
  //         return acc;
  //       }, {} as any);

  //       // معالجة DATA بأنواعه المختلفة
  //       if (typeof areaFields.DATA === 'string') {
  //         if (areaFields.DATA.includes('|') && areaFields.DATA.includes('..')) {
  //           // حالة DATA=ch1..|ch2..>
  //           areaFields.DATA = areaFields.DATA
  //             .replace(/>/g, '')
  //             .split('|')
  //             .map(x => x.replace(/\.\./g, '').replace(/>$/, '').trim())
  //             .filter(x => x);
  //         } else if (areaFields.DATA.includes('|')) {
  //           // حالة DATA=1|2|3
  //           areaFields.DATA = areaFields.DATA
  //             .split('|')
  //             .map(x => x.replace(/>$/, '').trim())
  //             .filter(x => x);
  //         } else if (areaFields.DATA.includes('..')) {
  //           // حالة DATA=val1..val2..>
  //           areaFields.DATA = areaFields.DATA
  //             .replace(/>$/, '')
  //             .split('..')
  //             .map(x => x.replace(/>$/, '').trim())
  //             .filter(x => x);
  //         } else {
  //           // حالة مفردة أو غير معروفة
  //           areaFields.DATA = [areaFields.DATA.replace(/>$/, '').trim()];
  //         }
  //       } else {
  //         areaFields.DATA = [];
  //       }

  //       return areaFields;
  //     });

  //     result.push({
  //       PID: fields.PID,
  //       Name: fields.Name,
  //       Shape: fields.Shape,
  //       X: fields.X,
  //       Y: fields.Y,
  //       Width: fields.Width,
  //       Height: fields.Height,
  //       FieldAreas: fieldAreas
  //     });
  //   }

  //   return result;
  // }

  parseData(text) {
    const lines = this.splitMainPIDBlocks(text);
    const result = [];

    for (const line of lines) {
      const [main, fieldAreaRaw] = line.split('FieldAreas=<');

      const fieldsArray = main.split(',').map(part => {
        const [key, val] = part.split('=');
        return [key.trim(), isNaN(Number(val)) ? val : Number(val)];
      });
      const fields = fieldsArray.reduce((acc, [key, val]) => {
        acc[key] = val;
        return acc;
      }, {} as any);

      const fieldAreasText = fieldAreaRaw.replace(/>$/, '');
      const fieldAreas = fieldAreasText.split('^').filter(f => f.trim()).map(area => {
        const fieldsArray2 = area.split(',').map(part => {
          const [key, val] = part.split('=');
          return [key.trim(), isNaN(Number(val)) ? val : Number(val)];
        });
        const areaFields = fieldsArray2.reduce((acc, [key, val]) => {
          acc[key] = val;
          return acc;
        }, {} as any);

        if (areaFields.Name === 'Service Type') {
          // حالة Service Type القديمة
          const items = areaFields.DATA.split('|').filter(x => x).map(x => x.trim());
          const grouped = {};
          for (const item of items) {
            const [group, value] = item.split('.');
            if (!grouped[group]) grouped[group] = [];
            grouped[group].push(value);
          }
          areaFields.DATA = Object.entries(grouped).map(([key, values]) => ({
            Name: key,
            Data: values
          }));
        } else if (typeof areaFields.DATA === 'string' && areaFields.DATA.includes('|') && areaFields.DATA.includes('..')) {
          // حالة DATA=ch1..|ch2..
          areaFields.DATA = areaFields.DATA
            .replace(/>/g, '')
            .split('|')
            .map(x => x.replace(/\.\./g, '').trim())
            .filter(x => x); // إزالة الفراغات الفارغة إن وُجدت
        } else {
          // حالة أخرى: DATA غير معروفة أو ليست سلسلة
          areaFields.DATA = [];
        }

        return areaFields;
      });

      result.push({
        PID: fields.PID,
        Name: fields.Name,
        Shape: fields.Shape,
        X: fields.X,
        Y: fields.Y,
        Width: fields.Width,
        Height: fields.Height,
        FieldAreas: fieldAreas
      });
    }

    return result;
  }



  @ViewChild('popover') popover!: HTMLIonPopoverElement;

  isOpen = false;


  opemItemForm(e: Event, item) {
    if(this.tblResult.find(x=>x.data.includes(`(${item.Name})`))){

      let vals = this.tblResult.find(x=>x.data.includes(`(${item.Name})`)).data;
      this.convertStringToData(item.Name, vals );
    }
    console.log(item.FieldAreas);
    this.FormOpen = item;
    this.popover.event = e;
    this.isOpen = true;
  }

  @ViewChildren('itemDiv') itemDivs!: QueryList<ElementRef>;
  openExistItemForm(item) {
    const match = item.match(/\((.*?)\)/);
    const ItemName = match ? match[1] : null;
    // alert( ItemName)

    const index = this.tblVals.findIndex(element => {
      return element.Name.toString() === ItemName.toString();
    });

    // alert(index)
    this.convertStringToData(ItemName, item);
    // return;

    const thirdElement = this.itemDivs.toArray()[index];
    if (thirdElement) {
      thirdElement.nativeElement.click(); // تنفيذ click برمجياً
    }
  }

  convertStringToData(ItemName, item) {
    let element = this.tblVals.find(x => x.Name == ItemName);
    // alert(JSON.stringify(element));
    // console.log(item);
    let datastr = this.textService.cutString(item, `[`, true, null, false);
    // console.log(datastr);


    console.log(element);
    let tblVals = this.convertTextToArray(datastr);
    console.log(tblVals);
    for (let el of element.FieldAreas) {
      if (tblVals.filter(x => x.Name == el.Name).length > 0) {
        let tmp = tblVals.filter(x => x.Name == el.Name)[0];
        if (tmp.Val1) {
          el.Val1 = tmp.Val1;
        }
        if (tmp.Val2) {
          el.Val2 = tmp.Val2;
        }
      }
    }

    console.log(element);
  }

  convertTextToArray(text) {
    const items = text.split(" . ");
    const result = [];

    for (const item of items) {
      const parts = item.match(/^\[(.*?)\](.*?)$/);
      if (parts && parts.length === 3) {
        const name = parts[1];
        const valuesStr = parts[2];
        const entry: any = { Name: name };

        if (valuesStr.includes(',')) {
          const values = valuesStr.split(',').map(v => v.trim());
          entry.Val1 = values;
        } else {
          entry.Val1 = valuesStr.trim();
        }

        // if(!valuesStr.includes(`..`))

        if (!valuesStr.includes(`..`) && entry.Val1 instanceof Array && entry.Val1.length > 1) {
          entry.Val2 = entry.Val1[1];
          entry.Val1 = entry.Val1[0];
        }

        // alert(valuesStr);
        if (valuesStr.includes(`..`) && entry.Val1.length > 1) {
          // alert(entry.Val1);
          let tmp1 = entry.Val1.toString().replace(new RegExp((`..`).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
          entry.Val1 = tmp1.split(',');
        }

        // entry.Val1 = entry.Val1.toString().replace(new RegExp((`..`).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');

        // alert(entry.Val1);
        // this.textService.removeSubstring(entry.Val1, `..`);

        result.push(entry);
      }
    }

    return result;
  }

  // tblSubCombo = [];
  getCItem(item, val1) {
    if(item.DATA.find(x => x.Name == val1)){
      item.tblSubCombo =item.DATA.find(x => x.Name == val1).Data;
      return item.DATA.find(x => x.Name == val1);
    }else{
      return;
    }
    
  }
  getSub(ev, item) {
    console.log(`ev= `, ev.detail.value.Data);
    item[`Val1`] = ev.detail.value.Name;
    item.tblSubCombo = ev.detail.value.Data;
  }
  setCheckList(item, checkName) {
    if (item.Val1) {
      return item.Val1.includes(checkName);
    } else {
      return false;
    }
  }

  setSub(ev, item) {
    item[`Val2`] = ev.detail.value;
    console.log(item);
  }

  radioGroup(ev, item) {
    console.log(ev);
    item[`Val1`] = ev.detail.value;
  }

  checkboxGroup(ev, item) {
    console.log(ev);
    console.log(item.Val1);
    if (item.Val1) {
      if (item.Val1.filter(x => x == ev.detail.value).length == 0) {
        item.Val1.push(ev.detail.value);
      } else {
        item.Val1 = item.Val1.filter(x => x != ev.detail.value);
      }
    } else {
      item[`Val1`] = [ev.detail.value];
    }
    console.log(item.Val1);
  }

  ssw($event, item) {
    console.log(item);
  }


  saveForm() {
    console.log(this.FormOpen);
    this.Result = `(${this.FormOpen.Name}). `;
    for (let item of this.FormOpen.FieldAreas) {
      if (item.Val1) {
        if (this.Result.includes(`[`)) {
          this.Result += ` . `;
        }
        this.Result += `[${item.Name}]`;
        if (item.ControlType == 1) {
          this.Result += `${item.Val1},${item.Val2}`;
        } else if (item.ControlType == 2 || item.ControlType == 3 || item.ControlType == 4
          || item.ControlType == 5) {
          this.Result += `${item.Val1}`;
        } else if (item.ControlType == 6) {
          this.Result += `${item.Val1}..`;
        } else if (item.ControlType == 7) {
          this.Result += `${item.Val1}`;
        } else if (item.ControlType == 8) {
          for (let i = 0; i < item.Val1.length; i++) {
            if (i > 0) { this.Result += `,`; }
            this.Result += `${item.Val1[i]}..`;
          }
        } else {
          this.Result += `${item.Val1}.`;
        }
      }

    }
    console.log(this.Result);



    this.isOpen = false;

    let mName = this.textService.cutString(this.Result, `(`, false, `)`, false);
    let i = 0;
    for (let r of this.tblResult) {
      console.log(r);
      let rName = this.textService.cutString(r.data, `(`, false, `)`, false);
      if (mName == rName) {
        this.tblResult[i] = { data: this.Result };
        this.ResultSubmit.emit(this.tblResult);
        // this.isOpen = false;
        return;
      }
      i++;
    }


    this.tblResult.push({ data: this.Result });
    this.ResultSubmit.emit(this.tblResult);
  }

  checkData(item) {
    for (let r of this.tblResult) {
      // console.log(r);
      let rName = this.textService.cutString(r.data, `(`, false, `)`, false);
      if (item.Name == rName) {
        return true;
      }
    }
    return false;
  }

  removeResult(index) {
    this.tblResult.splice(index, 1);
    this.ResultSubmit.emit(this.tblResult);
  }
}
