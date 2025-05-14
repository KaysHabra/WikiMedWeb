import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientIllnessPage } from './patient-illness.page';

describe('PatientIllnessPage', () => {
  let component: PatientIllnessPage;
  let fixture: ComponentFixture<PatientIllnessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientIllnessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
