import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartPage } from './cart.page';

import { CartPageRoutingModule } from './cart-routing.module';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CartPageRoutingModule,
    TranslateModule,
  ],
  declarations: [CartPage]
})
export class CartPageModule {}
