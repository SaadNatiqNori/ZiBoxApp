import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivePage } from './live.page';

import { LivePageRoutingModule } from './live-routing.module';

import { TranslateModule } from "@ngx-translate/core";
import { CardComponentModule } from '../../products/card/card.module';
import { CardSkeletonComponentModule } from '../../products/card-skeleton/card-skeleton.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LivePageRoutingModule,
    TranslateModule,
    CardComponentModule,
    CardSkeletonComponentModule,
  ],
  declarations: [LivePage]
})
export class LivePageModule {}
