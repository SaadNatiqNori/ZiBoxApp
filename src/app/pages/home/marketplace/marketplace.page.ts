import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { TranslateService } from '@ngx-translate/core';
import { DetailService } from "src/app/services/details.service";
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent, IonContent } from '@ionic/angular'; // On Scrolling & Modal Controller
import { FilterService } from '../../filter/filter.service';

@Component({
  selector: 'zi-marketplace',
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.scss'],
})
export class MarketplacePage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  // Slider Options
  slideOption = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 1000,
    autoplay: {
      disableOnInteraction: false,
      delay: 4000,
    },
  };
  showSlide: boolean = true;
  discountSlidesOption = {
    initialSlide: 0,
    slidesPerView: window.innerWidth / 175,
    speed: 500,
    autoplay: {
      disableOnInteraction: true,
      delay: 1000,
    },
  };
  productSlidesOption = {
    initialSlide: 0,
    slidesPerView: window.innerWidth / 175,
  };
  specialEventSlidesOption = {
    initialSlide: 0,
    slidesPerView: window.innerWidth / 175,
  };
  // Array & Boolean Variables
  slideshowItems: any = [];
  brandsItem: any = [];
  specialEventItems: any = {
    id: null,
    collection_name: null,
    collection_image: null,
    collection_first_color: null,
    collection_second_color: null,
    products: []
  };
  newestItems: any = [];
  newlyLoading: boolean = false;
  pointItems: any = [];
  pointLoading: boolean = false;
  banarItems: any = [];
  banarLoading: boolean = false;
  categories: any = [];
  discountItems: any = [];
  discountLoading: boolean = false;
  fashionItems: any = [];
  fashionLoading: boolean = false;
  specialBoxItems: any = [];
  specialBoxLoading: boolean = false;
  foodItems: any = [];
  foodLoading: boolean = false;
  marketItems: any = [];
  marketLoading: boolean = false;
  productItems: any = [];
  productLoading: boolean = false;
  pageNumber: number = 1;
  pageCount: number = 1;

  constructor(
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    private translate: TranslateService,
    public detailService: DetailService,
    public filterService: FilterService,
    private router: Router,
  ) {
    window.addEventListener("resize", e => {
      this.discountSlidesOption = {
        initialSlide: 1,
        slidesPerView: window.innerWidth / 175,
        speed: 500,
        autoplay: {
          disableOnInteraction: true,
          delay: 1000,
        },
      };
      this.productSlidesOption = {
        initialSlide: 1,
        slidesPerView: window.innerWidth / 175,
      };
      this.specialEventSlidesOption = {
        initialSlide: 1,
        slidesPerView: window.innerWidth / 175,
      }
      this.showSlide = false;
      setTimeout(() => {
        this.showSlide = true;
      }, 10);
    });
  }

  ngOnInit() {
    this.getSlideshow();
    this.getBrandsData();
    this.getNewestData();
    this.getPointData();
    this.getSpecialEventData();
    this.getBanar();
    this.getCategoriesData();
    this.getDiscountData();
    this.getFashionData();
    this.getSpecialBoxData();
    this.getFoodData();
    this.getMarketData();
    this.getProductsData();
  }

  // Open Search
  openSearch(value) {
    // this.showSearch = value;
    let search = document.getElementById('search') as HTMLInputElement;
    if (value) {
      // this.menuNavbar.classList.add('hide-search')
      search.focus();
    } else {
      // this.menuNavbar.classList.remove('hide-search')
    }
  }

  // Get Slideshow
  getSlideshow() {
    this.apiService.get(`sliders/get-slides-by-id/1?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.slideshowItems = res.result.slides;
    })
  }
  // Click on Slideshow Sildes
  clickOnSlide(item) {
    if (item.market_id != null) {
      this.filterService.openShop({
        id: item.market_id,
        title: item.market.title,
      })
    } else if (item.brand_id != null) {
      this.filterService.openBrand({
        id: item.brand_id,
        name: item.brand.name
      })
    } else if (item.category_id != null) {
      this.filterService.openCatgeory({
        id: item.category_id,
        name: item.category.title
      })
    } else if (item.discount_id != null) {
      this.router.navigate([`home/marketplace/discounts`, item.discount_id]);
    } else if (item.product_id != null) {
      this.detailService.openProduct({
        id: item.product_id,
        thumb: item.image_path,
        zi_product_details: []
      });
    } else if (item.url != null) {
      this.router.navigate([`product/${item.url}`]);
    } else {

    }
  }

  // Get Brands
  getBrandsData() {
    this.apiService.get(`get-popular-brands?is_popular=true&lang=`).subscribe((res: any) => {
      this.brandsItem = res.result;
    }, (err) => {
      console.log(err)
    })
  }
  // Open Brands Page
  openBrands() {
    this.filterService.openBrands();
  }
  // Open Brand Details
  openBrand(brand) {
    this.filterService.name = brand.name;
    this.filterService.openBrand(brand);
  }

  // Get Special Event Data
  getSpecialEventData() {
    this.newlyLoading = true;
    this.apiService.get(`collection/get-collection-products/1?lang=${this.otherService.selected}&currencyId=4&position=swiper&limit=6&expand=products,products.currency,products.is_favorite,products.discount,products.product_details,products.zi_product_details,products.countColorProducts`).subscribe((res: any) => {
      this.specialEventItems = res.result;
      this.newlyLoading = false;
    }, err => {
      this.newlyLoading = false;
    })
  }

  // Get Newly Arrived Data
  getNewestData() {
    this.newlyLoading = true;
    this.apiService.get(`new-products?lang=${this.otherService.selected}&sort=newly_arrived`).subscribe((res: any) => {
      this.newestItems = res.result.data;
      this.newlyLoading = false;
    }, err => {
      this.newlyLoading = false;
    })
  }

  // Point Products
  getPointData() {
    this.pointLoading = true;
    this.apiService.get(`new-products?lang=${this.otherService.selected}&hasPoints=1`).subscribe((res: any) => {
      this.pointItems = res.result.data;
      this.pointLoading = false;
    }, err => {
      this.pointLoading = false;
    })
  }

  // Special Banar
  getBanar() {
    this.banarLoading = true;
    this.apiService.get(`sliders/get-slides-by-id/3?lang=${this.otherService.selected}&sort=asc`).subscribe((res: any) => {
      this.banarLoading = false;
      this.banarItems = res.result.slides;
    }, (err) => {
      this.banarLoading = false;
    })
  }
  // Click on Banar Sildes
  clickOnBanar(item) {
    if (item.market_id != null) {
      this.filterService.openShop({
        id: item.market_id,
        title: item.market.title,
      })
    } else if (item.brand_id != null) {
      this.filterService.openBrand({
        id: item.brand_id,
        name: item.brand.name
      })
    } else if (item.category_id != null) {
      this.filterService.openCatgeory({
        id: item.category_id,
        name: item.category.title
      })
    } else if (item.discount_id != null) {
      this.router.navigate([`home/marketplace/discounts`, item.discount_id]);
    } else if (item.product_id != null) {
      this.detailService.openProduct({ id: item.product_id });
    } else if (item.url != null) {
      this.router.navigate([`product/${item.url}`]);
    } else {

    }
  }

  // Get Categories Data
  getCategoriesData() {
    this.apiService.get(`top-categories/mobile?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.categories = res.result;
    }, (err) => {
      console.log(err)
    })
  }
  // Open Categories Page
  openCategories() {
    this.filterService.openCatgeories()
  }
  // Open Category Details
  openCategory(category: any) {
    this.filterService.name = category.title;
    this.filterService.openCatgeory(category);
  }

  // Get Discount Data
  getDiscountData() {
    this.discountLoading = true;
    this.apiService.get(`new-products?lang=${this.otherService.selected}&limit=14&hasDiscount=1&sort`).subscribe((res: any) => {
      this.discountItems = res.result.data;
      this.discountLoading = false;
    }, err => {
      this.discountLoading = false;
    })
  }

  // Get Fashion Data
  getFashionData() {
    this.fashionLoading = true;
    this.apiService.get(`fashion-products/new?lang=${this.otherService.selected}&expand=currency,is_favorite,discount,product_details,zi_product_details,countColorProducts,category`).subscribe((res: any) => {
      this.fashionItems = res.result.data;
      this.fashionLoading = false;
    }, err => {
      this.fashionLoading = false;
    })
  }

  // Get Special Box Data
  getSpecialBoxData() {
    this.specialBoxLoading = true;
    this.apiService.get(`special-products?lang=${this.otherService.selected}&expand=currency,is_favorite,discount,product_details,zi_product_details,countColorProducts,category`).subscribe((res: any) => {
      this.specialBoxItems = res.result
      this.specialBoxLoading = false;
    }, err => {
      this.specialBoxLoading = false;
    })
  }

  // Get Food Data
  getFoodData() {
    this.foodLoading = true;
    this.apiService.get(`new-products?categoryId=471&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}`).subscribe((res: any) => {
      this.foodItems = res.result.data;
      this.foodLoading = false;
    }, (err) => {
      this.foodLoading = false;
    })
  }

  // Get Market Data
  getMarketData() {
    this.marketLoading = true;
    this.apiService.get(`market/get-all-markets?page=1&lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.marketItems = res.result;
      this.marketLoading = false;
    }, (err) => {
      this.marketLoading = false;
    })
  }
  openShops() {
    this.filterService.openShops()
  }
  openShop(shop) {
    this.filterService.name = shop.title;
    this.filterService.openShop(shop);
  }

  // Get Products Data
  getProductsData(ev?) {
    this.productLoading = true;
    this.apiService.get(`new-products?lang=${this.otherService.selected}&page=${this.pageNumber}&currencyId=${this.otherService.selectedCurrency}`).subscribe((res: any) => {
      this.productItems = this.productItems.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
      this.productLoading = false;
    }, (err) => {
      this.productLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // On Scrolling
  onIonInfinite(ev) {
    if (this.pageCount >= this.pageNumber) {
      this.getProductsData(ev);
    } else {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
  }

  // Pull Down to Refresh
  handleRefresh(event) {
    this.getNewestData();
    this.getFashionData();
    this.getDiscountData();
    this.getSpecialBoxData();
    this.getFoodData();
    this.getProductsData();
    setTimeout(() => {
      this.newestItems = [];
      this.fashionItems = [];
      this.discountItems = [];
      this.specialBoxItems = [];
      this.foodItems = [];
      this.productItems = [];
    }, 200);
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  };

  // Using for Back to top of Content from Parent Component
  backToTop() {
    this.content.scrollToTop(1500);
  }

}