import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IlmutanahPage } from './ilmutanah.page';

const routes: Routes = [
  {
    path: '',
    component: IlmutanahPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IlmutanahPageRoutingModule {}
