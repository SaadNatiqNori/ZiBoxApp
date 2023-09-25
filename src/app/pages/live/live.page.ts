import { Component, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from "src/app/services/api.service";

import { InfiniteScrollCustomEvent, IonContent } from '@ionic/angular'; // On Scrolling

@Component({
  selector: 'zi-live',
  templateUrl: 'live.page.html',
  styleUrls: ['live.page.scss']
})
export class LivePage {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;

  constructor(
    private otherService: OtherService,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.getData();
  }

  // Get All Products Data
  getData(ev?) {
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.apiService.get(`products-has-videos?page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&expand=currency,is_favorite,discount,product_details,countColorProductTrendyol,zi_product_details,countColorProducts`).subscribe((res: any) => {
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
