import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OtherService } from "src/app/services/other.service";
import { IconsService } from "src/app/services/icons.service";
import { ProfileService } from "src/app/services/profile.service";
import { AlertService } from "src/app/services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
// Pages
import { MyProfilePage } from "./modals/my-profile/my-profile.page";
import { LegalInformationPage } from "./modals/legal-information/legal-information.page";
import { CompanyPage } from "./modals/company/company.page";
// Social media
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { ReferAFriendComponent } from './modals/refer-a-friend/refer-a-friend.component';
import { WhoReferYouComponent } from './modals/who-refer-you/who-refer-you.component';

@Component({
  selector: 'zi-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss']
})
export class MenuPage {

  accountAmount: string = '2,518,000 IQD';
  accountLevel: string = '1';

  constructor(
    private modalCtrl: ModalController,
    public otherService: OtherService,
    public icons: IconsService,
    public profileService: ProfileService,
    public alert: AlertService,
    private translate: TranslateService,
    private router: Router,
  ) {
    profileService.getInformation();
  }

  // Share Invitation Code
  share() {
    this.translate.get('shareText', { value: this.profileService.invitionCode() }).subscribe(async (res: any) => {
      await Share.share({
        title: 'ZiBox',
        text: res,
        dialogTitle: 'Share ZiBox Profile',
      });
    })
  }

  // Open Modals
  async openMyProfileModals() {
    const modal = await this.modalCtrl.create({
      component: MyProfilePage
    },);
    modal.present();
  }
  async openReferFriendModals() {
    const modal = await this.modalCtrl.create({
      component: ReferAFriendComponent
    },);
    modal.present();
  }
  async openWhoReferYouModals() {
    const modal = await this.modalCtrl.create({
      component: WhoReferYouComponent
    },);
    modal.present();
  }
  async openLegalInformationModals() {
    const modal = await this.modalCtrl.create({
      component: LegalInformationPage
    },);
    modal.present();
  }
  async openCompanyModals() {
    const modal = await this.modalCtrl.create({
      component: CompanyPage
    },);
    modal.present();
  }
  // Go to Page
  goToURL(getURL: string) {
    this.router.navigate([getURL]);
  }

  // Logout
  async logout() {
    this.profileService.logout();
    try { await GoogleAuth.signOut() } catch (error) { }
    try { await FacebookLogin.logout(); } catch (error) { }
  }
}
