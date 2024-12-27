import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IlmutanahPage } from './ilmutanah.page';

describe('IlmutanahPage', () => {
  let component: IlmutanahPage;
  let fixture: ComponentFixture<IlmutanahPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IlmutanahPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
