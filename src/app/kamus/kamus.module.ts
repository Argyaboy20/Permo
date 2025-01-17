import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KamusPage } from './kamus.page';
import { IonicModule } from '@ionic/angular';

import { KamusPageRoutingModule } from './kamus-routing.module';
import { FilterPipe } from '../filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KamusPageRoutingModule,
    FilterPipe
  ],
  declarations: [KamusPage]
})
export class KamusPageModule {}
