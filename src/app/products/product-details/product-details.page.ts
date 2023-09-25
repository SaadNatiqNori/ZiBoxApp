import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetailService } from "src/app/services/details.service";

import { OtherService } from 'src/app/services/other.service';
import { ApiService } from 'src/app/services/api.service';
import { IconsService } from 'src/app/services/icons.service';
import { ProfileService } from "src/app/services/profile.service";
import { AlertService } from "src/app/services/alert.service";
import { CartService } from "src/app/pages/cart/cart.service";
import { FilterService } from 'src/app/pages/filter/filter.service';

import { TranslateService } from '@ngx-translate/core';
import { AlertController, ModalController } from '@ionic/angular'; // Modal Controller
import { MoreReviewsComponent } from "src/app/shared/more-reviews/more-reviews.component";
import { EditReviewComponent } from "src/app/shared/more-reviews/edit-review/edit-review.component";
import { ZoomComponent } from "src/app/shared/zoom/zoom.component";
import { ActivatedRoute, Router } from '@angular/router';

import { Share } from '@capacitor/share';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit, OnDestroy {

  productId: string = null;
  discountTimer: any;
  discountTime: string = null;

  // Product Information Variables
  name: string = '';
  image: string = '';
  video: string = null;
  selectImage: string = '';
  images: any = [];
  isFavorite: number;
  quantity: number = 1;
  productCount: number = 1;
  price: string = '';
  point: string = '';
  asPoint: boolean = false;
  discount: {
    percentage: string,
    end_date: any,
  };
  currency: any = {
    id: 4
  }
  currency_id: string;
  percentage: string = '';
  description: string = '';
  deliveryTime: string = null;
  isReturned: string = null
  sizes: any = [];
  productSize: any = null;
  colors: any = [];
  productColor: any = null;
  specifications: any = [];
  colorSkeleton: any = [];
  countColorProductTrendyol: number = 0
  product_details: any = []
  zi_product_details: any = []
  market: any;
  marketCoupons: any = null;
  brand: any;

  isVideoPanel: boolean = false;
  productOnMyCart: boolean = false;
  sectionTab: string = 'description';
  canBuyWithZoodpay: boolean = false;

  constructor(
    public detailService: DetailService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    private alertController: AlertController, // Alert Controller
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    private filterService: FilterService,
    public profileService: ProfileService,
    public alert: AlertService,
    public cartService: CartService,
  ) {
    this.productId = detailService.product.id || this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    // Product Information
    this.name = this.detailService.product.title;
    this.isFavorite = this.detailService.product.is_favorite;
    this.description = this.detailService.product.description;
    this.image = this.detailService.product.thumb;
    this.video = this.detailService.product.video;
    this.selectImage = this.detailService.product.thumb;
    this.quantity = this.detailService.product.quantity;
    this.discount = this.detailService.product.discount || null;
    this.percentage = this.detailService.product.percentage || this.detailService.product.discount?.percentage || 0;
    this.colorSkeleton = Array(this.detailService.product.countColorProducts || this.detailService.product.countColorProductTrendyol).fill(1);
    this.currency = this.detailService.product.currency;
    this.currency_id = this.detailService.product.currency_id;
    // Product Size
    this.sizes = this.detailService.product.zi_product_details || []
    try {
      this.productSize = this.sizes[0] || null;
      this.quantity = this.sizes[0].quantity || 0;
    } catch (error) { }
    // Get Price
    try {
      this.price = this.detailService.product?.zi_product_details[0]?.price
    } catch (err) {
      this.price = this.detailService.product?.price
    }
    this.point = this.detailService?.product?.zi_product_details[0]?.points_price || '';
    this.asPoint = this.detailService?.product?.zi_product_details[0]?.as_points || false;
    this.canBuyWithZoodpay = this.detailService?.product?.zoodpay_status || false;
    // Get Product Details from API
    this.checkProductOnMyCart();
    this.getData(this.productId);
    this.getColors(this.productId);
    this.getSpecification(this.productId);
    this.getRating(this.productId);
    this.getReviews(this.productId);
    this.getMyReviews(this.productId);
    // Discount Reminder
    if (this.discount && this.discountTime == null) {
      this.discountTimer = setInterval(() => {
        var now = new Date();
        const time = this.discount.end_date.split(/[- :]/);
        const date = new Date(time[0], time[1] - 1, time[2], time[3], time[4], time[5]);
        let endDate = new Date(date);
        var delta = Math.abs(Number(endDate) - Number(now)) / 1000;
        // Date
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        // Hours
        var hours = Math.floor(delta / 3600) % 24;
        var textHours = hours <= 9 ? "0" + hours : hours;
        delta -= hours * 3600;
        // Minutes
        var minutes = Math.floor(delta / 60) % 60;
        var textMinutes = minutes <= 9 ? "0" + minutes : minutes;
        delta -= minutes * 60;
        // Seconds
        var seconds = Math.round(delta % 60);
        var textSeconds = seconds <= 9 ? "0" + seconds : seconds;
        this.discountTime = `${days}:${textHours}:${textMinutes}:${textSeconds}`;
      }, 1000)
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.discountTimer)
  }

  // Product Details
  getData(getId: string) {
    this.apiService.get(`product/${getId}?expand=is_favorite,currency,brandInfo,values,images,category,owner,profile,market,market.coupon,discount,is_favorite,product_details,zi_product_details,zi_product_details.zi_attribute&lang=${this.otherService.selected}`).subscribe((res: any) => {
      // Check for product have Images or not
      if (res.result.images.length > 0) {
        this.images = res.result.images;
        this.image = res.result.images[0].image;
      } else {
        this.images = [{
          image: this.image
        }];
      }
      this.selectImage = this.images[0]?.image;
      // Product Information
      this.name = res.result.title;
      this.video = res.result.video
      this.isFavorite = res.result.is_favorite;
      this.description = res.result.description;
      this.deliveryTime = res.result.delivery_time;
      this.isReturned = res.result.is_returned;
      this.quantity = res.result.quantity;
      this.discount = res.result.discount || null;
      this.percentage = res.result.percentage || res.result.discount?.percentage || 0;
      try {
        this.price = res.result.zi_product_details[0].price;
      } catch (err) {
        this.price = res.result.price
      }
      this.point = res.result.zi_product_details[0].points_price
      this.asPoint = res.result.as_points;
      this.currency = res.result.currency;
      this.currency_id = res.result.currency_id;
      // Product Size
      this.sizes = res.result.zi_product_details || []
      try {
        this.productSize = this.sizes[0] || null;
        this.quantity = this.sizes[0].quantity || 0;
      } catch (error) { }
      // Market
      this.market = res.result?.market || null;
      this.getMarketCoupons(this.market.id);
      // Brand
      this.brand = res.result?.brandInfo || null;
      // Similar Product
      if (res.result.category_id) {
        this.getSimilar(res.result.category_id)
      }
      // Discount Reminder
      if (this.discount && this.discountTime == null) {
        this.discountTimer = setInterval(() => {
          var now = new Date();
          const time = this.discount.end_date.split(/[- :]/);
          const date = new Date(time[0], time[1] - 1, time[2], time[3], time[4], time[5]);
          let endDate = new Date(date);
          var delta = Math.abs(Number(endDate) - Number(now)) / 1000;
          // Date
          var days = Math.floor(delta / 86400);
          delta -= days * 86400;
          // Hours
          var hours = Math.floor(delta / 3600) % 24;
          var textHours = hours <= 9 ? "0" + hours : hours;
          delta -= hours * 3600;
          // Minutes
          var minutes = Math.floor(delta / 60) % 60;
          var textMinutes = minutes <= 9 ? "0" + minutes : minutes;
          delta -= minutes * 60;
          // Seconds
          var seconds = Math.round(delta % 60);
          var textSeconds = seconds <= 9 ? "0" + seconds : seconds;
          this.discountTime = `${days}:${textHours}:${textMinutes}:${textSeconds}`;
        }, 1000)
      }
      // Set all Data to Product
      this.detailService.product = res.result;
      // Check the Product on the Cart or not
      this.checkProductOnMyCart();
    }, (err) => {
      this.images = [{
        image: this.image
      }];
      this.selectImage = this.image;
    })
  }

  // Add Product to Favourite
  favouriteProduct() {
    if (this.isFavorite != 1) {
      this.apiService.post(`product/favorites-add/${this.productId}?lang=${this.otherService.selected}`, {}).subscribe(res => {
        this.detailService.product.is_favorite = '1'
        this.isFavorite = 1;
      })
    } else {
      this.apiService.delete(`favorites?ids=${this.productId}&lang=${this.otherService.selected}`).subscribe(res => {
        this.detailService.product.is_favorite = '0'
        this.isFavorite = 0;
      })
    }
  }

  // Share Product
  async share() {
    await Share.share({
      title: `ZiBox - ${this.name}`,
      text: this.description,
      files: [this.image],
      url: `https://zibox.io/home/marketplace/advertisement/${this.productId}`,
      dialogTitle: 'Share ZiBox Product',
    });
  }

  // Calculator Discount Price
  calcDiscount(getPrice: string, gerPercentage: string): string {
    let divide = 100 / parseFloat(gerPercentage);
    let percentage = parseFloat(getPrice) / divide;
    let result: number = parseFloat(getPrice) - percentage;
    return result.toString();
  }

  // Get Coupons of Market
  getMarketCoupons(getId) {
    this.apiService.get(`coupon-by-condition/4/${getId}`).subscribe((res: any) => {
      this.marketCoupons = res.result;
    })
  }

  // Copy Product Id
  async copy() {
    try {
      await navigator.clipboard.writeText(this.productId);
      this.alert.toast('copyId')
    } catch (err) {
      var text = document.getElementById("productId") as HTMLInputElement;
      text.focus();
      text.select();
      setTimeout(() => {
        document.execCommand('copy');
        this.alert.toast('copyId')
      }, 100);
    }
  }

  // Colors
  getColors(getId: string) {
    this.apiService.get(`trendyol-products-by-id/${getId}/zi?expand=currency,images,owner,is_favorite,product_details,countColorProductTrendyol,zi_product_details,countColorProducts&lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.colors = res.result;
      this.productColor = this.colors.filter(color => color.id == this.productId)[0] || null;
    })
  }

  // Colors
  getSpecification(getId: string) {
    this.apiService.get(`get-product-characteristics-by-product-id/${getId}/advertisement?expand=getChara&lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.specifications = res.result;
    })
  }

  // Change Colors
  changeColor(getItem: any) {
    this.productId = getItem.id;
    this.images = getItem?.images
    this.image = getItem?.images[0]?.image || null;
    this.selectImage = getItem?.thumb;
    this.name = getItem?.title
    this.quantity = getItem.zi_product_details[0].quantity
    // Product Size
    this.sizes = getItem.zi_product_details || []
    try {
      this.productSize = this.sizes[0] || null;
    } catch (error) { }
    // Get Price
    try {
      this.price = getItem.zi_product_details[0].price
    } catch (err) {
      this.price = getItem.price
    }
    this.point = getItem.zi_product_details[0].points_price
    this.asPoint = getItem.as_points;
    this.canBuyWithZoodpay = getItem?.zoodpay_status || false;
    // Set all Data to Product
    getItem.discount = this.discount
    this.detailService.product = getItem;
    this.checkProductOnMyCart()
  }

  // Select Size
  selectSize(getSize: any) {
    this.productSize = getSize;
    this.price = getSize.price;
    this.point = getSize.points_price;
    this.quantity = getSize.quantity;
    this.checkProductOnMyCart();
  }

  // Open Shop Details
  openShop() {
    this.filterService.openShop({
      id: this.market.id,
    });
  }

  // Open Brand Details
  openBrand() {
    this.filterService.openBrand({
      id: this.brand.id,
      name: this.brand.name,
    });
  }

  // Get Rating
  avgRating: number = 0.0;
  countRating: number = 0;
  ratingRange: any = [
    { "rating": 5, "ratio": 0 },
    { "rating": 4, "ratio": 0 },
    { "rating": 3, "ratio": 0 },
    { "rating": 2, "ratio": 0 },
    { "rating": 1, "ratio": 0 },
  ];
  getRating(getId: string) {
    this.apiService.get(`get-total-rating/${getId}?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.avgRating = res.result.avg_rating.toFixed(1)
      this.countRating = res.result.count_reviews
      if (res.result.reviews_rate.length > 0) {
        this.ratingRange = res.result.reviews_rate
      } else {
        this.ratingRange = [
          { "rating": 5, "ratio": 0 },
          { "rating": 4, "ratio": 0 },
          { "rating": 3, "ratio": 0 },
          { "rating": 2, "ratio": 0 },
          { "rating": 1, "ratio": 0 },
        ]
      }
    })
  }

  // Open Reviews Modal
  async writeReview(isNew: boolean = true) {
    const modal = await this.modalCtrl.create({
      component: EditReviewComponent,
      componentProps: {
        productName: this.name,
        productId: this.productId,
        myReview: isNew ? null : this.myReviews[0],
        isNew: isNew,
      }
    },);
    modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.getRating(this.productId)
      this.getMyReviews(this.productId)
    }
  }
  // Get Reviews
  myReviews: any = [];
  getMyReviews(getId: string) {
    this.apiService.get(`get-my-review/${getId}/${this.profileService.userId()}?lang=${this.otherService.selected}&expand=reviewImage,user,reviewLiked,countLiked`).subscribe((res: any) => {
      this.myReviews = res.result
    })
  }
  // Delete My Reivew
  async deleteMyReview(getId) {
    this.translate.get(['delete', 'deleteQuestion', 'checkInternetConnection', 'no', 'yes']).subscribe(async (res: any) => {
      const alert = await this.alertController.create({
        header: res.delete,
        message: res.deleteQuestion,
        cssClass: 'custom-alert',
        buttons: [
          {
            text: res.no,
            role: 'cancel',
            cssClass: 'alert-button-black',
          },
          {
            text: res.yes,
            role: 'confirm',
            cssClass: 'alert-button-red',
            handler: () => {
              this.apiService.post(`delete-review?lang=${this.otherService.selected}`, { review_id: getId }).subscribe((res: any) => {
                this.getMyReviews(this.productId)
                this.getRating(this.productId)
              })
            },
          },
        ],
      });
      await alert.present();
    })
  }

  // Get Reviews
  reviews: any = [];
  getReviews(getId: string) {
    this.apiService.get(`get-review-with-limit/${getId}/${this.profileService.userId()}?lang=${this.otherService.selected}&expand=reviewImage,user,reviewLiked,countLiked`).subscribe((res: any) => {
      this.reviews = res.result
    })
  }
  // Like Review
  likeReview(getId: string) {
    let likeData = {
      review_id: getId,
      user_id: this.profileService.userId()
    }
    this.apiService.post(`liked-on-review?lang=${this.otherService.selected}`, likeData).subscribe((res: any) => {
      this.getReviews(this.productId);
    })
  }

  // Open Reviews Modal
  async openReviewsModal() {
    const modal = await this.modalCtrl.create({
      component: MoreReviewsComponent,
      componentProps: {
        productName: this.name,
        productId: this.productId,
        avgRating: this.avgRating,
        countRating: this.countRating,
        ratingRange: this.ratingRange,
        myReviews: this.myReviews,
      }
    },);
    modal.present();
  }

  // Open Zoom Image Modal
  async openZoomModal(base) {
    const modal = await this.modalCtrl.create({
      component: ZoomComponent,
      componentProps: {
        img: base
      }
    },);
    modal.present();
  }

  // Similar Products
  productSlidesOption = {
    initialSlide: 1,
    slidesPerView: window.innerWidth / 175,
  };
  similarProducts: any = []
  getSimilar(getId: string) {
    this.apiService.get(`products-by-one-category-without/${getId}?lang=${this.otherService.selected}&productId=${this.productId}&expand=product,market,currency,is_favorite,discount,product_details,countColorProductTrendyol,zi_product_details,countColorProducts`).subscribe((res: any) => {
      this.similarProducts = res.result;
    })
  }

  // Add Products to Cart
  addProductToCart() {
    let cart = []
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
    let market = cart.filter(x => x?.market?.id == this.market?.id) || []
    if (market.length > 0) {
      // If Shop on my card
      let products = market[0].products;
      let productId = products.filter(p => p.id == this.productId)
      if (productId.length < 1) {
        // If Product Didn't on my CART
        let product = this.detailService.product;
        let productPrice: any = this.detailService.product?.discount ? this.calcDiscount(this.price, this.detailService.product?.percentage || this.detailService.product?.discount?.percentage) : parseFloat(this.price)
        market[0].priceSum = parseFloat(market[0].priceSum) + parseFloat(productPrice);
        this.detailService.product.price = parseFloat(this.price);
        product.count = this.productCount;
        product.quantity = this.quantity;
        product.choose_size = this.productSize?.value || null
        product.choose_size_id = this.productSize?.id || null
        product.zi_color = this.productColor?.zi_color || null
        product.price = this.price
        product.point = this.point
        this.detailService.product.market_id = this.market.id
        market[0].products.push(this.detailService.product)
      } else {
        let productSize = products.filter(p => p.choose_size == this.productSize?.value && p.id == this.productId)
        let product = this.detailService.product;
        product.choose_size = this.productSize?.value || null
        product.choose_size_id = this.productSize?.id || null
        if (productSize.length < 1) {
          product.count = this.productCount;
          product.quantity = this.quantity;
          product.choose_size = this.productSize?.value || null
          product.choose_size_id = this.productSize?.id || null
          product.zi_color = this.productColor?.zi_color || null
          product.price = this.price
          product.point = this.point
          market[0].priceSum = parseFloat(market[0].priceSum) + parseFloat(this.price);
          product.market_id = this.market.id
          market[0].products.push(product)
        } else {
          this.productOnMyCart = true;
          this.alert.toast('productOnYorCart')
          return '';
        }
      }
    } else {
      // If first time add a shop Product
      let product: any = this.detailService.product
      product.market_id = this.market.id
      product.count = this.productCount;
      product.quantity = this.quantity;
      product.choose_size = this.productSize?.value || null
      product.choose_size_id = this.productSize?.id || null
      product.zi_color = this.productColor?.zi_color || null
      product.price = this.price
      product.point = this.point
      cart.push({
        market: this.market,
        products: [
          product
        ],
        priceSum: this.detailService.product?.discount ? this.calcDiscount(this.price, this.detailService.product?.percentage || this.detailService.product?.discount?.percentage) : this.price
      })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    setTimeout(() => {
      this.cartService.getData();
    }, 100);
    this.alert.toast('addToCartMessage')
  }

  // Open Cart Page
  buyNow() {
    this.addProductToCart();
    this.router.navigate(['/cart']);
  }

  // Check Produc On My Cart or Not?
  checkProductOnMyCart() {
    let cart = [];
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
    let market = cart.filter(x => x?.market?.id == this.market?.id) || []
    if (market.length > 0) {
      let products = market[0].products;
      let productId = products.filter(p => p.id == this.productId)
      if (productId.length > 0) {
        let productSize = products.filter(p => p.choose_size == this.productSize?.value && p.id == this.productId)
        let product = this.detailService.product;
        product.choose_size = this.productSize?.value || null
        if (productSize.length > 0) {
          this.productOnMyCart = true;
        } else {
          this.productOnMyCart = false;
        }
      } else {
        this.productOnMyCart = false;
      }
    } else {
      this.productOnMyCart = false;
    }
  }

  // Total Products Price for each Market
  sumPrice(getProducts: any): string {
    let sum = 0;
    getProducts.forEach(product => {
      if (product.discount) {
        let divide = 100 / parseInt(product.percentage);
        let percentage = parseInt(product.price) / divide;
        let result = parseInt(product.price) - percentage;
        sum += result * product.count
      } else {
        sum += product.price * product.count
      }
    });
    return sum.toString()
  }

  back() {
    window.history.back();
  }
}