import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; // Modal Controller
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from 'src/app/services/api.service';
import { IconsService } from 'src/app/services/icons.service';
import { ProfileService } from "src/app/services/profile.service";
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'zi-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.scss'],
})
export class EditReviewComponent implements OnInit {

  @Input() productId: string = null;
  @Input() productName: string = null;
  @Input() myReview: any;
  @Input() isNew: string = null;

  rating: number = 0;
  @Input() description: string = '';
  images: any = [];
  oldImages: any = [];
  isLoading: boolean = false;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    private alertController: AlertController, // Alert Controller
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    public profileService: ProfileService,
  ) { }

  ngOnInit() {
    if (!this.isNew) {
      this.rating = this.myReview.rating
      this.description = this.myReview.description;
      this.myReview.reviewImage.forEach(image => {
        this.images.push(image.image)
        this.oldImages.push(image.id)
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.images.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  deleteImage(getIndex: any) {
    this.images.splice(this.images.indexOf(getIndex), 1)
  }

  sendReview() {
    if (this.description == '') {
      this.showAlert({ status: 400 })
      return null;
    }
    let newData = {
      id: this.isNew ? '' : this.myReview.id,
      product_id: this.productId || '',
      rating: this.rating,
      description: this.description,
      images: this.images,
      oldImages: this.oldImages,
      user_id: this.profileService.userId(),
    }
    this.isLoading = true;
    this.apiService.post(`${this.isNew ? 'create-review' : 'update-review'}?lang=${this.otherService.selected}`, newData).subscribe((res: any) => {
      return this.modalCtrl.dismiss(null, 'confirm');
    }, err => {
      this.showAlert(err)
    })
  }

  showAlert(getError: any) {
    this.translate.get(['signup', 'raitingIsRequired', 'descriptionIsRequired', 'checkInternetConnection', 'ok']).subscribe(async (res: any) => {
      let message = '';
      if (getError?.status == 400) {
        message = res.descriptionIsRequired;
      } else {
        message = res.checkInternetConnection;
      }
      // Sohw Alert
      setTimeout(async () => {
        const alert = await this.alertController.create({
          header: res.signup,
          subHeader: message,
          cssClass: 'custom-alert',
          buttons: [
            {
              text: res.ok,
              cssClass: 'alert-button-confirm',
            },
          ],
        });
        await alert.present();
      }, 100);
    })
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
