import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DaftarPage } from './daftar.page';
import { RegisterPageForm } from './form/register.page.form';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DaftarPageModule } from './daftar.module';

describe('DaftarPage', () => {
  let component: DaftarPage;
  let fixture: ComponentFixture<DaftarPage>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DaftarPage],
      imports: [
        IonicModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule,
        DaftarPageModule
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(DaftarPage);
    router = TestBed.get(Router);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should create register form on page init', () => {
    fixture.detectChanges();

    expect(component.registerForm).not.toBeUndefined
  })


});
