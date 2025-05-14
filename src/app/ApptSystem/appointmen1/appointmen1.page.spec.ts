import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Appointmen1Page } from './appointmen1.page';

describe('Appointmen1Page', () => {
  let component: Appointmen1Page;
  let fixture: ComponentFixture<Appointmen1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Appointmen1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
