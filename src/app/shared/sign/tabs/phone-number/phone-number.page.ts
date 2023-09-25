import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";

import { SignService } from "../sign.service";
import { ApiService } from "src/app/services/api.service";
import { OtherService } from "src/app/services/other.service";
import { ProfileService } from "src/app/services/profile.service";
import { StartupService } from 'src/app/services/startup.service';
import { IconsService } from "src/app/services/icons.service";
import { ModalController } from '@ionic/angular'; // Modal Controller
import { AlertService } from "src/app/services/alert.service";
import { HttpClient } from '@angular/common/http';
import { ShowInformationPage } from 'src/app/pages/menu/modals/legal-information/show-information/show-information.page';

@Component({
  selector: 'zi-phone',
  templateUrl: './phone-number.page.html',
  styleUrls: ['./phone-number.page.scss'],
})
export class PhoneNumberPage implements OnInit, OnDestroy {

  // Variables
  isActive: boolean = true;
  phoneCode: string = '964'
  phoneCodeData: any = [];
  phoneCodeSearch: any = [];
  phoneNumber: string = '';
  sendCodeIsLoading: boolean = false;
  showVerficationCode: boolean = false;
  submitCodeIsLoading: boolean = false;
  canResend: boolean = false;
  durationToResend: string = '';
  resendTimer: any;

  constructor(
    private translate: TranslateService,
    public signService: SignService,
    private apiService: ApiService,
    public otherService: OtherService,
    private profileService: ProfileService,
    private startupService: StartupService,
    public icons: IconsService,
    private alert: AlertService,
    private http: HttpClient,
    private modalCtrl: ModalController, // Modal Controller
  ) { }

  // Phone Form
  phoneForm = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
  })

  // Code Form
  codeForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
  })

  ngOnInit() {
    this.getPhoneCode();
    this.checkResendTime();
  }

  // When the user Close Modal
  ngOnDestroy(): void {
    this.canResend = true;
    this.durationToResend = '';
    clearInterval(this.resendTimer)
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

  // Check Resend Time
  checkResendTime() {
    clearInterval(this.resendTimer)
    let now = new Date().getTime();
    let resendTime = parseInt(localStorage.getItem('sendTime'))
    if (now < resendTime) {
      this.resendTimer = setInterval(() => {
        this.canResend = false;
        now = new Date().getTime();
        let difference = resendTime - now;
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let min = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let sec = Math.floor((difference % (1000 * 60)) / 1000);
        this.durationToResend = `${days ? days + ':' : ''}${hours ? hours + ':' : ''}${min ? min + ':' : ''}${sec} s`;
        if (now > resendTime) {
          this.canResend = true;
          this.durationToResend = '';
          clearInterval(this.resendTimer)
        }
      }, 1000)
    } else {
      this.canResend = true;
      this.durationToResend = '';
      clearInterval(this.resendTimer)
    }
  }

  getPhoneCode() { // Phone Number code
    this.http.get('./assets/data/country-codes.json').subscribe((res: any) => {
      this.phoneCodeData = res.filter(item => item.status === 1)
      this.phoneCodeSearch = [...this.phoneCodeData];
    })
  }
  handleChange(event) { // Search for Country code
    const query = event.target.value.toLowerCase();
    this.phoneCodeSearch = this.phoneCodeData.filter(country => country.name.toLowerCase().indexOf(query) > -1);
  }
  selectCountry(getItem) { // Select Country
    this.phoneCode = getItem.code;
    this.phoneForm.get('phone').setValidators([Validators.required, Validators.minLength(getItem.min), Validators.maxLength(getItem.max)])
    this.modalCtrl.dismiss();
    setTimeout(() => {
      this.phoneCodeSearch = [...this.phoneCodeData];
    }, 300);
  }

  // Send Code to User
  sendCode() {
    this.sendCodeIsLoading = true;
    let data = {
      country_code: this.phoneCode.replace('+', ''),
      phone: parseInt(this.phoneForm.getRawValue().phone),
    }
    this.apiService.post(`send-code/${this.otherService.selected}`, data).subscribe((res: any) => {
      this.showVerficationCode = true;
      this.sendCodeIsLoading = false;
      this.phoneNumber = data.country_code + data.phone;
      localStorage.setItem('sendTime', JSON.stringify((new Date).getTime() + (60 * 2 * 1000)))
      this.isActive = false;
      this.canResend = false;
      this.checkResendTime();
    }, err => {
      this.sendCodeIsLoading = false;
      this.alert.toast('checkInternetConnection')
    })
  }

  // Submit Code
  submitCode() {
    this.submitCodeIsLoading = true;
    let data = {
      country_code: this.phoneCode.replace('+', ''),
      phone: parseInt(this.phoneForm.getRawValue().phone),
      code: this.codeForm.getRawValue().code,
      fcm_token: localStorage.getItem('device_token') || '',
    }
    this.apiService.post(`account-verification/${this.otherService.selected}`, data).subscribe((res: any) => {
      this.submitCodeIsLoading = false;
      this.profileService.setInformation(res.result);
      this.modalCtrl.dismiss();
      this.startupService.getAllData();
      localStorage.setItem('signInWith', 'phone');
    }, err => {
      this.submitCodeIsLoading = false;
      this.alert.show('phone', err)
    })
  }

  // Automatically Submit Code
  autoSubmitCode() {
    if (this.codeForm.getRawValue().code.length == 6) {
      this.submitCode()
    }
  }

  // Resend code to User
  resendCode() {
    this.canResend = false;
    this.checkResendTime();
    this.sendCode();
  }

  // Back Button
  back() {
    if (this.isActive == false) {
      this.isActive = true;
      this.canResend = false;
      this.checkResendTime();
    } else {
      this.signService.selectTab = null;
    }
  }

}
