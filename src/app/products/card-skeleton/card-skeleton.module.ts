import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardSkeletonComponent } from './card-skeleton.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [CardSkeletonComponent],
  exports: [CardSkeletonComponent]
})
export class CardSkeletonComponentModule {}
