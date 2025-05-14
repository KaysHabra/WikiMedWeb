import { Component } from '@angular/core';
import { AllService } from './services/all.service';
import { LanguageService } from './services/language.service';
import { ApptService } from './services/appt.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Schedules', url: '/appointmen1', icon: 'mail' },
    { title: 'Patients File', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Patients Appointments', url: '/folder/favorites', icon: 'calendar' },

  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work'];
  constructor(public all: AllService, private languageService: LanguageService, 
    private appt:ApptService, private nav:NavController) { }

  showSubWindow(no) {
    this.appt.getSubWindow(no);
  }

  setLang(ev) {
    this.all.SelectedLang = ev.detail.value;
    this.languageService.setLanguage(this.all.SelectedLang);
  }
}
