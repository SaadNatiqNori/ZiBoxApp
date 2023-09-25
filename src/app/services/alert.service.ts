import { Injectable } from "@angular/core";
import { AlertController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  private title: string = '';
  private message: string = '';

  constructor(
    private translate: TranslateService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  // Prepar Alert Information and Show Alert
  show(page: string, error: any) {
    switch (page) {
      case 'signin': // SignIn Page
        this.title = page;
        if (error?.status == 400) {
          if (typeof (error.error.error.data) === 'object') {
            this.message = 'fillField';
          } else if (error?.error?.error?.data?.indexOf('user or password')) {
            this.message = 'wrongLogin';
          } else {
            this.message = 'checkInternetConnection';
          }
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'signup': // SignUp Page
        this.title = page;
        if (error?.status === 400) {
          if (error?.error?.error?.data?.email[0]?.indexOf('has already been taken.') > -1) {
            this.message = 'emailAlreadyExist';
          }
        } else if (error?.status == 444) {
          this.message = 'confirmPasswordNotSame';
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'phone': // SignIn With Phone
        this.title = page;
        if (error?.status === 404) {
          this.message = 'expiredVerificationCode';
        } else if (error?.status === 400) {
          this.message = 'invalidVerificationCode';
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'changePhone': // Change Phone Number
        this.title = page;
        if (error?.status === 400) {
          if (error?.error?.error?.data?.indexOf('phone number already exist') > -1) {
            this.message = 'phoneAlreadyExist';
          }
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'changeEmail': // Change Email
        this.title = page;
        if (error?.status === 400) {
          if (error?.error?.error?.data?.name?.toLowerCase() == 'conflict') {
            this.message = 'emailAlreadyExist';
          } else {
            this.message = 'invalidVerificationCode';
          }
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'congratulation': // Congratulation Create Account
        this.title = 'congratulation';
        this.message = 'confirmEmailAlert';
        break;
      case 'forgotPassword': // Forgot Password
        this.title = page;
        if (error?.status === 400) {
          this.message = 'wrongEmail';
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'changeForgotPassword': // Change Forgot Password
        this.title = 'changePassword';
        if (error?.status === 400) {
          this.message = 'wrongEmail';
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'checkOut': // Check Out Page
        this.title = page;
        if (error?.status === 400) {
          this.message = error.error.error.data.message;
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'promotionCode': // Promotion Code
        this.title = page;
        if (error?.status === 400) {
          this.message = error.error.error.data;
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'address': // SignUp Page
        this.title = page;
        if (error?.status === 400) {
          if (error?.error?.error?.data[0]?.indexOf('order is sending') > -1) {
            this.message = 'canNotUpdateAddress';
          } else {
            this.message = 'phoneIsRequired';
          }
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      case 'invitationCode': // SignUp Page
        this.title = page;
        if (error?.status === 400) {
          this.message = error?.error?.error?.data;
        } else {
          this.message = 'checkInternetConnection';
        }
        break;
      default:
        break;
    }

    // Sohw Alert
    setTimeout(_ => {
      this.translate.get([this.title, this.message, 'ok']).subscribe(async (res: any) => {
        const alert = await this.alertController.create({
          header: res[this.title],
          cssClass: 'custom-alert',
          subHeader: res[this.message],
          buttons: [
            {
              text: res.ok,
            },
          ],
        });
        await alert.present();
      })
    }, 100);
  }

  // Toast Controller
  toast(message: string, duration: number = 3000, position: any = "top") {
    this.translate.get([message]).subscribe(async (res) => {
      const toast = await this.toastController.create({
        message: res[message],
        duration: duration,
        position: position
      });
      await toast.present();
    })
  }

}