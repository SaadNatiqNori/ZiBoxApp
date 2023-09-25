import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";

import { SignService } from "../sign.service";
import { ApiService } from "src/app/services/api.service";
import { OtherService } from "src/app/services/other.service";
import { ProfileService } from "src/app/services/profile.service";
import { IconsService } from "src/app/services/icons.service";
import { Storage } from "@ionic/storage-angular";
import { ModalController } from '@ionic/angular'; // Modal Controller
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: 'zi-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  // Variables
  isForgotLoading: boolean = false;
  isActive: boolean = true;
  isResetLoading: boolean = false;
  showNewPassword: boolean = true;

  constructor(
    private translate: TranslateService,
    public signService: SignService,
    private apiService: ApiService,
    public otherService: OtherService,
    private profileService: ProfileService,
    public icons: IconsService,
    private alert: AlertService,
    private storage: Storage,
    private modalCtrl: ModalController, // Modal Controller
  ) { }

  ngOnInit() { }

  // Forgot Password Form
  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  // Reset Password Form
  resetForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    token: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
  })

  // Send Email
  sendEmail() {
    this.isForgotLoading = true;
    this.apiService.post(`request-password-reset?lang=${this.otherService.selected}`, this.forgotForm.value).subscribe((res: any) => {
      this.isForgotLoading = false;
      this.isActive = false;
    }, err => {
      try {
        if (err?.error?.error?.data?.indexOf('Password resetting') > -1) {
          this.isForgotLoading = false;
          this.isActive = false;
          return '';
        }
      } catch (error) { }
      this.alert.show('forgotPassword', err)
      this.isForgotLoading = false;
    })
  }

  // Show Password
  newPasswordToggle(){
    let password = document.getElementById('newPassword') as HTMLInputElement;
    let type = password.getAttribute('type');
    if (type === 'text') {
      password.setAttribute('type', 'password');
      this.showNewPassword = true;
    } else {
      password.setAttribute('type', 'text');
      this.showNewPassword = false;
    }
  }

  // Change Password
  changePassword() {
    this.isResetLoading = true;
    this.apiService.post(`password-reset?lang=${this.otherService.selected}`, this.resetForm.value).subscribe((changeRes: any) => {
      // After change password login to ZiBox Account
      let loginForm = {
        phone: this.forgotForm.getRawValue().email,
        password: this.resetForm.getRawValue().password,
        lang: this.otherService.selected,
      }
      this.apiService.post(`login?lang=${this.otherService.selected}`, loginForm).subscribe((res: any) => {
        this.storage.set('token', res.result.access_token);
        this.profileService.setInformation(res.result);
        this.modalCtrl.dismiss();
        this.isResetLoading = false;
      }, err => {
        this.alert.show('changeForgotPassword', err)
        this.isResetLoading = false;
      })
    }, err => {
      this.alert.show('changeForgotPassword', err)
      this.isResetLoading = false;
    })
  }

  // Back Button
  back() {
    if (this.isActive == false) {
      this.isActive = true;
    } else {
      this.signService.selectTab = 'signin';
    }
  }

}
