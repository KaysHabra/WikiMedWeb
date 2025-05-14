import { Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-w3-autocomplete',
  templateUrl: './w3-autocomplete.component.html',
  styleUrls: ['./w3-autocomplete.component.scss'],
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => W3AutocompleteComponent),
        multi: true
      }
    ]
})
export class W3AutocompleteComponent  implements OnInit {
  data: any;

  // Function to call when the data changes.
  onChange: any = () => { };
  // Function to call when the component is touched.
  onTouched: any = () => { };

  writeValue(value: any): void {
    this.searchTerm = value;
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
    console.log(`Res= `, Res);
    this.data = newValue;
    this.onChange(newValue);
    this.onTouched();
  }
  // ################ ngModel End ##################

  searchTerm=``;


  @Input() items: string[] = [];
  @Input() placeholder: string = 'Type here...';
  @Input() width: number = 0;
  @ViewChild('inputField') inputField!: ElementRef;

  // query: string = '';
  filteredItems: string[] = [];
  currentFocus: number = -1;

  constructor() { }

  ngOnInit() {}


  ngAfterViewInit() {
    this.inputField.nativeElement.addEventListener('click', () => this.filteredItems = this.items);
  }

  onInput() {
    // this.query = this.inputField.nativeElement.value;
    // this.filteredItems = this.items.filter(item => item.toString().toLowerCase().includes(this.query.toLowerCase()));
    this.openList();
    this.updateData(this.searchTerm);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.currentFocus = (this.currentFocus + 1) % this.filteredItems.length;
    } else if (event.key === 'ArrowUp') {
      this.currentFocus = (this.currentFocus - 1 + this.filteredItems.length) % this.filteredItems.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.currentFocus > -1) {
        this.selectItem(this.filteredItems[this.currentFocus]);
      }
    }
    
  }

  selectItem(value: string) {
    // this.query = value;
    this.inputField.nativeElement.value = value;
    this.filteredItems = [];
    this.updateData(value);
  }

  openList() {
    // console.log(this.searchTerm);
    this.filteredItems = (this.items.filter(item => item.toString().toLowerCase().includes(this.searchTerm.toLowerCase()))).slice(0, 10);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.inputField.nativeElement.contains(event.target)) {
      this.filteredItems = [];
    }
  }
}
