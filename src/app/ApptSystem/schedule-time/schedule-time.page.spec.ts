import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleTimePage } from './schedule-time.page';

describe('ScheduleTimePage', () => {
  let component: ScheduleTimePage;
  let fixture: ComponentFixture<ScheduleTimePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
