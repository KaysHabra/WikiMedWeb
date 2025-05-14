import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tmp1Page } from './tmp1.page';

describe('Tmp1Page', () => {
  let component: Tmp1Page;
  let fixture: ComponentFixture<Tmp1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Tmp1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
