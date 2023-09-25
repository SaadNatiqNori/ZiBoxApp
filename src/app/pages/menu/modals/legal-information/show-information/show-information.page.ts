import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; // Modal Controller
import { IconsService } from "src/app/services/icons.service";
import { ApiService } from "src/app/services/api.service";
import { OtherService } from "src/app/services/other.service";

enum documentText {
  privacy = 1,
  termsOfUse = 2,
  sellerContract = 3,
  saftyTips = 4,
  faq = 5,
  sellOnZibox = 6,
  shippingAndDelivery = 7,
  returnsAndReplacements = 8,
  careers = 9,
  aboutZibox = 10,
}


@Component({
  selector: 'app-show-information',
  templateUrl: './show-information.page.html',
  styleUrls: ['./show-information.page.scss'],
})
export class ShowInformationPage implements OnInit {

  @Input() title: string = '';
  html: string = null;

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    public icons: IconsService,
    private apiService: ApiService,
    private otherService: OtherService,
  ) { }

  ngOnInit() {
    this.apiService.getCore(`document/${documentText[this.title]}/${this.otherService.selected}`).subscribe((res: any) => {
      this.html = res.result.content;
    })
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
