import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SellOnZiboxPage } from './sell-on-zibox.page';
import { SellOnZiboxPageRoutingModule } from './sell-on-zibox-routing.module';

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SellOnZiboxPageRoutingModule,
  ],
  declarations: [SellOnZiboxPage],
  exports: [SellOnZiboxPage],
})
export class SellOnZiboxPageModule {}
