import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular'; // Modal Controller
import { IconsService } from "src/app/services/icons.service";
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from "src/app/services/api.service";
import { DetailService } from 'src/app/services/details.service';

import { InfiniteScrollCustomEvent } from '@ionic/angular'; // On Scrolling
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-special-event',
  templateUrl: './special-event.page.html',
  styleUrls: ['./special-event.page.scss'],
})
export class SpecialEventPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;
  name: string = '';

  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  currentPage: number = null;
  perPage: number = 1;
  isLoading: boolean = true;
  sort: string = "newly_arrived";

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    public activatedRoute: ActivatedRoute,
    public icons: IconsService,
    private otherService: OtherService,
    private apiService: ApiService,
    private detailService: DetailService,
  ) {

  }

  ngOnInit() {
    this.getName()
    this.getData();
  }

  // Get Special Event Name
  getName() {
    this.apiService.get(`collection/get-collection-products/1?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.name = res.result.collection_name;
    })
  }

  // Get Brand Data
  getData(ev?) {
    this.isLoading = true;
    this.apiService.get(`collection/get-collection-products/1?&page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&position=full&limit=6&expand=products,currency,is_favorite,discount,product_details,zi_product_details,countColorProducts&sort=${this.sort}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      this.currentPage = res.result._meta.currentPage;
      this.perPage = res.result._meta.perPage;
      this.isLoading = false;
      const content = document.getElementById('productPanel') as HTMLDivElement;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
      setTimeout(() => {
        if ((content.clientHeight < window.innerHeight) && (res.result._meta.pageCount != res.result._meta.currentPage)) {
          this.getData();
        }
      }, 100);
    }, (err) => {
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Filter Brand Data
  filter(sort: string) {
    this.sort = sort;
    this.pageNumber = 1;
    this.items = [];
    this.getData();
  }

  // Pull Down to Refresh
  handleRefresh(event) {
    this.isLoading = true;
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

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
