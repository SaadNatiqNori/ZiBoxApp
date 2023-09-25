import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { IconsService } from 'src/app/services/icons.service';
import { OtherService } from 'src/app/services/other.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-who-refer-you',
  templateUrl: './who-refer-you.component.html',
  styleUrls: ['./who-refer-you.component.scss'],
})
export class WhoReferYouComponent implements OnInit {

  isLoading: boolean = false;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    private alert: AlertService, // Alert Service
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    public profileService: ProfileService,
  ) { }

  // Invitation Form
  invitationForm = new FormGroup({
    invition_code: new FormControl('', [Validators.required, Validators.minLength(7)]),
  })

  ngOnInit() { }

  confirm() {
    this.isLoading = true;
    // Create or Update Route
    this.apiService.put(`user/set-invited-by?lang=${this.otherService.selected}`, this.invitationForm.value).subscribe((res: any) => {
      this.modalCtrl.dismiss(null, 'confirm');
      this.profileService.getProfile();
      this.isLoading = false;
    }, err => {
      this.profileService.getProfile();
      this.alert.show('invitationCode', err);
      this.isLoading = false;
    })
  }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
