import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandDetailsPage } from './brand-details.page';

const routes: Routes = [
  {
    path: ':id',
    component: BrandDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandDetailsPageRoutingModule {}
