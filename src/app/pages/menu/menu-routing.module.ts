import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./modals/my-orders/my-orders.module').then( m => m.MyOrdersPageModule)
  },
  {
    path: 'my-favourites',
    loadChildren: () => import('./modals/my-favourites/my-favourites.module').then( m => m.MyFavouritesPageModule)
  },
  {
    path: 'my-reviews',
    loadChildren: () => import('./modals/my-reviews/my-reviews.module').then( m => m.MyReviewsPageModule)
  },
  {
    path: 'my-addresses',
    loadChildren: () => import('./modals/my-addresses/my-addresses.module').then( m => m.MyAddressesPageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./modals/my-profile/my-profile.module').then( m => m.MyProfilePageModule)
  },
  {
    path: 'legal-information',
    loadChildren: () => import('./modals/legal-information/legal-information.module').then( m => m.LegalInformationPageModule)
  },
  {
    path: 'show-information',
    loadChildren: () => import('./modals/legal-information/show-information/show-information.module').then( m => m.ShowInformationPageModule)
  },
  {
    path: 'company',
    loadChildren: () => import('./modals/company/company.module').then( m => m.CompanyPageModule)
  },
  {
    path: 'zi-credit',
    loadChildren: () => import('./modals/zi-credit/zi-credit.module').then( m => m.ZiCreditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuPageRoutingModule {}
