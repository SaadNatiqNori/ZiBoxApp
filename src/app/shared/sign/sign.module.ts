import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignPageRoutingModule } from './sign-routing.module';

import { SignPage } from './sign.page';
import { SigninPageModule } from './tabs/signin/signin.module';
import { SignupPageModule } from './tabs/signup/signup.module';
import { ForgotPasswordPageModule } from './tabs/forgot-password/forgot-password.module';
import { PhoneNumberPageModule } from './tabs/phone-number/phone-number.module';

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SignPageRoutingModule,
    SigninPageModule,
    SignupPageModule,
    ForgotPasswordPageModule,
    TranslateModule,
    PhoneNumberPageModule,
  ],
  declarations: [SignPage],
  exports: [SignPage],
})
export class SignPageModule {}
