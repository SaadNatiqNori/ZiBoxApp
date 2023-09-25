import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; // Modal Controller
import { IconsService } from "src/app/services/icons.service";
import { ShowInformationPage } from "./show-information/show-information.page";

@Component({
  selector: 'app-legal-information',
  templateUrl: './legal-information.page.html',
  styleUrls: ['./legal-information.page.scss'],
})
export class LegalInformationPage implements OnInit {

  list: any = ['privacy', 'termsOfUse', 'sellerContract', 'sellOnZibox', 'saftyTips']

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    public icons: IconsService,
  ) { }

  ngOnInit() {
  }
  
  async openLegalInformationModals(getTitle){
    const modal = await this.modalCtrl.create({
      component: ShowInformationPage,
      componentProps: {
        title : getTitle
      }
    },);
    modal.present();
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
