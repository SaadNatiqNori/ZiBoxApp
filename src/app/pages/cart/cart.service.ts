import { Injectable } from "@angular/core";
import { OtherService } from 'src/app/services/other.service';
import { ModalController } from "@ionic/angular"; // Modal Controller
import { CheckOutComponent } from "src/app/products/check-out/check-out.component";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: any = [];

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    public otherService: OtherService,
  ) { }

  getData() {
    if (localStorage.getItem('cart')) {
      this.cart = JSON.parse(localStorage.getItem('cart'))
    }
    this.totalPrices()
  }

  // Change Count of product Quantity
  changeCount(getMarket: any, getProduct: any, opration: string) {
    let shop = getMarket;
    let market = this.cart[this.cart.indexOf(getMarket)]
    let product = market.products[market.products.indexOf(getProduct)]

    if (opration === '+') {
      product.count += 1;
      market.products[market.products.indexOf(getProduct)] = product
    } else if (product.count > 1) {
      product.count -= 1;
      market.products[market.products.indexOf(getProduct)] = product
    }
    // Get Market Product Prices
    market.priceSum = this.sumPrice(market.products);
    this.totalPrices()
    // Store Changes
    localStorage.setItem('cart', JSON.stringify(this.cart))
  }

  // Total Products Price for each Market
  sumPrice(getProducts: any): string {
    let sum = 0;
    getProducts.forEach(product => {
      if (product?.discount?.percentage) {
        let divide = 100 / parseFloat(product.percentage || product.discount.percentage);
        let percentage = parseFloat(product.price) / divide;
        let result = parseFloat(product.price) - percentage;
        if (this.otherService.selectedCurrency === 2 && product.currency.id === 4) {
          sum += (result / this.otherService.exchangeRate) * product.count
        } else if (this.otherService.selectedCurrency === 4 && product.currency.id === 2) {
          sum += (result * this.otherService.exchangeRate) * product.count
        } else {
          sum += result * product.count
        }
      } else {
        if (this.otherService.selectedCurrency === 2 && product.currency.id === 4) {
          sum += (product.price / this.otherService.exchangeRate) * product.count
        } else if (this.otherService.selectedCurrency === 4 && product.currency.id === 2) {
          sum += (product.price * this.otherService.exchangeRate) * product.count
        } else {
          sum += product.price * product.count
        }
      }
    });
    return this.otherService.comma(sum.toString())
  }

  // Total Products Price for Cash out
  totalPrices() {
    let sum = 0;
    this.cart.forEach(market => {
      market.products.forEach(product => {
        if (product?.discount?.percentage) {
          let divide = 100 / parseFloat(product.percentage || product?.discount?.percentage);
          let percentage = parseFloat(product.price) / divide;
          let result = parseFloat(product.price) - percentage;
          if (this.otherService.selectedCurrency === 2 && product.currency.id === 4) {
            sum += (result / this.otherService.exchangeRate) * product.count
          } else if (this.otherService.selectedCurrency === 4 && product.currency.id === 2) {
            sum += (result * this.otherService.exchangeRate) * product.count
          } else {
            sum += result * product.count
          }
        } else {
          if (this.otherService.selectedCurrency === 2 && product.currency.id === 4) {
            sum += (product.price / this.otherService.exchangeRate) * product.count
          } else if (this.otherService.selectedCurrency === 4 && product.currency.id === 2) {
            sum += (product.price * this.otherService.exchangeRate) * product.count
          } else {
            sum += product.price * product.count
          }
        }
      });
    });
    return sum.toString()
  }

  // Calculator Discount Price
  calcDiscount(getPrice: string, gerPercentage: string): string {
    let divide = 100 / parseFloat(gerPercentage);
    let percentage = parseFloat(getPrice) / divide;
    let result = parseFloat(getPrice) - percentage;
    return result.toString();
  }

  // Open Check Out Modal
  async checkOutModal() {
    const modal = await this.modalCtrl.create({
      component: CheckOutComponent,
      componentProps: {
        total: this.totalPrices()
      }
    },);
    modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.cart = [];
    }
  }

  minOrderPrice: number = 10000;

  // More than 10,000 IQD
  moreThanMinOrderPrice(productPrice, minOrderPrice): boolean {
    if (this.otherService.selectedCurrency === 2) {
      minOrderPrice = minOrderPrice / this.otherService.exchangeRate
    }
    if (+minOrderPrice > +productPrice) {
      return false;
    }
    return true;
  }

  // Delete All Products
  deleteAll() {
    localStorage.removeItem('cart')
    this.cart = [];
  }

  // Delete All Products of Shop
  deleteShop(market, product) {
    // Find Product
    let getShop = this.cart.filter(shop => shop.market.id === market.id)[0];
    // Remove Product
    getShop.products.splice(getShop.products.indexOf(product), 1)
    // If last product then remove Shop
    if (getShop.products.length < 1) {
      this.cart.splice(this.cart.indexOf(getShop), 1)
    }
    // Store Changes
    localStorage.setItem('cart', JSON.stringify(this.cart))
  }
}
