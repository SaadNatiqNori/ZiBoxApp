import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class DetailService {

  tabs: string = 'categories';

  product: any = {
    id: null,
    title: '',
    is_favorite: 0,
    description: '',
    delivery_time: '',
    currency: {
      code: null,
    },
    currency_id: 4,
    thumb: '',
    quantity: 0,
    discount: null,
    percentage: 0,
    zi_product_details: [],
    price: 0,
    zoodpay_status: false,
  }

  brand: any = {
    id: null,
    name: '',
    image: '',
  }

  market: any = {
    id: null,
    title: '',
    logo: '',
    description: '',
    bg_image: null,
    stats: {
      total: 0,
    },
    ctime: '',
  }

  constructor(
    private router: Router,
  ) { }

  openProduct(item) {
    this.product = item;
    this.router.navigate([`product`, item.id]);
  }

}
