import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { InfiniteScrollCustomEvent, IonContent, ModalController } from '@ionic/angular'; // On Scrolling & Modal Controller
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'zi-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})
export class SearchResultPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  totalCount: number = 0;
  isLoading: boolean = false;
  searchText: string = '';
  resultCount: string = '0';
  sort: string = "newly_arrived";

  constructor(
    public router: ActivatedRoute,
    private otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
  ) {
  }

  ngOnInit() {
    this.getData();
    this.searchText = this.router.snapshot.params.search.split("?")[0];
  }

  // Get Search Data Found
  getData(ev?) {
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.isLoading = true;
    this.apiService.get(`new-products?search=${this.router.snapshot.params.search.split("?")[0].replaceAll('|||', '/')}&page=${this.pageNumber}&lang=${this.router.snapshot.params.search.split("?")[1].replaceAll('language=', '')}&currencyId=${this.otherService.selectedCurrency}&sort=${this.sort}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      this.totalCount = res.result._meta.totalCount;
      this.resultCount = this.otherService.comma(res.result._meta.totalCount);
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

  // Filter Brand Data
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

  back() {
    window.history.back();
  }

}
