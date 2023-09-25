import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketplacePage } from './marketplace.page';

const routes: Routes = [
  {
    path: '',
    component: MarketplacePage,
  },
  {
    path: 'discounts',
    loadChildren: () => import('./section/discounts/discounts.module').then( m => m.DiscountsPageModule)
  },
  {
    path: 'fashion',
    loadChildren: () => import('./section/fashion/fashion.module').then( m => m.FashionPageModule)
  },
  {
    path: 'grocery',
    loadChildren: () => import('./section/grocery/grocery.module').then( m => m.GroceryPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./section/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'event',
    loadChildren: () => import('./section/special-event/special-event.module').then( m => m.SpecialEventPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplacePageRoutingModule { }
