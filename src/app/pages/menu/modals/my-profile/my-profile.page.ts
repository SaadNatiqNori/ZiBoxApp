import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, AlertController } from '@ionic/angular'; // On Scrolling and Modal Controller
import { TranslateService } from '@ngx-translate/core';
import { IconsService } from "src/app/services/icons.service";
import { ApiService } from "src/app/services/api.service";
import { OtherService } from "src/app/services/other.service";
import { ProfileService } from "src/app/services/profile.service";
import { AlertService } from "src/app/services/alert.service";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HttpClient } from "@angular/common/http";

enum gender {
  male = 1,
  female = 2,
}

@Component({
  selector: 'zi-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  // Using for Back to top Content
  @ViewChild(IonContent, { static: false }) content: IonContent;
  isUploadImage: boolean = false;
  isLoading: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  signInWith: string = '';
  // Phone
  phoneIsActive: boolean = true;
  phoneCode: string = '964'
  phoneCodeData: any = [];
  phoneCodeSearch: any = [];
  isVerificationLoading: boolean = false;
  verificationCode: string = '';
  isPhoneLoading: boolean = false;
  showVerificationInput: boolean = false;
  canResend: boolean = true;
  durationToResend: string = '';
  resendTimer: any;
  // Email
  emailIsActive: boolean = true;
  showEmailVerificationInput: boolean = false;
  isEmailVerificationLoading: boolean = false;
  isEmailLoading: boolean = false;
  // Change Password
  showCurrentPassword: boolean = true;
  showNewPassword: boolean = true;
  showConfirmPassword: boolean = true;

  constructor(
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    private alertController: AlertController, // Alert Controller
    public icons: IconsService,
    private apiService: ApiService,
    public otherService: OtherService,
    public profileService: ProfileService,
    private alert: AlertService,
    private http: HttpClient,
  ) {
    this.phoneCode = profileService.countryCode()
    this.signInWith = localStorage.getItem('signInWith')
  }

  // My Information Form
  myInformationForm = new FormGroup({
    nickname: new FormControl(this.profileService.fullname(), [Validators.required]),
    gender: new FormControl(this.profileService.gender(), [Validators.required]),
    date_of_birth: new FormControl(this.profileService.dateOfBirth(), [Validators.required]),
  });

  // Phone Number Form
  phoneForm = new FormGroup({
    country_code: new FormControl(this.phoneCode, [Validators.required]),
    phone: new FormControl(this.profileService.phone(), [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
  });
  // Phone Verification Form
  verificationForm = new FormGroup({
    code: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    phone: new FormControl(this.phoneForm.getRawValue().phone),
    country_code: new FormControl(this.phoneForm.getRawValue().country_code),
  });

  // Email Form
  emailForm = new FormGroup({
    email: new FormControl(this.profileService.email(), [Validators.required, Validators.email, Validators.minLength(8)]),
  });
  // Phone Verification Form
  emailVerificationForm = new FormGroup({
    code: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    email: new FormControl(this.emailForm.getRawValue().email),
  });

  // Change Password Form
  changePasswordForm = new FormGroup({
    current_pass: new FormControl('', [Validators.required]),
    new_pass: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm_pass: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  ngOnInit() {
    this.getPhoneCode()
  }

  // Change Profile Picture
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.isUploadImage = true;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  cancelUpload() {
    this.isUploadImage = false;
    this.croppedImage = '';
  }
  uploadImage() {
    this.isLoading = true;
    this.apiService.patch(`profile`, { avatar: this.croppedImage }).subscribe((res: any) => {
      this.isUploadImage = false;
      this.profileService.setInformation(res.result)
      this.isLoading = false;
    })
  }

  // My Information
  getGender() {
    return gender[this.profileService.gender()]
  }
  // Update My Information
  updateInformation() {
    this.isLoading = true;
    this.apiService.post(`profile/my-information/update?lang=${this.otherService.selected}`, this.myInformationForm.value).subscribe(result => {
      this.apiService.get(`profile?lang=${this.otherService.selected}`).subscribe((res: any) => {
        this.profileService.setInformation(res.result)
        setTimeout(() => {
          this.isLoading = false
        }, 300);
        this.close()
      })
    })
  }

  // Phone Number
  getPhoneCode() {
    this.http.get('./assets/data/country-codes.json').subscribe(res => {
      this.phoneCodeData = res
      this.phoneCodeSearch = [...this.phoneCodeData];
    })
  }
  handleChange(event) {
    const query = event.target.value.toLowerCase();
    this.phoneCodeSearch = this.phoneCodeData.filter(country => country.name.toLowerCase().indexOf(query) > -1);
  }
  selectCountry(getItem) {
    this.phoneForm.patchValue({ country_code: getItem.code });
    this.phoneCode = getItem.code;
    this.modalCtrl.dismiss();
    setTimeout(() => {
      this.phoneCodeSearch = [...this.phoneCodeData];
    }, 300);
  }
  // Send Verification Code to Phone Number
  sendVerfication() {
    this.isVerificationLoading = true;
    this.apiService.post(`profile/verify-phone?lang=${this.otherService.selected}`, this.phoneForm.value).subscribe(result => {
      this.isVerificationLoading = false;
      this.showVerificationInput = true;
      localStorage.setItem('sendTime', JSON.stringify((new Date).getTime() + (60 * 2 * 1000)))
      this.phoneIsActive = false;
      this.canResend = false;
      this.checkResendTime();
    }, err => {
      this.alert.show('changePhone', err)
      this.isVerificationLoading = false;
    })
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
  // Automatically Submit Code
  autoSubmitCode() {
    if (this.verificationForm.getRawValue().code.length == 6) {
      this.changePhone()
    }
  }
  // Change Phone Number with Verification Code
  changePhone() {
    this.verificationForm.patchValue({
      country_code: this.phoneForm.getRawValue().country_code,
      phone: this.phoneForm.getRawValue().phone,
    })
    this.isVerificationLoading = true;
    this.apiService.post(`profile/account-verification?lang=${this.otherService.selected}`, this.verificationForm.value).subscribe((res: any) => {
      this.profileService.setInformation(res.result)
      this.close();
      this.phoneIsActive = true;
      this.isVerificationLoading = false;
      this.showVerificationInput = true
    }, err => {
      this.alert.show('phone', err)
      this.isVerificationLoading = false;
    })
  }
  // Resend code to User
  resendCode() {
    this.canResend = false;
    this.checkResendTime();
    this.sendVerfication();
  }

  // Send Verification Code to Email
  sendEmailVerfication() {
    this.isEmailVerificationLoading = true;
    this.apiService.post(`email-verification?lang=${this.otherService.selected}`, this.emailForm.value).subscribe(result => {
      this.isEmailVerificationLoading = false;
      this.showEmailVerificationInput = true;
      this.emailIsActive = false;
      this.canResend = false;
      this.checkResendTime();
    }, err => {
      this.alert.show('changeEmail', err)
      this.isEmailVerificationLoading = false;
    })
  }
  // Automatically Submit Code
  autoSubmitEmailCode() {
    if (this.emailVerificationForm.getRawValue().code.length == 6) {
      this.changeEmail()
    }
  }
  // Change Email with Verification Code
  changeEmail() {
    this.emailVerificationForm.patchValue({
      email: this.emailForm.getRawValue().email,
    })
    this.isVerificationLoading = true;
    this.apiService.post(`email-confirmation?lang=${this.otherService.selected}`, this.emailVerificationForm.value).subscribe((res: any) => {
      this.profileService.setInformation(res.result)
      this.close();
      this.emailIsActive = true;
      this.isEmailVerificationLoading = false;
      this.showEmailVerificationInput = true;
    }, err => {
      this.alert.show('changeEmail', err)
      this.isVerificationLoading = false;
    })
  }

  // Show Password
  currentPasswordToggle() {
    let password = document.getElementById('current_pass') as HTMLInputElement;
    let type = password.getAttribute('type');
    if (type === 'text') {
      password.setAttribute('type', 'password');
      this.showCurrentPassword = true;
    } else {
      password.setAttribute('type', 'text');
      this.showCurrentPassword = false;
    }
  }
  newPasswordToggle() {
    let password = document.getElementById('new_pass') as HTMLInputElement;
    let type = password.getAttribute('type');
    if (type === 'text') {
      password.setAttribute('type', 'password');
      this.showNewPassword = true;
    } else {
      password.setAttribute('type', 'text');
      this.showNewPassword = false;
    }
  }
  confirmPasswordToggle() {
    let password = document.getElementById('confirm_pass') as HTMLInputElement;
    let type = password.getAttribute('type');
    if (type === 'text') {
      password.setAttribute('type', 'password');
      this.showConfirmPassword = true;
    } else {
      password.setAttribute('type', 'text');
      this.showConfirmPassword = false;
    }
  }
  // Change My Password
  updatePassword() {
    if (this.changePasswordForm.getRawValue().new_pass === this.changePasswordForm.getRawValue().confirm_pass) {
      this.isLoading = true;
      this.apiService.put(`profile/change-user-password?lang=${this.otherService.selected}`, this.changePasswordForm.value).subscribe(res => {
        setTimeout(() => {
          this.isLoading = false
        }, 300);
        this.close()
      }, err => {
        this.changePasswordAlert(err)
      })
    } else {
      this.changePasswordAlert({ status: 400 })
    }
  }
  changePasswordAlert(getError: any) {
    this.translate.get(['changePassword', 'wrongPassword', 'confirmPasswordNotSame', 'checkInternetConnection', 'ok']).subscribe(async (res: any) => {
      let message = '';
      if (getError?.status == 400) {
        if (getError?.error?.error?.data?.current_pass?.indexOf('Incorrect password')) {
          message = res.wrongPassword;
        } else {
          message = res.confirmPasswordNotSame;
        }
      } else {
        message = res.checkInternetConnection
      }
      // Sohw Alert
      setTimeout(async () => {
        const alert = await this.alertController.create({
          header: res.changePassword,
          subHeader: message,
          cssClass: 'custom-alert',
          buttons: [
            {
              text: res.ok,
              handler: () => {
                this.isLoading = false
              },
            },
          ],
        });
        await alert.present();
      }, 100);
    })
  }

  // Delete My Account
  deleteMyAccount() {
    this.translate.get(['deleteMyAccount', 'deleteQuestion', 'yes', 'no']).subscribe(async (res: any) => {
      // Sohw Alert
      const alert = await this.alertController.create({
        header: res.deleteMyAccount,
        subHeader: res.deleteQuestion,
        cssClass: 'custom-alert',
        buttons: [
          {
            text: res.no,
            role: 'cancel',
            cssClass: 'alert-button-black',
          },
          {
            text: res.yes,
            role: 'confirm',
            cssClass: 'alert-button-red',
            handler: () => {
              this.isLoading = true;
              this.apiService.get(`get-user-status/${this.profileService.userId()}?lang=${this.otherService.selected}`).subscribe((res: any) => {
                if (res) {
                  this.profileService.logout();
                  this.close()
                  setTimeout(() => {
                    this.close()
                  }, 350);
                }
              })
            },
          },
        ],
      });
      await alert.present();
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
