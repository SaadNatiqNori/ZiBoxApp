import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular'; // Modal Controller
import { IconsService } from "src/app/services/icons.service";
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from "src/app/services/api.service";

import { InfiniteScrollCustomEvent } from '@ionic/angular'; // On Scrolling
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '../../filter.service';

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.page.html',
  styleUrls: ['./brand-details.page.scss'],
})
export class BrandDetailsPage implements OnInit {

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
    public router: ActivatedRoute,
    public icons: IconsService,
    private otherService: OtherService,
    private apiService: ApiService,
    public filterService: FilterService,
  ) {
    this.name = filterService.name;
  }

  ngOnInit() {
    this.getData();
  }

  // Get Brand Data
  getData(ev?) {
    this.isLoading = true;
    this.apiService.get(`new-products?brandId=${this.router.snapshot.params.id}&page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}&sort=${this.sort}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      this.currentPage = res.result._meta.currentPage;
      this.perPage = res.result._meta.perPage;
      this.isLoading = false;
      const content = document.getElementById('productPanel') as HTMLDivElement;
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

  back() {
    window.history.back();
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
