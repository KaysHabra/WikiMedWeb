import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientFilePage } from './patient-file.page';

describe('PatientFilePage', () => {
  let component: PatientFilePage;
  let fixture: ComponentFixture<PatientFilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
