import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'marketplace',
        loadChildren: () => import('./marketplace/marketplace.module').then(m => m.MarketplacePageModule),
      },
      {
        path: 'sellonzibox',
        loadChildren: () => import('./sell-on-zibox/sell-on-zibox.module').then(m => m.SellOnZiboxPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
