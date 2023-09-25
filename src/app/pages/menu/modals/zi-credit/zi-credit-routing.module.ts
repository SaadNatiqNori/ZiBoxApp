import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZiCreditPage } from './zi-credit.page';

const routes: Routes = [
  {
    path: '',
    component: ZiCreditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZiCreditPageRoutingModule {}
