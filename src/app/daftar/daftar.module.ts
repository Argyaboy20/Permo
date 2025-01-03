import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DaftarPageRoutingModule } from './daftar-routing.module';

import { DaftarPage } from './daftar.page';
import { ErrorMessageComponent } from '../components/error-message/error-message.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DaftarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    DaftarPage,
    ErrorMessageComponent
  ]
})
export class DaftarPageModule {}
