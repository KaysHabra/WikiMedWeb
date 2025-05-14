import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleDailyNotePage } from './schedule-daily-note.page';

describe('ScheduleDailyNotePage', () => {
  let component: ScheduleDailyNotePage;
  let fixture: ComponentFixture<ScheduleDailyNotePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDailyNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
