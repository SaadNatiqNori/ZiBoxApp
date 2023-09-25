import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PhoneNumberPage } from './phone-number.page';

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
  ],
  declarations: [PhoneNumberPage],
  exports: [PhoneNumberPage],
})
export class PhoneNumberPageModule {}
