import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";

import { ApiService } from "src/app/services/api.service";
import { OtherService } from "src/app/services/other.service";
import { ModalController } from '@ionic/angular'; // Modal Controller
import { AlertService } from "src/app/services/alert.service";
import { SignService } from '../sign.service';
import { ShowInformationPage } from 'src/app/pages/menu/modals/legal-information/show-information/show-information.page';
import { ProfileService } from 'src/app/services/profile.service';
import { StartupService } from 'src/app/services/startup.service';
import { IconsService } from 'src/app/services/icons.service';

@Component({
  selector: 'zi-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  isLoading: boolean = false;
  showPassword: boolean = true;

  constructor(
    private translate: TranslateService,
    public signService: SignService,
    private apiService: ApiService,
    private otherService: OtherService,
    private profileService: ProfileService,
    private startupService: StartupService,
    public icons: IconsService,
    private alert: AlertService,
    private modalCtrl: ModalController, // Modal Controller
  ) { }

  ngOnInit() {
  }

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  // Show Password
  passwordToggle() {
    let password = document.getElementById('signUpPassword') as HTMLInputElement;
    let type = password.getAttribute('type');
    if (type === 'text') {
      password.setAttribute('type', 'password');
      this.showPassword = true;
    } else {
      password.setAttribute('type', 'text');
      this.showPassword = false;
    }
  }

  // Open Legal Information
  async openLegalInformationModals(getTitle) {
    const modal = await this.modalCtrl.create({
      component: ShowInformationPage,
      componentProps: {
        title: getTitle
      }
    },);
    modal.present();
  }

  // Create Account
  confirm() {
    let newData = {
      username: this.registerForm.getRawValue().username.trim(),
      email: this.registerForm.getRawValue().email.trim(),
      password: this.registerForm.getRawValue().password,
      confirm_password: this.registerForm.getRawValue().password,
      lang: this.otherService.selected,
    }
    this.isLoading = true;
    this.apiService.post(`signup?lang=${this.otherService.selected}`, newData).subscribe((res: any) => {
      this.isLoading = false;
      // Successfully Create Account
      this.alert.show('congratulation', 'confirmEmailAlert')
      this.signService.selectTab = 'sign-in'
    }, err => {
      this.alert.show('signup', err)
      this.isLoading = false;
    })
  }

}
