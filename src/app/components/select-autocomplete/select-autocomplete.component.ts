import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { concat } from 'rxjs';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-select-autocomplete',
  templateUrl: './select-autocomplete.component.html',
  styleUrls: ['./select-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectAutocompleteComponent),
      multi: true
    }
  ]
})
export class SelectAutocompleteComponent implements OnInit {
  @Input() ResProp = null;
  @Input()
  set tblItems(items: any) {
    this.options = this.deepCopy(items);
    this.filteredOptions = this.options.slice(0, this.maxItems);
    // setTimeout(() => {
    //   if(this.InData){
    //     this.searchTerm = this.InData[this.prop];
    //   }
    // }, 250);

  }

  data: any;

  // Function to call when the data changes.
  onChange: any = () => { };
  // Function to call when the component is touched.
  onTouched: any = () => { };

  writeValue(value: any): void {
    // this.data = value;
    // console.log(`qqqqqqqqq`, value);
    setTimeout(() => {
      if (this.ResProp == null) {
        if (value && value[this.prop]) {
          this.searchTerm = value[this.prop];
        }
      } else {
        // console.log(`qqqqqqqqq`, value);
        // console.log(`qqqqqqqqq`, this.options.filter(x => x[this.ResProp] == value));
        if (value != null && this.options.filter(x => x[this.ResProp] == value).length > 0) {
          this.searchTerm = this.options.filter(x => x[this.ResProp] == value)[0][this.prop];
          // alert(this.searchTerm);
        }
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
    let Res = newValue;
    if (this.ResProp != null) {
      Res = newValue[this.ResProp];
    }
    console.log(`Res= `, Res);
    this.data = Res;
    this.onChange(Res);
    this.onTouched();
  }
  // ################ ngModel End ##################


  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  @Output() clickOutside = new EventEmitter<void>();


  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    // const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      // this.dropdownOpen = false;
      this.closeDropdown();
    }
  }

  // @Output() clickOutside = new EventEmitter<void>();
  // @HostListener('document:click', ['$event.target'])
  // public onClick(target: any) {
  //   const clickedInside = this.elementRef.nativeElement.contains(target);
  //   if (!clickedInside) {
  //     this.clickOutside.emit();
  //   }
  // }


  //---------------
  // @Input() InData: any;
  @Input() reverseLabel = false;
  @Input() maxItems = 10;


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

  @Input() prop1ColSize = ``;
  @Input() prop2ColSize = ``;
  // @Input() soundE = ``;

  // prop3 = ``;
  // @Input()
  // set searchProp3(item: any) {
  //   if (item) this.prop3 = item;
  // }

  @Output() childSubmit = new EventEmitter<any>();
  @Output() onFocus = new EventEmitter<any>();
  // @Output() counterNumberChange: EventEmitter<any> = new EventEmitter<any>();

  // @ViewChild('popover') popover: any;
  // // @ViewChild('input') input: any;
  // @ViewChild('input') input: ElementRef<HTMLInputElement>;
  // tbl = [];
  // tblSearch = this.deepCopy(this.tbl);

  // textParam=`Name`;
  filteredOptions: any[] = [];
  options: any[] = [];


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
  constructor(private elementRef: ElementRef, public all: AllService) { }

  ngOnInit() { }



  // options = [
  //   { id: 1, name: 'Apple' },
  //   { id: 2, name: 'Banana' },
  //   { id: 3, name: 'Cherry' },
  //   { id: 4, name: 'Date' },
  //   { id: 5, name: 'Fig' }
  // ];
  // filteredOptions = [...this.options];
  searchTerm = '';
  dropdownOpen = false;
  selectedOption: any = null;

  // filterOptions() {
  //   this.filteredOptions = this.options.filter((option) =>
  //     option.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }

  toggleDropdown(open: boolean) {
    console.log(`toggleDropdown`);
    this.dropdownOpen = open;
    // this.onFocus.emit(open);
  }

  closeDropdown() {
    // console.log(`closeDropdown`);
    // التأخير لمنع إغلاق القائمة فورًا عند النقر على خيار
    setTimeout(() => (this.dropdownOpen = false), 200);
  }

  selectOption(option: any) {
    console.log(`selectOption`);
    this.highlightedIndex = this.filteredOptions.findIndex(item => item == option);

    this.selectedOption = option;
    this.searchTerm = option[this.prop];
    this.dropdownOpen = false;

    this.updateData(this.selectedOption)

    this.childSubmit.emit(this.selectedOption);
  }

  highlightedIndex = -1;

  filterOptions() {
    console.log(`filterOptions `, this.options,);

    // if(this.prop && this.prop2){
    //   this.filteredOptions = this.options.filter((option) =>
    //     (option[this.prop]).toString().toLowerCase().includes(this.searchTerm.toLowerCase())
    //     || (option[this.prop2]).toString().toLowerCase().includes(this.searchTerm.toLowerCase())
    //   ).slice(0, this.maxItems);
    // }else{
    //   this.filteredOptions = this.options.filter((option) =>
    //     (option[this.prop]).toString().toLowerCase().includes(this.searchTerm.toLowerCase())
    //   ).slice(0, this.maxItems);
    // }

    if (this.prop && this.prop2) {
      const input = this.searchTerm?.toLowerCase() || '';
      const inputSoundex = this.soundex(this.searchTerm);

      this.filteredOptions = this.options.filter((option) => {
        const propVal1 = (option[this.prop]?.toString() || '');
        const propVal2 = (option[this.prop2]?.toString() || '');

        const val1Lower = propVal1.toLowerCase();
        const val2Lower = propVal2.toLowerCase();

        // تطابق نصي مباشر
        if (val1Lower.includes(input) || val2Lower.includes(input)) {
          return true;
        }

        // تطابق صوتي
        for (const word of propVal1.split(' ')) {
          if (this.soundex(word) === inputSoundex) return true;
        }
        for (const word of propVal2.split(' ')) {
          if (this.soundex(word) === inputSoundex) return true;
        }

        return false;
      }).slice(0, this.maxItems);


    } else {
      this.filteredOptions = this.options.filter((option) => {
        const optionWords = option[this.prop]?.toString().split(/\s+/) || [];
        const inputSoundex = this.soundex(this.searchTerm);

        return optionWords.some(word => this.soundex(word) === inputSoundex)
        || (option[this.prop]).toString().toLowerCase().includes(this.searchTerm.toLowerCase());
      }).slice(0, this.maxItems);

    }
    console.log(this.filteredOptions);

    this.highlightedIndex = -1; // إعادة ضبط المؤشر
  }

  handleKeyDown(event: KeyboardEvent) {
    console.log(`handleKeyDown = `, this.highlightedIndex);
    // console.log(this.highlightedIndex);
    if (event.key === 'ArrowDown' && this.highlightedIndex < this.filteredOptions.length - 1) {
      this.highlightedIndex++;
    } else if (event.key === 'ArrowUp' && this.highlightedIndex > 0) {
      this.highlightedIndex--;
    } else if (event.key === 'Enter' && this.highlightedIndex >= 0) {
      this.selectOption(this.filteredOptions[this.highlightedIndex]);
    }
  }

  deepCopy(obj: any) {
    var copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.deepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  soundex(word: string): string {
    if (!word) return '';
    word = word.toUpperCase().replace(/[^A-Z]/g, '');
    if (!word) return '';

    const codes: any = {
      A: '', E: '', I: '', O: '', U: '', H: '', W: '', Y: '',
      B: '1', F: '1', P: '1', V: '1',
      C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
      D: '3', T: '3',
      L: '4',
      M: '5', N: '5',
      R: '6'
    };

    const firstLetter = word[0];
    let result = firstLetter;

    let prevCode = codes[firstLetter];
    for (let i = 1; i < word.length; i++) {
      const code = codes[word[i]];
      if (code && code !== prevCode) {
        result += code;
      }
      prevCode = code;
      if (result.length === 4) break;
    }

    return (result + '0000').slice(0, 4);
  }

  searchBySoundex(userInput: string): any[] {
    const inputSoundex = this.soundex(userInput);
    return this.options.filter(item => {
      const words = item.NameE.split(/\s+/);
      return words.some(word => this.soundex(word) === inputSoundex);
    });
  }
}
