import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterPage } from './filter.page';

const routes: Routes = [
  {
    path: '',
    component: FilterPage,
    children: [
      {
        path: 'categories',
        loadChildren: () => import('./categories/categories.page.module').then(m => m.CategoriesPageModule),
      },
      {
        path: 'category',
        loadChildren: () => import('./categories/category-details/category-details.module').then(m => m.CategoryDetailsPageModule),
      },
      {
        path: 'brands',
        loadChildren: () => import('./brands/brands.page.module').then(m => m.MenuBrandsPageModule)
      },
      {
        path: 'brand',
        loadChildren: () => import('./brands/brand-details/brand-details.module').then(m => m.BrandDetailsPageModule)
      },
      {
        path: 'shops',
        loadChildren: () => import('./shops/shops.module').then( m => m.ShopsPageModule)
      },
      {
        path: 'shop',
        loadChildren: () => import('./shops/shop-details/shop-details.module').then( m => m.ShopDetailsPageModule)
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FilterPageRoutingModule { }
