import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-select-autocomplete-server',
  templateUrl: './select-autocomplete-server.component.html',
  styleUrls: ['./select-autocomplete-server.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectAutocompleteServerComponent),
      multi: true
    }
  ]
})
export class SelectAutocompleteServerComponent implements OnInit {
  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  data: any;

  // Function to call when the data changes.
  onChange: any = () => { };
  // Function to call when the component is touched.
  onTouched: any = () => { };

  

  writeValue(value: any): void {
    setTimeout(() => {
      if (value && value[this.prop]) {
        this.searchTerm = value[this.prop];
      }
    }, 250);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  // Call this method when the data changes inside the component
  updateData(newValue: any) {
    console.log(`updateData`);
    this.data = newValue;
    this.onChange(newValue);
    this.onTouched();
  }
  // ################ ngModel End ##################
  @ViewChild('myInput') myInput: ElementRef;
  @Output() clickOutside = new EventEmitter<void>();


  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    // const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      // this.dropdownOpen = false;
      this.closeDropdown();
    }


    // const clickedInside = this.elementRef.nativeElement.contains(target);
    // if (!clickedInside) {
    //   this.clickOutside.emit();
    // }
  }




  
  //---------------
  // @Input() InData: any;
  @Input() reverseLabel = false;

  @Input() placeholder = ``;

  prop = ``;
  @Input()
  set searchProp(item: any) {
    this.prop = item;
  }

  prop2 = ``;
  @Input()
  set searchProp2(item: any) {
    if (item) this.prop2 = item;
  }

  @Output() selectSubmit = new EventEmitter<any>();

  // textParam=`Name`;
  filteredOptions: any[] = [];
  options: any[] = [];
  // @Input()
  // set tblItems(items: any) {
  //   this.options = this.deepCopy(items);
  //   this.filteredOptions = this.options.slice(0, 10);
  // }

  txtInputLabel = ``;
  @Input()
  set InputLabel(label: any) {
    this.txtInputLabel = label;
  }

  IsAdd = false;
  @Input()
  set IsAddBtn(yes: any) {
    this.IsAdd = yes;
  }

  IsRequireSelection = false;
  @Input()
  set requireSelection(yes: any) {
    this.IsRequireSelection = yes;
  }

  IsClear = false;
  @Input()
  set EmptyAfterSelect(yes: any) {
    this.IsClear = yes;
  }

  OptionShow = false;

  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  dropdownOpen = false;
  selectedOption: any = null;
  constructor(private elementRef: ElementRef, public all: AllService) {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.performAction();
    });
  }

  ngOnInit() { }

  filterOptions() {
    this.searchSubject.next(this.searchTerm);
  }

  Loading = false;
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



  toggleDropdown(open: boolean) {
    console.log(`toggleDropdown`);
    this.dropdownOpen = open;
    if(open){
      this.performAction();
    }
  }

  closeDropdown() {
    // if (this.filteredOptions.length || this.filteredOptions.filter(x => x.NameA == this.searchTerm && x.NameE == this.searchTerm).length == 0) {
    //   this.searchTerm = ``;
    // }
    console.log(`closeDropdown`);

    this.myInput.nativeElement.blur();
    // التأخير لمنع إغلاق القائمة فورًا عند النقر على خيار
    setTimeout(() => (this.dropdownOpen = false), 100);
  }

  selectOption(option: any) {
    console.log(`selectOption`);
    this.highlightedIndex = this.filteredOptions.findIndex(item => item == option);

    this.selectedOption = option;
    this.searchTerm = option[this.prop];
    this.dropdownOpen = false;

    this.updateData(this.selectedOption)

    console.log(`selectOption= `, option);
    this.selectSubmit.emit(this.selectedOption);
  }

  highlightedIndex = -1;


  scrollIntoView() {
    const dropdownContent = this.dropdownContent.nativeElement;
    const highlightedElement = dropdownContent.querySelector('.highlighted2');
    if (highlightedElement) {
      highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  handleKeyDown(event: KeyboardEvent) {
    console.log(`handleKeyDown = `, this.highlightedIndex);
    // console.log(this.highlightedIndex);
    if (event.key === 'ArrowDown' && this.highlightedIndex < this.filteredOptions.length - 1) {
      this.highlightedIndex++;
      this.scrollIntoView();
    } else if (event.key === 'ArrowUp' && this.highlightedIndex > 0) {
      this.highlightedIndex--;
      this.scrollIntoView();
    } else if (event.key === 'Enter' && this.highlightedIndex >= 0) {
      this.selectOption(this.filteredOptions[this.highlightedIndex]);
    }
  }

  // deepCopy(obj: any) {
  //   var copy: any;

  //   // Handle the 3 simple types, and null or undefined
  //   if (null == obj || "object" != typeof obj) return obj;

  //   // Handle Date
  //   if (obj instanceof Date) {
  //     copy = new Date();
  //     copy.setTime(obj.getTime());
  //     return copy;
  //   }

  //   // Handle Array
  //   if (obj instanceof Array) {
  //     copy = [];
  //     for (var i = 0, len = obj.length; i < len; i++) {
  //       copy[i] = this.deepCopy(obj[i]);
  //     }
  //     return copy;
  //   }

  //   // Handle Object
  //   if (obj instanceof Object) {
  //     copy = {};
  //     for (var attr in obj) {
  //       if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
  //     }
  //     return copy;
  //   }

  //   throw new Error("Unable to copy obj! Its type isn't supported.");
  // }
}
