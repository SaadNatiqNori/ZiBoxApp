import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonContent, ModalController } from '@ionic/angular'; // On Scrolling & Modal Controller
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { FilterService } from '../filter.service';

@Component({
  selector: 'zi-brands',
  templateUrl: './brands.page.html',
  styleUrls: ['./brands.page.scss'],
})
export class MenuBrandsPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  ziBoxBrandsItems: any = [];
  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  ziBoxBrandsLoading: boolean = false;
  isLoading: boolean = false;
  // Search
  searchTimer: any;
  searchWord: string = '';

  constructor(
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    public filterService: FilterService,
  ) {
  }

  ngOnInit() {
    this.getZiBoxBrandsData();
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

  // Get ZiBox Brands
  getZiBoxBrandsData() {
    this.ziBoxBrandsLoading = true;
    this.apiService.get(`get-all-brands/new?is_exclusive=1`).subscribe((res: any) => {
      this.ziBoxBrandsItems = res.result;
      this.ziBoxBrandsLoading = false;
    }, (err) => {
      console.log(err)
      this.ziBoxBrandsLoading = false;
    })
  }

  // Get All Brands
  getData(ev?) {
    const content = document.getElementById('brandPanel') as HTMLDivElement;
    this.isLoading = true;
    this.apiService.get(`get-all-brands/new?page=${this.pageNumber}${this.searchWord ? '&search=' + this.searchWord : ''}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      this.isLoading = false;
      try {
        if ((content.clientHeight < window.innerHeight) && (this.pageNumber != this.pageCount + 1) && (this.items.length < res.result._meta.totalCount)) {
          this.getData();
        }
      } catch (error) { }
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    }, (err) => {
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Open Brand Details
  openBrand(brand) {
    this.filterService.openBrand(brand);
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
