import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { InfiniteScrollCustomEvent, IonContent, ModalController } from '@ionic/angular'; // On Scrolling & Modal Controller

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  isLoading: boolean = false;
  sort: string = "newly_arrived";

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
  ) {
  }

  ngOnInit() {
    this.getData();
  }
  
  // Get All Products Data
  getData(ev?) {
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.apiService.get(`new-products?page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&sort=${this.sort}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
      setTimeout(() => {
        if ((content.clientHeight < window.innerHeight) && (this.pageNumber != this.pageCount + 1) && (this.items.length < res.result._meta.totalCount)) {
          this.getData();
        }
      }, 100);
    }, (err) => {
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Filter All Products Data
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