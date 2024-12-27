import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KamusPage } from './kamus.page';

const routes: Routes = [
  {
    path: '',
    component: KamusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KamusPageRoutingModule {}
