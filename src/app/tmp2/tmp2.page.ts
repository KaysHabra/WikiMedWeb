import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tmp2',
  templateUrl: './tmp2.page.html',
  styleUrls: ['./tmp2.page.scss'],
})
export class Tmp2Page implements OnInit {
  HtmlStr = ``; HtmlRes = ``;
  constructor() { }

  ngOnInit() {
  }

  // extractTranslations(htmlString) {
  //   const regex = /{{\s*'([^']+)'\s*\|\s*translate\s*}}/g;
  //   let matches;
  //   const translations = {};

  //   while ((matches = regex.exec(htmlString)) !== null) {
  //     const key = matches[1]; // النص بين {{ '...' | translate }}
  //     translations[key] = key; // القيم تساوي المفاتيح كما طلبت
  //   }

  //   return JSON.stringify(translations, null, 4);
  // }


  extractTranslations(htmlString) {
    const regex = /{{\s*["']([^"']+?)["']\s*\|\s*translate\s*}}/g;
    let matches;
    const translations = {};

    while ((matches = regex.exec(htmlString)) !== null) {
      const key = matches[1]; // النص بين {{ '...' | translate }} أو {{ "..." | translate }}
      translations[key] = key; // القيم تساوي المفاتيح كما طلبت
    }

    return JSON.stringify(translations, null, 4);
  }

}
