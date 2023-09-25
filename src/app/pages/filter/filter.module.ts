import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPage } from './filter.page';

import { FilterPageRoutingModule } from './filter-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FilterPageRoutingModule,
    TranslateModule,
  ],
  declarations: [FilterPage]
})
export class FilterPageModule { }
