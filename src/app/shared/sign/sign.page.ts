import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { OtherService } from 'src/app/services/other.service';
import { ProfileService } from 'src/app/services/profile.service';
import { StartupService } from 'src/app/services/startup.service';
import { IconsService } from "src/app/services/icons.service";
import { SignService } from "./tabs/sign.service";
import { AlertService } from 'src/app/services/alert.service';
import { ModalController } from '@ionic/angular'; // Modal Controller

// Social
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { SignInWithApple, SignInWithAppleResponse, SignInWithAppleOptions } from '@capacitor-community/apple-sign-in';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'zi-sign',
  templateUrl: './sign.page.html',
  styleUrls: ['./sign.page.scss'],
})
export class SignPage implements OnInit {

  isLoading: boolean = false;
  socialIsLoading: boolean = false;

  constructor(
    public signService: SignService,
    public icons: IconsService,
    public platform: Platform,
    private apiService: ApiService,
    public otherService: OtherService,
    private profileService: ProfileService,
    private startupService: StartupService,
    private alert: AlertService,
    private modalCtrl: ModalController, // Modal Controller
  ) { }

  ngOnInit() {
    this.signService.selectTab = 'sign-in'
  }

  // Login With Facebook
  async signInWithFacebook(): Promise<void> {
    const result: any = await FacebookLogin.login({
      permissions: ['email']
    });
    if (result && result.accessToken) {
      const profile: any = await FacebookLogin.getProfile<{
        email: string;
        name: string;
        picture: any;
      }>({ fields: ['email', 'name', 'picture.width(750)'] })
      this.socialIsLoading = true;
      this.socialSignIn('facebook', profile.id, profile.email, profile.name, profile.picture.data.url || '')
    }
  }

  // Login With Google
  async signInWithGoogle() {
    const profile = await GoogleAuth.signIn();
    this.socialIsLoading = true;
    this.socialSignIn('google', profile.id, profile.email, profile.givenName + ' ' + profile.familyName, profile.imageUrl || '')
  }

  // Login With iCloud
  appleOptions: SignInWithAppleOptions = {
    clientId: 'io.zibox.service',
    redirectURI: '',
    scopes: 'name email',
    state: 'initial',
    nonce: 'nonce',
  };
  async signInWithApple() {
    this.socialIsLoading = true;
    SignInWithApple.authorize(this.appleOptions)
      .then((result: SignInWithAppleResponse) => {
        let profile: any = result.response
        this.socialSignIn('appleId', profile.user, profile.email, profile.givenName + ' ' + profile.familyName, '')
      })
      .catch(error => {
        this.socialIsLoading = false;
        console.log(error)
      });
  }

  // Sign In With Social Networks
  socialSignIn(social, id, email, name, picture) {
    let data = {
      socialNetwork: social,
      socialNetworkUserId: id,
      email: email,
      username: name,
      profile_picture: picture,
    }
    this.apiService.post(`social-login`, data).subscribe((res: any) => {
      this.profileService.setInformation(res.result);
      this.modalCtrl.dismiss();
      this.isLoading = false;
      this.startupService.getAllData();
      localStorage.setItem('signInWith', 'social');
      localStorage.setItem('profilePicture', res.picture.data.url)
      this.socialIsLoading = false;
    }, err => {
      this.alert.show('signin', err)
      this.socialIsLoading = false;
    })
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
