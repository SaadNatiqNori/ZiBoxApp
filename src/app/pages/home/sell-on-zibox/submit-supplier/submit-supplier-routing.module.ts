import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmitSupplierPage } from './submit-supplier.page';

const routes: Routes = [
  {
    path: '',
    component: SubmitSupplierPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitSupplierPageRoutingModule {}
