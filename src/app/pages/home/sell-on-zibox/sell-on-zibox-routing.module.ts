import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellOnZiboxPage } from './sell-on-zibox.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SellOnZiboxPage
      },
      {
        path: 'submit',
        loadChildren: () => import('./submit-supplier/submit-supplier.module').then(m => m.SubmitSupplierPageModule)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellOnZiboxPageRoutingModule { }
