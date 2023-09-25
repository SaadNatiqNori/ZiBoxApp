import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardComponent } from './card.component';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
  declarations: [CardComponent],
  exports: [CardComponent]
})
export class CardComponentModule { }
