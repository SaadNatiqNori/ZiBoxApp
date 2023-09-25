import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DiscountsPageRoutingModule } from './discounts-routing.module';
import { DiscountsPage } from './discounts.page';

import { TranslateModule } from "@ngx-translate/core";
import { CardComponentModule } from 'src/app/products/card/card.module';
import { CardSkeletonComponentModule } from 'src/app/products/card-skeleton/card-skeleton.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscountsPageRoutingModule,
    TranslateModule,
    CardComponentModule,
    CardSkeletonComponentModule,
  ],
  declarations: [DiscountsPage],
  exports: [DiscountsPage]
})
export class DiscountsPageModule {}
