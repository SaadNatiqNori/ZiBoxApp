import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignPage } from './sign.page';

const routes: Routes = [
  {
    path: '',
    component: SignPage
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./tabs/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignPageRoutingModule {}
