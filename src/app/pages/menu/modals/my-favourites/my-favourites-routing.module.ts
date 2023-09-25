import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyFavouritesPage } from './my-favourites.page';

const routes: Routes = [
  {
    path: '',
    component: MyFavouritesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyFavouritesPageRoutingModule {}
