import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MyReviewsPage } from './my-reviews.page';
import { MyReviewsPageRoutingModule } from './my-reviews-routing.module';

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyReviewsPageRoutingModule,
    TranslateModule,
  ],
  declarations: [MyReviewsPage]
})
export class MyReviewsPageModule {}
