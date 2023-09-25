import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { FilterService } from 'src/app/pages/filter/filter.service';
import { InfiniteScrollCustomEvent, IonContent, ModalController } from '@ionic/angular'; // On Scrolling & Modal Controller
import { FashionFilterComponent } from "./modal/fashion-filter/fashion-filter.component";

@Component({
  selector: 'zi-fashion',
  templateUrl: './fashion.page.html',
  styleUrls: ['./fashion.page.scss'],
})
export class FashionPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  isLoading: boolean = false;
  categoriesIsLoading: boolean = false;

  gender: string = '';
  categories: string = '';
  subCategories: any = [];
  sizes: string = '';
  price: string = '';

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    private otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    private filterService: FilterService,
  ) {
  }

  ngOnInit() {
    this.getData();
    this.getSubCategories();
  }

  // Get All Fashion Data
  getData(ev?) {
    this.isLoading = true;
    this.apiService.get(`trendyol-products?page=${this.pageNumber}&lang=${this.otherService.selected}&expand=currency,is_favorite,discount,product_details,zi_product_details,countColorProductTrendyol,countColorProducts,category&gender=${this.gender}&sizes=${this.sizes}&rangePrice=${this.price}&categories=${this.categories}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result);
      this.pageNumber += 1;
      this.pageCount = res._meta.pageCount;
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
      const content = document.getElementById('productPanel') as HTMLDivElement;
      setTimeout(() => {
        if ((content.clientHeight < window.innerHeight) && (this.pageNumber != this.pageCount + 1) && (this.items.length < res._meta.totalCount)) {
          this.getData();
        }
      }, 100);
    }, (err) => {
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Get Sub Categories
  getSubCategories() {
    this.categoriesIsLoading = true;
    this.apiService.get(`category/81?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.categoriesIsLoading = false;
      this.subCategories = res.result.childrenCategories;
    })
  }
  // Open Category
  openCategory(item: any) {
    this.filterService.openCatgeory({
      id: item.id,
      name: item.name
    })
  }

  async openFashionFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FashionFilterComponent,
      componentProps: {
        gender: this.gender,
        categories: this.categories,
        sizes: this.sizes,
        price: this.price,
      }
    },);
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.pageNumber = 1;
      this.items = [];
      this.gender = data.gender.toString();
      this.categories = data.categories;
      this.sizes = data.sizes;
      this.price = data.price;
      this.getData();
    } else if (role === 'clear') {
      this.pageNumber = 1;
      this.items = [];
      this.gender = '';
      this.categories = '';
      this.sizes = '';
      this.price = '';
      this.getData();
    }
  }

  // Pull Down to Refresh
  handleRefresh(event) {
    this.pageNumber = 1;
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
