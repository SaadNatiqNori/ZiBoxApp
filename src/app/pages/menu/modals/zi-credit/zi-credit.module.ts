import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ZiCreditPageRoutingModule } from './zi-credit-routing.module';
import { ZiCreditPage } from './zi-credit.page';
import { TranslateModule } from "@ngx-translate/core";

import { CardComponentModule } from 'src/app/products/card/card.module';
import { CardSkeletonComponentModule } from 'src/app/products/card-skeleton/card-skeleton.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZiCreditPageRoutingModule,
    TranslateModule,
    CardComponentModule,
    CardSkeletonComponentModule,
  ],
  declarations: [ZiCreditPage]
})
export class ZiCreditPageModule {}
