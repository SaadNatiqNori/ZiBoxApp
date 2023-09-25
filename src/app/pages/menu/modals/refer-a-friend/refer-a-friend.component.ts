import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; // Modal Controller
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from 'src/app/services/api.service';
import { IconsService } from 'src/app/services/icons.service';
import { ProfileService } from "src/app/services/profile.service";
import { TranslateService } from '@ngx-translate/core';
import { Share } from '@capacitor/share';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-refer-a-friend',
  templateUrl: './refer-a-friend.component.html',
  styleUrls: ['./refer-a-friend.component.scss'],
})
export class ReferAFriendComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    public icons: IconsService,
    public alert: AlertService,
    public profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.profileService.getProfile()
   }

  async copyCode() {
    try {
      await navigator.clipboard.writeText(this.profileService.invitionCode());
      this.alert.toast('copyInvitationCode')
    } catch (err) {
      var text = document.getElementById("invitationCode") as HTMLInputElement;
      text.focus();
      text.select();
      setTimeout(() => {
        document.execCommand('copy');
        this.alert.toast('copyInvitationCode')
      }, 100);
    }
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

  // Close Modal
  onWillDismiss(event: Event) {
    this.modalCtrl.dismiss(null, 'confirm');
  }
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
