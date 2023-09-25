import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DiscountPageRoutingModule } from './discount-routing.module';
import { DiscountPage } from './discount.page';

import { TranslateModule } from "@ngx-translate/core";
import { CardComponentModule } from 'src/app/products/card/card.module';
import { CardSkeletonComponentModule } from 'src/app/products/card-skeleton/card-skeleton.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscountPageRoutingModule,
    TranslateModule,
    CardComponentModule,
    CardSkeletonComponentModule,
  ],
  declarations: [DiscountPage]
})
export class DiscountPageModule {}
