import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; // Modal Controller
import { IconsService } from "src/app/services/icons.service";
import { ShowInformationPage } from '../legal-information/show-information/show-information.page';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  helps: any = ['shippingAndDelivery', 'returnsAndReplacements', 'faq']
  abuot: any = ['careers', 'aboutZibox']

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
