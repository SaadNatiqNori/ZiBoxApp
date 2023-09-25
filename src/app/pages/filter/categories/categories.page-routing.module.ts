import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuCategoriesPage } from './categories.page';

const routes: Routes = [
  {
    path: '',
    component: MenuCategoriesPage,
  },
  {
    path: ':id',
    loadChildren: () => import('./category-details/category-details.module').then( m => m.CategoryDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CategoriesPageRoutingModule { }
