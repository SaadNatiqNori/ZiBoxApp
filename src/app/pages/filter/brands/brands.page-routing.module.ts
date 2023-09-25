import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuBrandsPage } from './brands.page';

const routes: Routes = [
  {
    path: '',
    component: MenuBrandsPage,
  },
  {
    path: ':id',
    loadChildren: () => import('./brand-details/brand-details.module').then( m => m.BrandDetailsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BrandsPageRoutingModule { }
