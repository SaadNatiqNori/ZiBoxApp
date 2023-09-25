import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; // On Scrolling and Modal Controller
import { TranslateService } from '@ngx-translate/core';
import { IconsService } from "src/app/services/icons.service";
import { OtherService } from 'src/app/services/other.service';
import { CartService } from 'src/app/pages/cart/cart.service';
import { ApiService } from "src/app/services/api.service";
import { ProfileService } from 'src/app/services/profile.service';
import { StartupService } from "src/app/services/startup.service";
import { AlertService } from "src/app/services/alert.service";
import { Storage } from "@ionic/storage-angular";
import { EditAddressComponent } from 'src/app/pages/menu/modals/my-addresses/edit-address/edit-address.component';
import { Browser } from '@capacitor/browser';
import { Router } from '@angular/router';

enum delivery {
  fast = 10,
  same_day = 20,
  week = 30,
}

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})
export class CheckOutComponent implements OnInit {

  @Input() total: any;
  cart: any = [];
  products: any = [];
  pointProducts: any = [];
  pointProductId: string = '';
  productPointPrice: number = 0;
  productPointValue: string = '';
  productPointCurrency: string = '';
  addresses: any = [];
  address: any = {};
  deliveryType: string = 'week';
  deliveryTypeId: number = 30;
  promotionCode: string = '';
  promotionCodeLoading: boolean = false;
  promotionCodePrice: number = 0;
  paymentMethod: any = [];
  paymentType: string = 'cash';
  canPayWithZoodpay: boolean = false;
  description: string = '';
  cities: any = [];
  cityName: string = '';
  cityPrice: string = '0';
  isLoading: boolean = false;
  addAddressIsLoading: boolean = false;
  cardIsLoading: boolean = false;
  isSuccessfull: boolean = false;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    private alert: AlertService,
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    private profileService: ProfileService,
    private startupService: StartupService,
    private storage: Storage,
    public router: Router,
    public cartService: CartService,
  ) {
  }

  ngOnInit() {
    // Products
    this.cart = JSON.parse(localStorage.getItem('cart'));
    console.log(this.cart)
    // Get All Products
    this.cart.forEach(market => {
      this.products = this.products.concat(market.products);
    });
    // Can Pay with Installment?
    this.canPayWithZoodpay = this.products.every(this.checkInstallment)
    // Get All Products have Points
    this.products.forEach(product => {
      if (product.point && this.profileService.points() >= product.point) {
        this.pointProducts = this.pointProducts.concat(product)
      }
    })
    // My Addresses
    this.storage.get('my-addresses').then(val => {
      this.addresses = val;
      try {
        this.address = val.filter(address => address.as_default)[0];
        this.getCities();
      } catch (err) { }
    })
    // Get Payment Methods
    this.apiService.get(`pay/methods`).subscribe((res: any) => {
      this.paymentMethod = res.result
    })
  }

  // Can Pay with Installment?
  checkInstallment(product) {
    return product.zoodpay_status
  }

  // Get Cities
  getCities() {
    this.apiService.get(`cities?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.cities = res.result;
      this.cityPrice = this.cities.filter(c => c.city_name == this.address.city)[0]['week_delivery_cost']
      this.cityName = this.address.city;
    })
  }

  // Calculator Discount Price
  calcDiscount(getPrice: string, gerPercentage: string): string {
    let divide = 100 / parseFloat(gerPercentage);
    let percentage = parseFloat(getPrice) / divide;
    let result = parseFloat(getPrice) - percentage;
    return result.toString();
  }

  // Select Point Product
  pointProduct(getItem) {
    this.pointProductId = getItem.choose_size_id;
    this.productPointValue = getItem.point;
    if (getItem.discount) {
      this.productPointPrice = +this.calcDiscount(getItem.price, getItem.percentage || getItem.discount.percentage)
    } else {
      this.productPointPrice = getItem.price;
    }
    this.productPointCurrency = getItem.currency;
  }

  // Address
  getAddress(getItem) {
    let address = [];
    getItem.country ? address.push(getItem.country) : '';
    getItem.state ? address.push(getItem.state) : '';
    getItem.city ? address.push(getItem.city) : '';
    getItem.street ? address.push(getItem.street) : '';
    return address.toString();
  }

  // Change Address
  changeAddress(getCity) {
    this.address = this.addresses.filter(c => c.city == getCity)[0];
    this.cityPrice = this.cities.filter(c => c.city_name == getCity)[0][this.deliveryType + '_delivery_cost']
    this.cityName = getCity;
  }

  // Open Address Modal
  async openEditModal(isNew: boolean = true, getItem: any = {}) {
    const modal = await this.modalCtrl.create({
      component: EditAddressComponent,
      componentProps: {
        address: isNew ? null : getItem,
        isNew: isNew,
      }
    },);
    modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.addAddressIsLoading = true;
      this.apiService.get(`user-addresses?lang=${this.otherService.selected}`).subscribe((res: any) => {
        this.addresses = res.result;
        this.address = res.result.filter(address => address.as_default)[0];
        this.cityPrice = this.cities.filter(c => c.city_name == this.address.city)[0].cost
        this.startupService.getMyAddresses();
        this.addAddressIsLoading = false;
      }, (err) => { })
    }
  }

  // Calculation Price
  calcPrices() {
    if (this.otherService.selectedCurrency == 2) {
      return this.otherService.comma(
        (parseFloat(this.total.replaceAll(',', ''))
          -
          this.promotionCodePrice
          +
          parseFloat(this.otherService.comma(this.cityPrice, { id: 4 }))
          -
          parseFloat(this.otherService.comma('' + this.productPointPrice, this.productPointCurrency))
        ).toString()
      )
    } else {
      return this.otherService.comma(
        (parseFloat(this.total.replaceAll(',', ''))
          -
          this.promotionCodePrice
          +
          parseFloat(this.cityPrice)
          -
          parseFloat(this.otherService.comma('' + this.productPointPrice, this.productPointCurrency).replace(',', '').replace(',', ''))
        ).toString())
    }
  }

  // Select Delivery Type
  selectDeliveryType(type) {
    this.deliveryType = type;
    this.deliveryTypeId = +delivery[type];
    this.cityPrice = this.cities.filter(c => c.city_name == this.cityName)[0][type + '_delivery_cost']
  }

  // Apply Promotion Code
  applyPromotionCode(promotionCode) {
    this.promotionCodeLoading = true;
    let data = {
      code: promotionCode.toUpperCase(),
      total_price: this.total.toString(),
      delivery_cost: this.cityPrice,
    }
    this.apiService.post(`use-promotion-code?lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}`, data).subscribe((res: any) => {
      this.promotionCodeLoading = false;
      this.promotionCodePrice = res.result.data.discount_value;
      this.promotionCode = promotionCode.toUpperCase()
    }, err => {
      this.promotionCodeLoading = false;
      this.promotionCodePrice = 0;
      this.alert.show('promotionCode', err);
    })
  }

  // Remove Promotion Code
  removePromotionCode() {
    this.promotionCode = '';
    this.promotionCodePrice = 0;
  }

  // Select Payment Type
  selectPayment(method) {
    this.paymentType = method;
  }

  // Send Order
  submit() {
    // Payment Type
    if (this.paymentType == 'cash') {
      this.isLoading = true;
    } else {
      this.cardIsLoading = true;
    }
    // Promotion Code
    if (this.promotionCodePrice == 0) {
      this.promotionCode = '';
    }
    // Prepare Data for Send to API
    let data = {
      comment: this.description,
      address_id: this.address.id,
      delivery_cost: this.cityPrice,
      delivery_type: this.deliveryTypeId,
      promotion_code: this.promotionCode.toString(),
      pay_type: this.paymentType,
      product_ids: [],
      point_product_id: this.pointProductId,
    }
    // Add Products to Checkout Routes
    this.products.forEach(product => {
      data.product_ids.push({
        id: product.id,
        count: product.count,
        market_id: product.market_id,
        details: product.choose_size ? `size,${product.choose_size}` : '',
        item_id: product.choose_size_id ? product.choose_size_id : ''
      })
    });
    // Submit Data
    this.apiService.post(`order?lang=${this.otherService.selected}`, data).subscribe((res: any) => {
      if (this.paymentType == 'cash') {
        this.isLoading = false;
        this.isSuccessfull = true;
      }
      else {
        this.payWithCard(res.result[0], this.paymentType)
      }
    }, err => {
      this.isLoading = false;
      this.alert.show('checkOut', err);
    })
  }

  // Pay With Card
  payWithCard(order, method) {
    this.apiService.get(`order-pay-request/${order.id}?method=${method}&currencyId=${this.otherService.selectedCurrency}`).subscribe(async (res: any) => {
      await Browser.open({ url: method !== 'zoodpay' ? res.result.formAction : res.result.payment_url });
      setTimeout(() => {
        this.waitForPayResponse(order.id)
      }, 2000);
    })
  }

  // Waiting for Card response
  waitForPayResponse(orderId) {
    setTimeout(() => {
      if (document.hasFocus()) {
        this.apiService.get(`order/check-my-order-status/${orderId}`).subscribe(async (res: any) => {
          if (res.result.payment_status == 20) {
            this.isSuccessfull = true;
          } else {
            this.cardIsLoading = false
          }
        })
      } else {
        this.waitForPayResponse(orderId)
      }
    }, 1000);
  }

  openPage(url: string) {
    this.cartService.cart = [];
    localStorage.removeItem('cart');
    this.router.navigate([url]);
    this.close();
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
