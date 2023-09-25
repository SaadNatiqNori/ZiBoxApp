import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular'; // Modal Controller
import { IconsService } from "src/app/services/icons.service";
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from "src/app/services/api.service";
// import { CategoryService } from "../../../home/marketplace/section/categories/category.service";
import { FilterService } from '../../filter.service';
import { ActivatedRoute } from '@angular/router';

import { InfiniteScrollCustomEvent } from '@ionic/angular'; // On Scrolling

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.page.html',
  styleUrls: ['./category-details.page.scss'],
})
export class CategoryDetailsPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  name: string = '';
  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  currentPage: number = null;
  isLoading: boolean = false;
  categoriesLoading: boolean = false;
  subCategories: any = [];
  sort: string = "newly_arrived";

  constructor(
    public icons: IconsService,
    public router: ActivatedRoute,
    private otherService: OtherService,
    private apiService: ApiService,
    public filterService: FilterService,
  ) {
    this.name = filterService.name;
  }

  ngOnInit() {
    this.getData();
    this.getSubCategories();
  }

  // Category Data
  getData(ev?) {
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.isLoading = true;
    this.apiService.get(`new-products?categoryId=${this.router.snapshot.params.id}&page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&sort=${this.sort}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      this.currentPage = res.result._meta.currentPage;
      this.isLoading = false;
      try {
        if ((content.clientHeight < window.innerHeight) && (res.result._meta.pageCount != res.result._meta.currentPage) && res.result.data.length !== 0) {
          this.getData();
        }
      } catch (error) { }
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    }, (err) => {
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Filter Category Data
  filter(sort: string) {
    this.sort = sort;
    this.pageNumber = 1;
    this.items = [];
    this.getData();
  }

  // Get Sub Categories
  getSubCategories() {
    this.categoriesLoading = true;
    this.apiService.get(`category/view-sub-category/${this.router.snapshot.params.id}?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.categoriesLoading = false;
      this.subCategories = res.result.childrenCategories;
    }, err => {
      this.categoriesLoading = false;
    })
  }
  // Open Category
  openCategory(item: any) {
    this.filterService.openCatgeory(item)
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

  back() {
    window.history.back();
  }

}
