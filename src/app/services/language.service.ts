import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AllService } from './all.service';
import { Router } from '@angular/router';

const LNG_KEY = 'ZATCA_SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
  // menuSide ='';
  constructor(private translate: TranslateService,
    private storage: Storage, private plt: Platform,
    private all: AllService, private router: Router) { 
      this.storage.create();
      this.setInitialAppLanguage();
    }
  setInitialAppLanguage() {
    return new Promise(resolve => {
      this.storage.get(LNG_KEY).then(val => {
        if (val) {
          this.selected = val; this.all.SelectedLang = this.selected;
          // alert(val);
          this.setLanguage(val).then(() => {
            resolve(val);
          });

        } else {
          let language = "ar"
          this.selected = "ar"; this.all.SelectedLang = this.selected;
          this.all.LangLetter = 'A';
          document.documentElement.dir = "rtl";
          document.documentElement.lang = "ar";


          // let language = this.translate.getBrowserLang();
          // this.selected = language;
          // if (language == 'ar') {
          //   this.all.LangLetter = 'A';
          //   document.documentElement.dir = "rtl";
          //   document.documentElement.lang = "ar";
          // } else if (language == 'tr') {
          //   this.all.LangLetter = 'T';
          //   document.documentElement.dir = "ltr";
          //   document.documentElement.lang = "tr";
          // } else {
          //   this.all.LangLetter = 'E';
          //   document.documentElement.dir = "ltr";
          //   document.documentElement.lang = "en";
          // }

          // alert(this.selected);
          this.setLanguage(this.selected).then(() => {
            // this.translate.get("programming").subscribe((result) => {
            //   this.all.LngMsg = result;
            // });
            resolve(language);
          });

        }

      });

    });
  }

  setLanguage(lng, reload = false) {

    return new Promise(resolve => {
      // alert(document.documentElement.lang + '   -   ' +lng );
      // if (document.documentElement.lang != lng) {
      //   reload = true;
      // }
      if (lng == 'ar') {
        // this.menuSide='start';
        //this.all.settings.currency = 'ريال';
        this.all.LangLetter = 'A';
        // this.all.dir = 'rtl';
        document.documentElement.dir = "rtl";
        document.documentElement.lang = "ar"
        document.dir = "rtl";
      } else if (lng == 'tr') {
        this.all.LangLetter = 'E';
        // this.all.dir = 'ltr';
        document.documentElement.dir = "ltr";
        document.documentElement.lang = "tr"
        document.dir = "ltr";
      } else {
        //this.all.settings.currency = 'SAR';
        this.all.LangLetter = 'E';
        // this.all.dir = 'ltr';
        document.documentElement.dir = "ltr";
        document.documentElement.lang = "en"
        document.dir = "ltr";
        // alert(`ltr`);
      }
      this.translate.setDefaultLang(lng);
      this.selected = lng; this.all.SelectedLang = this.selected;
      this.storage.set(LNG_KEY, lng).then(() => {
        // alert(lng);
        // this.translate.get("programming").subscribe((result) => {
        // this.all.LngMsg = result;
        console.log(reload == true, this.all.IsFirstLoaded);
        if ((reload == true && this.all.IsFirstLoaded )|| this.router.url.includes(`appointmen2`)) {
          location.reload();
        }
        resolve(true);
      });

      // });
    });
  }
  getLanguages() {
    // alert(3);
    return [
      { text: `English`, value: 'en', img: '' },
      // { text: `German`, value: 'de', img: '' },
      // { text: `Turkce`, value: 'tr', img: '' },
      { text: `Arabic`, value: 'ar', img: '' },
    ]
  }
  // setInitialAppLanguage() {
  //   return new Promise(resolve => {
  //     let language = this.translate.getBrowserLang();
  //     if (language == 'ar') {
  //       document.documentElement.dir = "rtl";
  //     } else {
  //       document.documentElement.dir = "ltr";
  //     }
  //     this.translate.setDefaultLang(language);
  //     this.translate.get("programming").subscribe((result) => {
  //       this.all.LngMsg = result;
  //     });

  //     this.storage.get(LNG_KEY).then(val => {
  //       if (val) {
  //         this.setLanguage(val);
  //         this.selected = val;
  //       }
  //       resolve(true);
  //     });
  //   });
  // }

  // setLanguage(lng) {
  //   return new Promise(resolve => {
  //     if (lng == 'ar') {
  //       document.documentElement.dir = "rtl";
  //     } else {
  //       document.documentElement.dir = "ltr";
  //     }
  //     this.translate.use(lng).subscribe(()=>{
  //       resolve(true);
  //     });
  //     this.selected = lng;
  //     this.storage.set(LNG_KEY, lng).then(()=>{

  //     });
  //     this.translate.get("programming").subscribe((result) => {
  //       this.all.LngMsg = result;
  //     });
  //   });
  // }
  // getLanguages() {
  //   alert(3);
  //   return [
  //     { text: `English`, value: 'en', img: '' },
  //     { text: `German`, value: 'de', img: '' },
  //     { text: `Turkce`, value: 'tr', img: '' },
  //     { text: `Arabic`, value: 'ar', img: '' },
  //   ]
  // }
}
