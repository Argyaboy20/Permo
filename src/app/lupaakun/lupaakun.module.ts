import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LupaakunPageRoutingModule } from './lupaakun-routing.module';

import { LupaakunPage } from './lupaakun.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LupaakunPageRoutingModule
  ],
  declarations: [LupaakunPage]
})
export class LupaakunPageModule {}
