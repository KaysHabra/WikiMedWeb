import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Appointmen2Page } from './appointmen2.page';

describe('Appointmen2Page', () => {
  let component: Appointmen2Page;
  let fixture: ComponentFixture<Appointmen2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Appointmen2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
