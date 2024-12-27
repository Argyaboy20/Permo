import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KamusPageRoutingModule } from './kamus-routing.module';

import { KamusPage } from './kamus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KamusPageRoutingModule
  ],
  declarations: [KamusPage]
})
export class KamusPageModule {}
