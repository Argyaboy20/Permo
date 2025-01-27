import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GantipasswordPage } from './gantipassword.page';

describe('GantipasswordPage', () => {
  let component: GantipasswordPage;
  let fixture: ComponentFixture<GantipasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GantipasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
