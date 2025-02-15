import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GantipasswordPageRoutingModule } from './gantipassword-routing.module';
import { GantipasswordPage } from './gantipassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GantipasswordPageRoutingModule
  ],
  declarations: [GantipasswordPage]
})
export class GantipasswordPageModule {}
