import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tmp2Page } from './tmp2.page';

describe('Tmp2Page', () => {
  let component: Tmp2Page;
  let fixture: ComponentFixture<Tmp2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Tmp2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
