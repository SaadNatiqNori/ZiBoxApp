import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SubmitSupplierPageRoutingModule } from './submit-supplier-routing.module';
import { SubmitSupplierPage } from './submit-supplier.page';

import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmitSupplierPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [SubmitSupplierPage]
})
export class SubmitSupplierPageModule {}
