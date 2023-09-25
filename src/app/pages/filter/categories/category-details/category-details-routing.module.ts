import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryDetailsPage } from './category-details.page';

const routes: Routes = [
  {
    path: ':id',
    component: CategoryDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryDetailsPageRoutingModule {}
