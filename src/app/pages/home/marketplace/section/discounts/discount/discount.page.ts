import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { ActivatedRoute } from '@angular/router';

import { InfiniteScrollCustomEvent, IonContent } from '@ionic/angular'; // On Scrolling & Modal Controller

@Component({
  selector: 'zi-discount',
  templateUrl: './discount.page.html',
  styleUrls: ['./discount.page.scss'],
})
export class DiscountPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  discountName: string = 'Discount'
  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  currentPage: number = null;
  sort: string = "newly_arrived";

  constructor(
    private otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    public router: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getData();
    this.getDiscountName();
  }

  // Get All Discount Data
  getData(ev?) {
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.apiService.get(`discount-by-name/new?discountId=${this.router.snapshot.params.id}?page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&sort=${this.sort}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data.products);
      this.discountName = res.result.data.name || this.discountName;
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      this.currentPage = res.result._meta.currentPage;
      try {
        if ((content.clientHeight <= window.innerHeight) && (res.result._meta.pageCount != res.result._meta.currentPage)) {
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

  getDiscountName() {
    this.apiService.get(`discount-info/${this.router.snapshot.params.id}?page=${this.pageNumber}&lang=${this.otherService.selected}&expand=is_favorite,discount,currency,product_details,zi_product_details,countColorProducts&sort=${this.sort}`).subscribe((res: any) => {
      this.discountName = res.result.name
    }, (err) => { })
  }

  // Pull Down to Refresh
  handleRefresh(event) {
    this.pageNumber = 1;
    setTimeout(() => {
      this.getData();
    }, 100);
    setTimeout(() => {
      event.target.complete();
      this.items = [];
    }, 1000);
  };

  // On Scrolling
  onIonInfinite(ev) {
    if (this.pageCount != this.currentPage) {
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
