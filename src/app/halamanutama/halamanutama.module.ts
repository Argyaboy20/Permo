import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HalamanutamaPageRoutingModule } from './halamanutama-routing.module';

import { HalamanutamaPage } from './halamanutama.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HalamanutamaPageRoutingModule
  ],
  declarations: [HalamanutamaPage]
})
export class HalamanutamaPageModule {}
