import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GantipasswordPage } from './gantipassword.page';

const routes: Routes = [
  {
    path: '',
    component: GantipasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GantipasswordPageRoutingModule {}
