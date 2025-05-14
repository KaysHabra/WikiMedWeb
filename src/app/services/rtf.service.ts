import { Injectable } from '@angular/core';
import { EMFJS, RTFJS, WMFJS } from 'rtf.js';
// import { RTFJS } from 'rtf.js';
// import RTFJS from 'rtf.js';

@Injectable({
  providedIn: 'root'
})
export class RtfService {

  constructor() { }

  async convertRtfToHtml(rtfText: string): Promise<string> {
    // تحويل النص إلى ArrayBuffer
    const arrayBuffer = this.stringToArrayBuffer(rtfText);

    // إنشاء كائن Document مع إعدادات اختيارية
    const doc = new RTFJS.Document(arrayBuffer, {
      // الإعدادات الاختيارية هنا
    });

    // تحويل RTF إلى HTML
    const htmlElements = await doc.render();
    return htmlElements.map(element => element.outerHTML).join('');
  }

  stringToArrayBuffer(str: string): ArrayBuffer {
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i);
    }
    return buffer;
  }


  // convert() {

  //   const rtf =
  //     `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
  //   {\\*\\generator Msftedit 5.41.21.2510;}\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\lang9\\f0\\fs22 This \\fs44 is \\fs22 a \\b simple \\ul one \\i paragraph \\ulnone\\b0 document\\i0 .\\par
  //   }`;

  //   // RTFJS.loggingEnabled(false);
  //   // WMFJS.loggingEnabled(false);
  //   // EMFJS.loggingEnabled(false);

  //   let settings: RTFJS.ISettings = {};
  //   const doc = new RTFJS.Document(this.stringToArrayBuffer(rtf), settings);
  //   // await doc.parse(rtf);
  //   // return doc.contentHTML;

  //   const meta = doc.metadata();
  //   doc.render().then( (htmlElements)=> {
  //     console.log("Meta:");
  //     console.log(meta);
  //     console.log("Html:");
  //     console.log(htmlElements);
  //     return htmlElements;
  //   }).catch(error =>{ console.error(error); return "";})
  // }

  // stringToArrayBuffer(string) {
  //   const buffer = new ArrayBuffer(string.length);
  //   const bufferView = new Uint8Array(buffer);
  //   for (let i = 0; i < string.length; i++) {
  //     bufferView[i] = string.charCodeAt(i);
  //   }
  //   return buffer;
  // }
}
