import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuPage } from './menu.page';

import { MenuPageRoutingModule } from './menu-routing.module';
import { TranslateModule } from "@ngx-translate/core";

import { ReferAFriendComponent } from './modals/refer-a-friend/refer-a-friend.component';
import { WhoReferYouComponent } from './modals/who-refer-you/who-refer-you.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenuPageRoutingModule,
    TranslateModule,
  ],
  declarations: [MenuPage, ReferAFriendComponent, WhoReferYouComponent]
})
export class MenuPageModule { }
