import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { InfiniteScrollCustomEvent, IonContent, ModalController } from '@ionic/angular'; // On Scrolling & Modal Controller
import { FilterService } from '../filter.service';

@Component({
  selector: 'zi-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})
export class ShopsPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  isLoading: boolean = false;
  // Search
  searchTimer: any;
  searchWord: string = '';

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    public filterService: FilterService,
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  // On Search
  onSearch() {
    this.isLoading = true;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.pageNumber = 1;
      this.items = [];
      this.getData();
    }, 300);
  }

  // Get All Market Data
  getData(ev?) {
    const content = document.getElementById('shopPanel') as HTMLDivElement;
    this.isLoading = true;
    this.apiService.get(`market/get-all-markets?page=${this.pageNumber}&lang=${this.otherService.selected}${this.searchWord ? '&search=' + this.searchWord : ''}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result);
      this.pageNumber += 1;
      this.pageCount = res._meta.pageCount;
      this.isLoading = false;
      try {
        if ((content.clientHeight < window.innerHeight) && (this.pageNumber != this.pageCount + 1) && (this.items.length < res._meta.totalCount)) {
          this.getData();
        }
      } catch (error) { }
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    }, (err) => {
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Open Shop Details
  openShop(shop) {
    this.filterService.openShop(shop);
  }

  // Pull Down to Refresh
  handleRefresh(event) {
    this.pageNumber = 1;
    this.items = [];
    setTimeout(() => {
      this.getData();
    }, 100);
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

}
