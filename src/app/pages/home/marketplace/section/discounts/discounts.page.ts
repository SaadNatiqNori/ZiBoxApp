import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { FilterService } from 'src/app/pages/filter/filter.service';
import { InfiniteScrollCustomEvent, IonContent, ModalController } from '@ionic/angular'; // On Scrolling & Modal Controller

@Component({
  selector: 'zi-discounts',
  templateUrl: './discounts.page.html',
  styleUrls: ['./discounts.page.scss'],
})
export class DiscountsPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  discountSlidesOption = {
    initialSlide: 1,
    slidesPerView: window.innerWidth / 175,
    speed: 500,
    autoplay: {
      disableOnInteraction: true,
      delay: 1000,
    },
  };

  categories: any = [];
  topDealsDiscountItems: any = [];
  singleProviderDiscountItems: any = [];

  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  sort: string = "newly_arrived";

  discountByName: any = [];
  discountByNameLoading: boolean = true;

  constructor(
    private otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    private filterService: FilterService,
  ) {
    // let width = carousel.offsetWidth;
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
    });
  }

  ngOnInit() {
    this.getCategories();
    this.getDiscountByName();
    this.getData();
  }

  // Get Discount Categories Data
  getCategories() {
    this.apiService.get(`categories-with-discount?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.categories = res.result;
    }, (err) => {
      console.log(err)
    })
  }
  // Open Category
  openCategory(item: any) {
    this.filterService.openCatgeory({
      id: item.id,
      name: item.name
    })
  }

  // Get Top Deals Discount Data
  getDiscountByName() {
    this.apiService.get(`discount-by-name/new?lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&limit=14&product=true`).subscribe((res: any) => {
      this.discountByName = res.result;
      this.discountByNameLoading = false;
    }, (err) => {
      console.log(err)
      this.discountByNameLoading = false;
    })
  }

  // Get All Discount Data
  getData(ev?) {
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.apiService.get(`new-products?page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&limit=24&hasDiscount=1&sort=${this.sort}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      try {
        if ((content.clientHeight < window.innerHeight) && (this.pageNumber != this.pageCount + 1) && (this.items.length < res.result._meta.totalCount)) {
          this.getData();
        }
      } catch (error) { }
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    }, (err) => {
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Filter Discount Data
  filter(sort: string) {
    this.sort = sort;
    this.pageNumber = 1;
    this.items = [];
    this.getData();
  }

  // Pull Down to Refresh
  handleRefresh(event) {
    this.pageNumber = 1;
    setTimeout(() => {
      this.getDiscountByName();
      this.getData();
    }, 100);
    setTimeout(() => {
      event.target.complete();
      this.discountByNameLoading = true;
      this.discountByName = [];
      this.items = [];
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

}
