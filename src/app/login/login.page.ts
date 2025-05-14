import { Component, OnInit } from '@angular/core';
import { AllService } from '../services/all.service';
import { MenuController, NavController } from '@ionic/angular';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  Login = {
    Email: ``,
    Password: ``,
    Name: ``,
    Phone: ``,
  };
  Page = `SignIn`; ShowPass = false;

  constructor(public all: AllService, private nav: NavController, private menuCtrl: MenuController,
    public languageService: LanguageService,) { }

  ngOnInit() {
  }

  setLang(ev) {
    this.all.SelectedLang = ev.detail.value;
    this.languageService.setLanguage(this.all.SelectedLang);
  }
  
  sginIn() {
    let postData = new FormData();
    postData.append("Data", JSON.stringify(this.Login));
    // this.all.postData(postData, `login.aspx`, `2`).then((Response: any) => {
    //   console.log(Response);

    //   this.all.storage.set(this.all.USER_DATA, this.all.User);
    //   this.nav.navigateRoot(`home`);
    // });
  }
  forgetPass(){}
  sginUp() {
    // console.log(this.IsCaptcha);
    // if (!this.IsCaptcha) { return; }
    // if (this.Login.Name == ``) {
    //   this.all.toast(`Enter your name`);
    //   return false;
    // }
    // if (!this.all.isEmail(this.Login.Email)) {
    //   this.all.toast(`Enter your email correctly`);
    //   return false;
    // }
    // if (!this.all.isPhonenumber(this.Login.Phone)) {
    //   this.all.toast('Enter your phone number', ``, `warning`);
    //   return;
    // }
    // if (this.Login.Password == null || this.Login.Password == ``) {
    //   this.all.toast(`Enter a password to be your account password`, ``, `warning`);
    //   return;
    // }
  }
}
