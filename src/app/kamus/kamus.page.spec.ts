import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KamusPage } from './kamus.page';

describe('KamusPage', () => {
  let component: KamusPage;
  let fixture: ComponentFixture<KamusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KamusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
