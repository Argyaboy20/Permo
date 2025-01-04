import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },

  {
    path: 'tab',
    loadChildren: () => import('./tab/tab.module').then( m => m.TabPageModule)
  },

  {
    path: 'halamanutama',
    loadChildren: () => import('./halamanutama/halamanutama.module').then( m => m.HalamanutamaPageModule),
  },


  {
    path: 'tab2',
    loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule)
  },

  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },

  {
    path: 'daftar',
    loadChildren: () => import('./daftar/daftar.module').then( m => m.DaftarPageModule)
  },

  {
    path: 'lupaakun',
    loadChildren: () => import('./lupaakun/lupaakun.module').then( m => m.LupaakunPageModule)
  },

  {
    path: 'kamus',
    loadChildren: () => import('./kamus/kamus.module').then( m => m.KamusPageModule)
  },

  {
    path: 'ilmutanah',
    loadChildren: () => import('./ilmutanah/ilmutanah.module').then( m => m.IlmutanahPageModule)
  },

  {
    path: 'ilmutanah/:id',
    loadChildren: () => import('./ilmutanah/ilmutanah.module').then( m => m.IlmutanahPageModule)
  },

  {
    path: 'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },

  {
    path: 'detail/:id',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },

  {
    path: 'detailtanah',
    loadChildren: () => import('./detailtanah/detailtanah.module').then( m => m.DetailtanahPageModule)
  },

  {
    path: 'detailtanah/:id',
    loadChildren: () => import('./detailtanah/detailtanah.module').then( m => m.DetailtanahPageModule)
  },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
