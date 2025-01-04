import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailtanahPage } from './detailtanah.page';

const routes: Routes = [
  {
    path: '',
    component: DetailtanahPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailtanahPageRoutingModule {}
