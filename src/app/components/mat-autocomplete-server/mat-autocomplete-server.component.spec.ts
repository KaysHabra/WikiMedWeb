import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MatAutocompleteServerComponent } from './mat-autocomplete-server.component';

describe('MatAutocompleteServerComponent', () => {
  let component: MatAutocompleteServerComponent;
  let fixture: ComponentFixture<MatAutocompleteServerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatAutocompleteServerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MatAutocompleteServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
