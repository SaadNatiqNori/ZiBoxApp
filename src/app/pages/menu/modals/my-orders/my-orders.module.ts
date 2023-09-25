import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MyOrdersPage } from './my-orders.page';
import { MyOrdersPageRoutingModule } from './my-orders-routing.module';

import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyOrdersPageRoutingModule,
    TranslateModule,
  ],
  declarations: [MyOrdersPage]
})
export class MyOrdersPageModule {}
