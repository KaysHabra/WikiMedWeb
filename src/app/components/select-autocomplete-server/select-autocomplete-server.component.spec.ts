import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectAutocompleteServerComponent } from './select-autocomplete-server.component';

describe('SelectAutocompleteServerComponent', () => {
  let component: SelectAutocompleteServerComponent;
  let fixture: ComponentFixture<SelectAutocompleteServerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAutocompleteServerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectAutocompleteServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
