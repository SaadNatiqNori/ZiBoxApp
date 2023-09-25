import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";

import { SignService } from "../sign.service";

import { ApiService } from "src/app/services/api.service";
import { OtherService } from "src/app/services/other.service";
import { ProfileService } from "src/app/services/profile.service";
import { StartupService } from "src/app/services/startup.service";
import { IconsService } from 'src/app/services/icons.service';
import { AlertService } from "src/app/services/alert.service";
import { ModalController } from '@ionic/angular'; // Modal Controller

@Component({
  selector: 'zi-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  isLoading: boolean = false;
  socialIsLoading: boolean = false;
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

  ngOnInit() { }

  // Login Page
  loginForm = new FormGroup({
    phone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    fcm_token: new FormControl(localStorage.getItem('device_token') || ''),
    lang: new FormControl(this.otherService.selected),
  })

  // Show Password
  passwordToggle(){
    let password = document.getElementById('password') as HTMLInputElement;
    let type = password.getAttribute('type');
    if (type === 'text') {
      password.setAttribute('type', 'password');
      this.showPassword = true;
    } else {
      password.setAttribute('type', 'text');
      this.showPassword = false;
    }
  }

  changeTab(name: string) {
    this.signService.selectTab = name;
  }

  // Login With Email
  confirm() {
    this.isLoading = true;
    this.loginForm.patchValue({ phone: (this.loginForm.getRawValue().phone.trim()).toLowerCase() })
    this.apiService.post(`login?lang=${this.otherService.selected}`, this.loginForm.value).subscribe((res: any) => {
      this.profileService.setInformation(res.result);
      this.modalCtrl.dismiss();
      this.isLoading = false;
      this.startupService.getAllData();
      localStorage.setItem('signInWith', 'email');
    }, err => {
      this.alert.show('signin', err)
      this.isLoading = false;
    })
  }

}
