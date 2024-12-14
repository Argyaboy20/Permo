import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LupaakunPage } from './lupaakun.page';

const routes: Routes = [
  {
    path: '',
    component: LupaakunPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LupaakunPageRoutingModule {}
