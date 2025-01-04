import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IlmutanahPage } from './ilmutanah.page';
import { IonicModule } from '@ionic/angular';

import { IlmutanahPageRoutingModule } from './ilmutanah-routing.module';
import { FilterPipe } from '../filter.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IlmutanahPageRoutingModule
  ],
  declarations: [IlmutanahPage, FilterPipe],
})
export class IlmutanahPageModule {}
