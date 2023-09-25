import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroceryPageRoutingModule } from './grocery-routing.module';
import { GroceryPage } from './grocery.page';

import { TranslateModule } from "@ngx-translate/core";
import { CardComponentModule } from 'src/app/products/card/card.module';
import { CardSkeletonComponentModule } from 'src/app/products/card-skeleton/card-skeleton.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroceryPageRoutingModule,
    TranslateModule,
    CardComponentModule,
    CardSkeletonComponentModule,
  ],
  declarations: [GroceryPage],
  exports: [GroceryPage],
})
export class GroceryPageModule {}
