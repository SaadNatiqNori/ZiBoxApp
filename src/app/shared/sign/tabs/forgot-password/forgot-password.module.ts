import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ForgotPasswordPage } from './forgot-password.page';

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule
  ],
  declarations: [ForgotPasswordPage],
  exports: [ForgotPasswordPage],
})
export class ForgotPasswordPageModule {}
