import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { CardComponentModule } from 'src/app/products/card/card.module';
import { CardSkeletonComponentModule } from 'src/app/products/card-skeleton/card-skeleton.module';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslateModule } from "@ngx-translate/core";
import { LanguageComponent } from "src/app/shared/language/language.component";
import { CurrencyComponent } from "src/app/shared/currency/currency.component";
import { NotificationComponent } from "src/app/shared/notification/notification.component";
import { ZoomComponent } from "src/app/shared/zoom/zoom.component";
import { MoreReviewsComponent } from "src/app/shared/more-reviews/more-reviews.component";
import { EditReviewComponent } from "src/app/shared/more-reviews/edit-review/edit-review.component";
import { CheckOutComponent } from "src/app/products/check-out/check-out.component";
import { EditAddressComponent } from "src/app/pages/menu/modals/my-addresses/edit-address/edit-address.component";

// Home Categories
import { FashionFilterComponent } from "./marketplace/section/fashion/modal/fashion-filter/fashion-filter.component";
import { SellOnZiboxPageModule } from "./sell-on-zibox/sell-on-zibox.module";
import { PinchZoomModule } from 'ngx-pinch-zoom';

@NgModule({
  declarations: [
    HomePage,
    LanguageComponent,
    CurrencyComponent,
    NotificationComponent,
    ZoomComponent,
    MoreReviewsComponent,
    EditReviewComponent,
    CheckOutComponent,
    EditAddressComponent,
    FashionFilterComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponentModule,
    CardSkeletonComponentModule,
    HomePageRoutingModule,
    TranslateModule,
    PinchZoomModule,
    // Home Categories
    SellOnZiboxPageModule,
  ]
})
export class HomePageModule { }
