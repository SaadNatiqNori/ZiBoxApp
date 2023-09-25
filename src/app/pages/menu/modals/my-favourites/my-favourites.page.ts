import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular'; // Modal Controller
import { IconsService } from "src/app/services/icons.service";
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from "src/app/services/api.service";

import { InfiniteScrollCustomEvent } from '@ionic/angular'; // On Scrolling

@Component({
  selector: 'zi-my-favourites',
  templateUrl: './my-favourites.page.html',
  styleUrls: ['./my-favourites.page.scss'],
})
export class MyFavouritesPage implements OnInit {

  // Using for Back to top Content
  @ViewChild(IonContent, { static: false }) content: IonContent;

  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  isLoading: boolean = false;

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    public icons: IconsService,
    private otherService: OtherService,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(ev?) {
    this.isLoading = true;
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.apiService.get(`my-favorites/new?page=${this.pageNumber}&lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.items = this.items.concat(res.result.data);
      this.pageNumber += 1;
      this.pageCount = res.result._meta.pageCount;
      try {
        if ((content.clientHeight < window.innerHeight) && (this.pageNumber != this.pageCount + 1) && (this.items.length < res.result._meta.totalCount)) {
          this.getData();
        }
      } catch (error) { }
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
      this.isLoading = false;
    }, (err) => {
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
      this.isLoading = false;
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

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
