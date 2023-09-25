import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SpecialEventPageRoutingModule } from './special-event-routing.module';
import { SpecialEventPage } from './special-event.page';

import { TranslateModule } from "@ngx-translate/core";
import { CardComponentModule } from 'src/app/products/card/card.module';
import { CardSkeletonComponentModule } from 'src/app/products/card-skeleton/card-skeleton.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialEventPageRoutingModule,
    TranslateModule,
    CardComponentModule,
    CardSkeletonComponentModule,
  ],
  declarations: [SpecialEventPage]
})
export class SpecialEventPageModule {}
