import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { NewAppComponent } from './new-app/new-app.component';
import { SelectAutocompleteComponent } from './select-autocomplete/select-autocomplete.component';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { TreeViewSelectionComponent } from './tree-view-selection/tree-view-selection.component';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { PatientAddEditComponent } from './patient-add-edit/patient-add-edit.component';
import { PatientAppointmentsComponent } from './patient-appointments/patient-appointments.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerComponent } from './mat-datepicker/mat-datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ScheduleTimeComponent } from './schedule-time/schedule-time.component';
import { MatDatepicker2Component } from './mat-datepicker2/mat-datepicker2.component';
import { KaysDatepickerComponent } from './kays-datepicker/kays-datepicker.component';
import { DoctorShiftComponent } from './doctor-shift/doctor-shift.component';
import { NextAvailableComponent } from './next-available/next-available.component';

import { MatIconModule } from '@angular/material/icon';
import { MatTreeViewComponent } from './mat-tree-view/mat-tree-view.component';
import { SelectAutocompleteServerComponent } from './select-autocomplete-server/select-autocomplete-server.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { MatAutocompleteServerComponent } from './mat-autocomplete-server/mat-autocomplete-server.component';
import { GptAutocompleteComponent } from './gpt-autocomplete/gpt-autocomplete.component';
import { TimeInputMaskDirective } from '../directives/time-input-mask.directive';
import { TimeInputComponent } from './time-input/time-input.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { W3AutocompleteComponent } from './w3-autocomplete/w3-autocomplete.component';
import { PatientSelectAutoComponent } from './patient-select-auto/patient-select-auto.component';
import { GridComponent } from './grid/grid.component';
import { DynamicGridComponent } from './dynamic-grid/dynamic-grid.component';
import { GridDoctorComponent } from './grid-doctor/grid-doctor.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MedFormComponent } from '../componentsForm/med-form/med-form.component';
import { MedFormTextComponent } from '../componentsForm/med-form-text/med-form-text.component';
import { MedFormDateComponent } from '../componentsForm/med-form-date/med-form-date.component';
import { MedFormCalcComponent } from '../componentsForm/med-form-calc/med-form-calc.component';
import { MedFormCheckComponent } from '../componentsForm/med-form-check/med-form-check.component';
import { MedFormCheckListComponent } from '../componentsForm/med-form-check-list/med-form-check-list.component';
import { MedFormRadioListComponent } from '../componentsForm/med-form-radio-list/med-form-radio-list.component';
import { MedFormComboComponent } from '../componentsForm/med-form-combo/med-form-combo.component';
import { MedFormDocComponent } from '../componentsForm/med-form-doc/med-form-doc.component';
import { NgxEditorModule } from 'ngx-editor';
import { MedFormIcd10Component } from '../componentsForm/med-form-icd10/med-form-icd10.component';
import { MedFormImageComponent } from '../componentsForm/med-form-image/med-form-image.component';
import { MedFormPanelComponent } from '../componentsForm/med-form-panel/med-form-panel.component';
import { MedFormArchivesComponent } from '../componentsForm/med-form-archives/med-form-archives.component';

@NgModule({
  declarations: [NewAppComponent, SelectAutocompleteComponent, TreeViewComponent, TreeViewSelectionComponent,
    TimePickerComponent, PatientAddEditComponent, PatientAppointmentsComponent,
    MatDatepickerComponent, MatDatepicker2Component, ScheduleTimeComponent, KaysDatepickerComponent,
    DoctorShiftComponent, NextAvailableComponent, MatTreeViewComponent, SelectAutocompleteServerComponent,
    DatePickerComponent, GptAutocompleteComponent, TimeInputMaskDirective, TimeInputComponent,
    W3AutocompleteComponent, PatientSelectAutoComponent,
    GridComponent, DynamicGridComponent, GridDoctorComponent,

    MedFormComponent, MedFormTextComponent, MedFormDateComponent, MedFormCalcComponent,
    MedFormCheckComponent, MedFormCheckListComponent, MedFormRadioListComponent, MedFormComboComponent,
    MedFormDocComponent, MedFormIcd10Component, MedFormImageComponent, MedFormPanelComponent, 
    MedFormArchivesComponent,
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    // BrowserModule,
    FormsModule,
    MatTreeModule,
    MatButtonModule,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,

    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatTooltipModule,
    NgxEditorModule,
  ],
  exports: [NewAppComponent, SelectAutocompleteComponent, TreeViewComponent, TreeViewSelectionComponent,
    TimePickerComponent, PatientAddEditComponent, PatientAppointmentsComponent,
    MatDatepickerComponent, MatDatepicker2Component, ScheduleTimeComponent, KaysDatepickerComponent,
    DoctorShiftComponent, NextAvailableComponent, MatTreeViewComponent, SelectAutocompleteServerComponent,
    DatePickerComponent, GptAutocompleteComponent, TimeInputMaskDirective, TimeInputComponent,
    W3AutocompleteComponent, PatientSelectAutoComponent,
    GridComponent, DynamicGridComponent, GridDoctorComponent,

    MedFormComponent, MedFormTextComponent, MedFormDateComponent, MedFormCalcComponent,
    MedFormCheckComponent, MedFormCheckListComponent, MedFormRadioListComponent, MedFormComboComponent,
    MedFormDocComponent, MedFormIcd10Component, MedFormImageComponent, MedFormPanelComponent, 
    MedFormArchivesComponent,
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class SharedComponentsModule { }
