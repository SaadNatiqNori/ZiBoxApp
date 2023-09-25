import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular'; // Modal Controller
import { IconsService } from "src/app/services/icons.service";
import { OtherService } from 'src/app/services/other.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ApiService } from "src/app/services/api.service";
import { DetailService } from 'src/app/services/details.service';

import { ReferAFriendComponent } from '../refer-a-friend/refer-a-friend.component';

import { InfiniteScrollCustomEvent } from '@ionic/angular'; // On Scrolling

@Component({
  selector: 'app-zi-credit',
  templateUrl: './zi-credit.page.html',
  styleUrls: ['./zi-credit.page.scss'],
})
export class ZiCreditPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  items: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;
  isLoading: boolean = false;
  minPoint: number = 0;
  maxPoint: number = 500;
  points: number = 0;

  constructor(
    private modalCtrl: ModalController,
    public icons: IconsService,
    private otherService: OtherService,
    public profileService: ProfileService,
    private apiService: ApiService,
    private detailService: DetailService,
  ) { }

  ngOnInit() {
    this.profileService.getProfile();
    this.getPoint();
    this.getData();
  }

  // Get User Points
  getPoint() {
    let circle = document.getElementById('circleValue') as HTMLDivElement;
    let angle: number = 0;
    let timer = setInterval(() => {
      circle.setAttribute("stroke-dasharray", angle + ", 20000");
      this.points = parseInt(((angle / 270) * this.maxPoint).toFixed(0));
      if (angle >= ((this.profileService.points() / this.maxPoint) * 270)) {
        this.points = this.profileService.points()
        clearInterval(timer);
      }
      angle += 1;
    }, 15);
  }

  // Get All Products Data
  getData(ev?) {
    this.isLoading = true;
    const content = document.getElementById('productPanel') as HTMLDivElement;
    this.apiService.get(`new-products?hasPoints=1&page=${this.pageNumber}&lang=${this.otherService.selected}&currencyId=${this.otherService.selectedCurrency}`).subscribe((res: any) => {
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

  // Open Referring Modal
  async openReferFriendModals() {
    const modal = await this.modalCtrl.create({
      component: ReferAFriendComponent
    },);
    modal.present();
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

  openProduct(product) {
    this.detailService.product = product;
    this.detailService.openProduct(product)
  }

  // Using for Back to top of Content from Parent Component
  backToTop() {
    this.content.scrollToTop(1500);
  }

}