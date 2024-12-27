import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HalamanutamaPage } from './halamanutama.page';

const routes: Routes = [
  {
    path: '',
    component: HalamanutamaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HalamanutamaPageRoutingModule {}
