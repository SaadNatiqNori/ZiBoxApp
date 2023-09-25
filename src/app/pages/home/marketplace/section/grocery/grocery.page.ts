import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { FilterService } from 'src/app/pages/filter/filter.service';
import { InfiniteScrollCustomEvent, IonContent, ModalController } from '@ionic/angular'; // On Scrolling & Modal Controller

@Component({
  selector: 'zi-grocery',
  templateUrl: './grocery.page.html',
  styleUrls: ['./grocery.page.scss'],
})
export class GroceryPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  categories: any = [];
  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  isLoading: boolean = false;
  sort: string = "newly_arrived";

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    private otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    private filterService: FilterService,
  ) {
  }

  ngOnInit() {
    this.getCategories();
    this.getData();
  }

  // Get Categories Data
  getCategories() {
    this.apiService.get(`category/471?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.categories = res.result.childrenCategories;
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

  // Get All Grocery Data
  getData(ev?) {
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.isLoading = true;
    this.apiService.get(`products?page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&expand=currency,is_favorite,discount,product_details,zi_product_details,countColorProductTrendyol,countColorProducts&category=471&sort=${this.sort}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result);
      this.pageNumber += 1;
      this.pageCount = res._meta.pageCount;
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
      setTimeout(() => {
        if ((content.clientHeight < window.innerHeight) && (res._meta.pageCount != res._meta.currentPage)) {
          this.getData();
        }
      }, 100);
    }, (err) => {
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Filter All Grocery Data
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
      this.items = [];
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
