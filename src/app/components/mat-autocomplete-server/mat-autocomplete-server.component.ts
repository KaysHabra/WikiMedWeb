import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-mat-autocomplete-server',
  templateUrl: './mat-autocomplete-server.component.html',
  styleUrls: ['./mat-autocomplete-server.component.scss'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  standalone: true,
})
export class MatAutocompleteServerComponent implements OnInit {

  private searchSubject = new Subject<string>();
  constructor(public all: AllService) {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.performAction();
    });
  }

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  filterOptions() {
    this.searchSubject.next(this.searchTerm);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  Loading = false;
  searchTerm = ``;
  performAction() {
    console.log('Performing action with search term:', this.searchTerm);
    // يمكنك هنا تنفيذ أي عمل تريده، مثل البحث أو إرسال طلب إلى الخادم
    this.Loading = true;
    const body = new HttpParams()
      .set('Mtype', 'A17')
      .set('SearchName', this.searchTerm)
      .set('ResultLineCount', 20);

    this.all.postData(body, false).then(res => {
      this.Loading = false;
      let r = JSON.parse(`{"Data":${JSON.stringify(res)}}`);
      this.filteredOptions = r.Data;
      console.log(`this.filteredOptions= `, this.filteredOptions);
      // let result = res;
      // this.filteredOptions = result;
    });
  }
}
