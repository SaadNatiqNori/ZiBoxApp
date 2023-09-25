import { Component, OnInit } from '@angular/core';
import { DetailService } from 'src/app/services/details.service';
import { OtherService } from 'src/app/services/other.service';
import { ProfileService } from 'src/app/services/profile.service';
import { CartService } from './cart.service';
import { FilterService } from '../filter/filter.service';

@Component({
  selector: 'zi-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss']
})
export class CartPage implements OnInit {

  minOrderPrice = '10000';

  constructor(
    public cart: CartService,
    public otherService: OtherService,
    public profileService: ProfileService,
    private detailService: DetailService,
    public filterService: FilterService,
  ) { }

  ngOnInit(): void {
    this.cart.getData();
  }

  // Open Shop Details
  openShop(shop) {
    this.filterService.name = shop.title;
    this.filterService.openShop(shop);
  }

  // Open Products Details
  openProduct(product) {
    this.detailService.product = product;
    this.detailService.openProduct(product);
  }

  // Check Out Products
  checkOut() {
    if (this.profileService.isLogin) {
      this.cart.checkOutModal()
    } else {
      this.otherService.openSign()
    }
  }

}
