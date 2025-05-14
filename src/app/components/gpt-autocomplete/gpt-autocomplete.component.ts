import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, forwardRef, HostListener, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AllService } from 'src/app/services/all.service';

@Component({
  selector: 'app-gpt-autocomplete',
  templateUrl: './gpt-autocomplete.component.html',
  styleUrls: ['./gpt-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GptAutocompleteComponent),
      multi: true
    }
  ]
})
export class GptAutocompleteComponent implements OnInit {
  // https://chatgpt.com/canvas/shared/67b08904d0c88191955adb0796aaabed

  // Function to call when the data changes.
  onChange: any = () => { };
  // Function to call when the component is touched.
  onTouched: any = () => { };
  data: any;


  writeValue(value: any): void {
    // console.log(`writeValue= `, value);
    setTimeout(() => {
      if (value && value['Name' + this.all.LangLetter]) {
        this.searchTerm = value['Name' + this.all.LangLetter];
      }
    }, 250);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    console.log(`aaaaaaaaaaa`, fn);
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





  txtInputLabel = ``;
  @Input()
  set InputLabel(label: any) {
    this.txtInputLabel = label;
  }

  IsDisabled = false;
  @Input()
  set disabled(IsDisabled: any) {
    this.IsDisabled = IsDisabled;
  }

  searchTerm = '';
  filteredOptions: any[] = [];
  selectedIndex = -1;
  showDropdown = false;
  Loading = false;


  constructor(public all: AllService) { }

  ngOnInit() { }

  performAction() {
    if (this.searchTerm.trim() === '') {
      this.filteredOptions = [];
      return;
    }

    const body = new HttpParams()
      .set('Mtype', 'A17')
      .set('SearchName', this.searchTerm)
      .set('ResultLineCount', '20');

    this.Loading = true;
    this.all.postData(body, false).then(res => {
      this.Loading = false;
      let r = JSON.parse(`{"Data":${JSON.stringify(res)}}`);
      this.filteredOptions = r.Data;
      console.log(`this.filteredOptions= `, this.filteredOptions);

      this.showDropdown = this.filteredOptions.length > 0;
      this.selectedIndex = -1;
    });
  }

  @Output() selectSubmit = new EventEmitter<any>();

  selectOption(option: any) {
    console.log(option);
    this.searchTerm = option.FileNo + `   ` + option['Name' + this.all.LangLetter];
    this.filteredOptions = [];
    this.showDropdown = false;
    this.updateData(option);
    this.selectSubmit.emit(option);
  }

  handleKeydown(event: KeyboardEvent) {
    console.log(this.selectedIndex);

    const dropdown = document.querySelector('.autocomplete-list');
    const items = document.querySelectorAll('.autocomplete-list li');

    switch (event.key) {
      case 'ArrowDown':
        if (this.selectedIndex >= this.filteredOptions.length - 1) {
          return;
        }
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredOptions.length;
        break;
      case 'ArrowUp':
        if (this.selectedIndex <= 0) {
          return;
        }
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredOptions.length) % this.filteredOptions.length;
        break;
      case 'Enter':
        if (this.selectedIndex > -1) {
          this.selectOption(this.filteredOptions[this.selectedIndex]);
        }
        break;
      case 'Escape':
        this.showDropdown = false;
        return;
    }

    // تأكد من التمرير للعناصر المختارة
    if (dropdown && items.length > 0 && this.selectedIndex > -1) {
      const selectedElement = items[this.selectedIndex] as HTMLElement;
      selectedElement.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }


  // handleKeydown(event: KeyboardEvent) {
  //   console.log(this.selectedIndex);
  //   if(this.selectedIndex < -1){
  //     return;
  //   }
  //   const dropdown = document.querySelector('.autocomplete-list');
  //   const selectedItem = document.querySelector('.autocomplete-list .selected');

  //   switch (event.key) {
  //     case 'ArrowDown':
  //       this.selectedIndex = (this.selectedIndex + 1) % this.filteredOptions.length;
  //       break;
  //     case 'ArrowUp':
  //       this.selectedIndex = (this.selectedIndex - 1 + this.filteredOptions.length) % this.filteredOptions.length;
  //       break;
  //     case 'Enter':
  //       if (this.selectedIndex > -1) {
  //         this.selectOption(this.filteredOptions[this.selectedIndex]);
  //       }
  //       break;
  //     case 'Escape':
  //       this.showDropdown = false;
  //       break;
  //   }

  //   if (dropdown && selectedItem) {
  //     const dropdownElement = dropdown as HTMLElement;
  //     const selectedElement = selectedItem as HTMLElement;
  //     dropdownElement.scrollTop = selectedElement.offsetTop - dropdownElement.offsetTop;
  //   }
  // }

  @HostListener('document:click')
  hideDropdown() {
    this.showDropdown = false;
  }
}