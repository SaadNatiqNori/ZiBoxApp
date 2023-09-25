import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular'; // On Scrolling and Modal Controller
import { TranslateService } from '@ngx-translate/core';
import { IconsService } from "src/app/services/icons.service";
import { ApiService } from "src/app/services/api.service";
import { OtherService } from "src/app/services/other.service";
import { ProfileService } from "src/app/services/profile.service";
import { EditAddressComponent } from "./edit-address/edit-address.component";
import { Storage } from "@ionic/storage-angular";

@Component({
  selector: 'zi-my-addresses',
  templateUrl: './my-addresses.page.html',
  styleUrls: ['./my-addresses.page.scss'],
})
export class MyAddressesPage implements OnInit {

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
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.getData();
    try {
      this.storage.get('user-addresses').then(val => {
        if (val) { this.items = val }
      })
    } catch (error) { }
  }

  // Get Addresses
  getData() {
    this.isLoading = true;
    this.apiService.get(`user-addresses?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.isLoading = false;
      this.items = res.result;
      this.storage.set('my-addresses', res.result)
    }, err => {
      this.isLoading = false;
      console.log(err)
    })
  }

  // Delete Address
  deleteAddress(getItem: any) {
    this.translate.get(['delete', 'deleteQuestion', 'yes', 'no']).subscribe(async (res: any) => {
      // Sohw Alert
      const alert = await this.alertController.create({
        header: res.delete,
        subHeader: res.deleteQuestion,
        cssClass: 'custom-alert',
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
              this.apiService.delete(`user-addresses/delete/${getItem.id}?lang=${this.otherService.selected}`).subscribe((res: any) => {
                this.items.splice(this.items.indexOf(this.items), 1);
                this.getData();
              })
            },
          },
        ],
      });
      await alert.present();
    })
  }

  // Open Address Modal
  async openEditModal(isNew: boolean = true, getItem: any = {}) {
    const modal = await this.modalCtrl.create({
      component: EditAddressComponent,
      componentProps: {
        address: isNew ? null : getItem,
        isNew: isNew,
      }
    },);
    modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.getData()
    }
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
