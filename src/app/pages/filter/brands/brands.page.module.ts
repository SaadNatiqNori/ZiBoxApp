import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuBrandsPage } from './brands.page';

import { BrandsPageRoutingModule } from './brands.page-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BrandsPageRoutingModule,
    TranslateModule,
  ],
  declarations: [MenuBrandsPage]
})
export class MenuBrandsPageModule { }
