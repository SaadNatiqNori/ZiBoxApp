import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from 'src/app/services/api.service';
import { IconsService } from 'src/app/services/icons.service';
import { ProfileService } from "src/app/services/profile.service";
import { ZoomComponent } from "src/app/shared/zoom/zoom.component";
import { InfiniteScrollCustomEvent, IonContent, ModalController } from '@ionic/angular'; // Modal Controller

@Component({
  selector: 'app-more-reviews',
  templateUrl: './more-reviews.component.html',
  styleUrls: ['./more-reviews.component.scss'],
})
export class MoreReviewsComponent implements OnInit {

  // Using for Back to top Content
  @ViewChild(IonContent, { static: false }) content: IonContent;

  @Input() productId: string = null;
  @Input() productName: string = null;
  @Input() avgRating: string = null;
  @Input() countRating: string = null;
  @Input() ratingRange: any = [];

  reviews: any = [];
  pageNumber: number = 1;
  pageCount: number = 1;

  constructor(
    public modalCtrl: ModalController, // Modal Controller
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    public profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(ev?) {
    this.apiService.get(`get-all-review/${this.productId}/0?page=${this.pageNumber}&lang=${this.otherService.selected}&expand=reviewImage,user,reviewLiked,countLiked`).subscribe((res: any) => {
      this.reviews = this.reviews.concat(res.result);
      this.pageNumber += 1;
      this.pageCount = res._meta.pageCount;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    }, (err) => {
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Like Review
  likeReview(getId: string) {
    let likeData = {
      review_id: getId,
      user_id: this.profileService.userId()
    }
    this.apiService.post(`liked-on-review?lang=${this.otherService.selected}`, likeData).subscribe((res: any) => { })
  }

  // Open Zoom Image Modal
  async openZoomModal(base) {
    const modal = await this.modalCtrl.create({
      component: ZoomComponent,
      componentProps: {
        img: base
      }
    },);
    modal.present();
  }

  // Pull Down to Refresh
  handleRefresh(event) {
    this.pageNumber = 1;
    setTimeout(() => {
      this.reviews = [];
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

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
