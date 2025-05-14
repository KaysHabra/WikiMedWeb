import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  {
    path: '',
    redirectTo: 'appointmen1',
    pathMatch: 'full'
  },
  // ################# Not Uses Yet ###################
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'temp1',
    loadChildren: () => import('./temp/temp1/temp1.module').then( m => m.Temp1PageModule)
  },
  {
    path: 'tmp1',
    loadChildren: () => import('./tmp1/tmp1.module').then( m => m.Tmp1PageModule)
  },
  {
    path: 'tmp2',
    loadChildren: () => import('./tmp2/tmp2.module').then( m => m.Tmp2PageModule)
  },
  {
    path: 'schedule-daily-note',
    loadChildren: () => import('./pages/schedule-daily-note/schedule-daily-note.module').then( m => m.ScheduleDailyNotePageModule)
  },
  // ################# End ###################
  {
    path: 'appointmen1',
    loadChildren: () => import('./ApptSystem/appointmen1/appointmen1.module').then( m => m.Appointmen1PageModule)
  },
  {
    path: 'appointmen2',
    loadChildren: () => import('./ApptSystem/appointmen2/appointmen2.module').then( m => m.Appointmen2PageModule)
  },
  {
    path: 'appointmen2/:iddoc/:idpatient',
    loadChildren: () => import('./ApptSystem/appointmen2/appointmen2.module').then( m => m.Appointmen2PageModule)
  },
  {
    path: 'patient-file',
    loadChildren: () => import('./ApptSystem/patient-file/patient-file.module').then( m => m.PatientFilePageModule)
  },
  {
    path: 'patient-file/:id',
    loadChildren: () => import('./ApptSystem/patient-file/patient-file.module').then( m => m.PatientFilePageModule)
  },
  {
    path: 'schedule-time',
    loadChildren: () => import('./ApptSystem/schedule-time/schedule-time.module').then( m => m.ScheduleTimePageModule)
  },
  {
    path: 'dr-system/main',
    loadChildren: () => import('./DrSystem/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'dr-system/patient-illness',
    loadChildren: () => import('./DrSystem/patient-illness/patient-illness.module').then( m => m.PatientIllnessPageModule)
  },
  {
    path: 'dr-system/patient-illness/:idpatient',
    loadChildren: () => import('./DrSystem/patient-illness/patient-illness.module').then( m => m.PatientIllnessPageModule)
  },
  
  
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
