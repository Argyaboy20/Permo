import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IlmutanahPageRoutingModule } from './ilmutanah-routing.module';

import { IlmutanahPage } from './ilmutanah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IlmutanahPageRoutingModule
  ],
  declarations: [IlmutanahPage]
})
export class IlmutanahPageModule {}
