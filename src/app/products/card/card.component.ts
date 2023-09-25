import { Component, Input, OnInit } from '@angular/core';
import { OtherService } from "src/app/services/other.service";
import { ApiService } from "src/app/services/api.service";
import { ProfileService } from "src/app/services/profile.service";

// Modal Controller
import { DetailService } from "src/app/services/details.service";
import { ModalController } from '@ionic/angular';
import { MyProfilePage } from 'src/app/pages/menu/modals/my-profile/my-profile.page';

interface product {
  id: string,
  as_points: boolean,
  title: string,
  thumb: string,
  category_name: string,
  pro_percentage: string,
  dis_percentage: string,
  market: string[],
  quantity: number,
  is_favorite: string,
  percentage: string,
  price: string,
  average_rating: number,
  currency: { code: string },
  currency_id: string,
  countColorProducts: number,
  zi_product_details: any,
  is_censored: boolean,
}

@Component({
  selector: 'zi-card',
  templateUrl: './card.component.html',
})

export class CardComponent implements OnInit {
  @Input() item: product;
  @Input() special?: boolean = false;
  @Input() isPoint?: boolean = false;
  
  isFavorite: boolean = false;
  price: string = '0';
  color: number = 0;
  notClickable: boolean = false;

  constructor(
    public otherService: OtherService,
    private apiService: ApiService,
    public profileService: ProfileService,
    private detailService: DetailService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    if (this.item.is_favorite == '1') {
      this.isFavorite = true;
    } else {
      this.isFavorite = false;
    }
    // Get Price
    try {
      this.price = this.item.zi_product_details[0].price
    }
    catch (err) {
      this.price = this.item.price
    }
    // Get Color
    this.color = this.item.countColorProducts;
    // Quantity
    try {
      this.item.quantity = (this.item.zi_product_details.filter(detail => detail.product_id == this.item.id))[0].quantity
    } catch {
      this.item.quantity = this.item.quantity
    }
  }

  productDetails(getItem) {
    this.detailService.product = getItem;
    this.detailService.openProduct(getItem)
  }

  // Add Product to Favourite
  favouriteProduct() {
    if (this.item.is_favorite != '1') {
      this.apiService.post(`product/favorites-add/${this.item.id}?lang=${this.otherService.selected}`, {}).subscribe(res => {
        this.item.is_favorite = '1'
        this.isFavorite = true;
      })
    } else {
      this.apiService.delete(`favorites?ids=${this.item.id}&lang=${this.otherService.selected}`).subscribe(res => {
        this.item.is_favorite = '0'
        this.isFavorite = false;
      })
    }
  }

  // Calculator Discount Price
  calcDiscount(getPrice: string, gerPercentage: string, currency): string {
    let divide = 100 / parseFloat(gerPercentage);
    let percentage = parseFloat(getPrice) / divide;
    let result = parseFloat(getPrice) - percentage;
    return this.otherService.comma(result.toString(), currency);
  }

  // Discount Reminder Time
  diffTime(e_date) {

    let start_date = new Date();
    const t = e_date.split(/[- :]/);
    const d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
    let end_date = new Date(d);

    let delta = Math.abs(Number(end_date) - Number(start_date)) / 1000;

    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    let hours = Math.floor(delta / 3600) % 24;
    let textHours = hours <= 9 ? '0' + hours : hours;
    delta -= hours * 3600;

    let minutes = Math.floor(delta / 60) % 60;
    let textMinutes = minutes <= 9 ? '0' + minutes : minutes;
    delta -= minutes * 60;

    let seconds = Math.round(delta % 60);
    let textSeconds = seconds <= 9 ? '0' + seconds : seconds;

    if (start_date > end_date) {
      return 'Expired';
    }

    if (days != 0) {
      return days + ':' + textHours + ':' + textMinutes + ':' + textSeconds;
    }

    if (hours != 0) {
      return textHours + ':' + textMinutes + ':' + textSeconds;
    }
    if (minutes != 0) {
      return textMinutes + ':' + textSeconds;
    }
    if (seconds != 0) {
      return textSeconds + ' Sec';
    }
  }

  async privateProduct() {
    if (this.profileService.isLogin) {
      if (this.profileService.gender() == '') {
        // Open Modals
        const modal = await this.modalCtrl.create({
          component: MyProfilePage
        },);
        modal.present();
      }
    } else {
      this.otherService.openSign()
    }
  }

  isRTL(): boolean {
    let arabic = /[\u0600-\u06FF]/;
    return arabic.test(this.item.title);
  }
}
