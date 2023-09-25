import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonContent, ModalController, AlertController } from '@ionic/angular'; // On Scrolling and Modal Controller
import { TranslateService } from '@ngx-translate/core';
import { IconsService } from "src/app/services/icons.service";
import { ApiService } from "src/app/services/api.service";
import { OtherService } from "src/app/services/other.service";
import { ProfileService } from "src/app/services/profile.service";
import { ZoomComponent } from "src/app/shared/zoom/zoom.component";
import { EditReviewComponent } from "src/app/shared/more-reviews/edit-review/edit-review.component";

@Component({
  selector: 'zi-my-reviews',
  templateUrl: './my-reviews.page.html',
  styleUrls: ['./my-reviews.page.scss'],
})
export class MyReviewsPage implements OnInit {

  // Using for Back to top Content
  @ViewChild(IonContent, { static: false }) content: IonContent;

  pageNumber: number = 1;
  pageCount: number = 1;
  items = [];
  isLoading: boolean = false;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    private alertController: AlertController, // Alert Controller
    public icons: IconsService,
    public apiService: ApiService,
    public otherService: OtherService,
    public profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.getData()
  }

  getData(ev?) {
    this.isLoading = true;
    this.apiService.get(`profile/get-my-reviews?lang=${this.otherService.selected}&expand=product,reviewImage,reviewLiked,countLiked`).subscribe((res: any) => {
      this.items = res.result;
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    }, (err) => {
      this.isLoading = false;
      try { (ev as InfiniteScrollCustomEvent).target.complete(); } catch { }
    })
  }

  // Open Reviews Modal
  async writeReview(getItem) {
    const modal = await this.modalCtrl.create({
      component: EditReviewComponent,
      componentProps: {
        productName: getItem.product.title,
        productId: getItem.product.id,
        myReview: getItem,
        isNew: false,
      }
    },);
    modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.getData()
    }
  }
  // Delete My Reivew
  async deleteMyReview(getItem) {
    this.translate.get(['delete', 'deleteQuestion', 'checkInternetConnection', 'no', 'yes']).subscribe(async (res: any) => {
      const alert = await this.alertController.create({
        header: res.delete,
        cssClass: 'custom-alert',
        message: res.deleteQuestion,
        buttons: [
          {
            text: res.no,
            role: 'cancel',
            cssClass: 'alert-button-black',
          },
          {
            text: res.yes,
            role: 'confirm',
            cssClass: 'alert-button-red',
            handler: () => {
              this.apiService.post(`delete-review?lang=${this.otherService.selected}`, { review_id: getItem.id }).subscribe((res: any) => {
                this.items.splice(this.items.indexOf(getItem), 1)
              })
            },
          },
        ],
      });
      await alert.present();
    })
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

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
