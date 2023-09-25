import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MyFavouritesPage } from './my-favourites.page';
import { MyFavouritesPageRoutingModule } from './my-favourites-routing.module';

import { TranslateModule } from "@ngx-translate/core";
import { CardComponentModule } from 'src/app/products/card/card.module';
import { CardSkeletonComponentModule } from 'src/app/products/card-skeleton/card-skeleton.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyFavouritesPageRoutingModule,
    TranslateModule,
    CardComponentModule,
    CardSkeletonComponentModule,
  ],
  declarations: [MyFavouritesPage]
})
export class MyFavouritesPageModule {}
