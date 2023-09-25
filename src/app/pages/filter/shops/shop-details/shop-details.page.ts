import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from 'src/app/services/api.service';
import { IconsService } from 'src/app/services/icons.service';
import { ProfileService } from "src/app/services/profile.service";
import { InfiniteScrollCustomEvent, IonContent, ModalController } from '@ionic/angular'; // Modal Controller
import { DetailService } from 'src/app/services/details.service';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../filter.service';
// import { CategoryService } from '../../categories/category.service';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.page.html',
  styleUrls: ['./shop-details.page.scss'],
})
export class ShopDetailsPage implements OnInit {

  // Using for Back to top Content
  @ViewChild(IonContent, { static: false }) content: IonContent;
  marketId: string = '';
  market: any = {
    stats: { total: 0 },
    ctime: null,
  };

  products: string = '0';
  visitors: string = null;
  registerd: string = null;

  isLoading: boolean = false;
  marketCoupons: any = null;
  categories: any = [];
  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  currentPage: number = null;
  sort: string = "newly_arrived";

  constructor(
    public otherService: OtherService,
    public activatedRoute: ActivatedRoute,
    public icons: IconsService,
    private apiService: ApiService,
    public profileService: ProfileService,
    public filterService: FilterService,
    public modalCtrl: ModalController, // Modal Controller
    private detailService: DetailService,
  ) {
    this.marketId = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit() {
    this.getData();
    this.market = this.detailService.market;
    this.visitors = this.market?.stats?.total || 0;
    this.registerd = this.market?.ctime?.split(' ')[0] || '0000-00-00';
    this.getMarketInfo();
    this.getMarketCoupons(this.marketId)
    this.getMarketCategories();
  }

  // Market Information
  getMarketInfo() {
    this.apiService.get(`market/${this.marketId}?expand=coupon&lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.market = res.result;
      this.products = res.result.productCount;
      this.visitors = res.result.stats.total;
      this.registerd = res.result.ctime.split(' ')[0];
    })
  }

  // Get Coupons of Market
  getMarketCoupons(getId) {
    this.apiService.get(`coupon-by-condition/4/${getId}`).subscribe((res: any) => {
      this.marketCoupons = res.result;
    })
  }

  // Get Categories by Market
  getMarketCategories() {
    this.apiService.get(`categories-by-market/${this.marketId}?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.categories = res.result;
    })
  }
  // Open Category
  openCategory(getItem: any) {
    this.filterService.name = getItem.name;
    this.filterService.openCatgeory(getItem)
  }

  // Get Market Product Data
  getData(ev?) {
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.isLoading = true;
    this.apiService.get(`new-products?marketId=${this.marketId}&page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&sort=${this.sort}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      this.currentPage = res.result._meta.currentPage;
      this.isLoading = false;
      try {
        if ((content.clientHeight <= window.innerHeight) && (res.result._meta.pageCount != res.result._meta.currentPage)) {
          this.getData();
        }
      } catch (error) { }
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    }, (err) => {
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Filter Market Product Data
  filter(sort: string) {
    this.sort = sort;
    this.pageNumber = 1;
    this.items = [];
    this.getData();
  }

  // Pull Down to Refresh
  handleRefresh(event) {
    this.pageNumber = 1;
    this.items = [];
    this.getData();
    this.getMarketInfo();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  };

  // On Scrolling
  onIonInfinite(ev) {
    if (this.pageCount >= this.pageNumber) {
      this.getData(ev);
    } else {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }
  }

  // Using for Back to top of Content from Parent Component
  backToTop() {
    this.content.scrollToTop(1500);
  }

  back() {
    window.history.back();
  }

}
