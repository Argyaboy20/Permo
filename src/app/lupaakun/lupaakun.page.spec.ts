import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LupaakunPage } from './lupaakun.page';

describe('LupaakunPage', () => {
  let component: LupaakunPage;
  let fixture: ComponentFixture<LupaakunPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LupaakunPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
