import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuCategoriesPage } from './categories.page';

import { CategoriesPageRoutingModule } from './categories.page-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CategoriesPageRoutingModule,
    TranslateModule,
  ],
  declarations: [MenuCategoriesPage]
})
export class CategoriesPageModule { }
