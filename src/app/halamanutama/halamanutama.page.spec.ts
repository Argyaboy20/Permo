import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HalamanutamaPage } from './halamanutama.page';

describe('HalamanutamaPage', () => {
  let component: HalamanutamaPage;
  let fixture: ComponentFixture<HalamanutamaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HalamanutamaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
