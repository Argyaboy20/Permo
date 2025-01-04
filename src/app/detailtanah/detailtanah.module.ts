import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailtanahPageRoutingModule } from './detailtanah-routing.module';

import { DetailtanahPage } from './detailtanah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailtanahPageRoutingModule
  ],
  declarations: [DetailtanahPage]
})
export class DetailtanahPageModule {}
