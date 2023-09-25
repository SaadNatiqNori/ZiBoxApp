import { Component, NgZone } from '@angular/core';

import { Platform } from "@ionic/angular";
import { OtherService } from './services/other.service';
// Sign in with Social
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

import { StatusBar } from '@capacitor/status-bar';
import { ProfileService } from './services/profile.service';
import { Network } from '@capacitor/network';

// Deeplink
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Router } from '@angular/router';
import { FilterService } from './pages/filter/filter.service';
import { DetailService } from './services/details.service';

@Component({
  selector: 'zibox',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private zone: NgZone,
    private platform: Platform,
    public otherService: OtherService,
    public profileService: ProfileService,
    public detailService: DetailService,
    private filterService: FilterService,
    private router: Router,
  ) {
    this.hideStatusBar();
    this.initializeApp();
    this.checkInternet();
  }

  hideStatusBar = async () => {
    // await StatusBar.hide();
    StatusBar.setOverlaysWebView({ overlay: true });
  };

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const url = event.url;
        if (url.includes('product')) {
          const slug = url.split("product").pop();
          this.detailService.openProduct({ id: slug.replace('=', '').replace('/', '') });
        } else if (url.includes('advertisement')) {
          const slug = url.split("product").pop();
          this.detailService.openProduct({ id: slug.replace('=', '').replace('/', '') });
        } else if (url.includes('category')) {
          const slug = url.split("category").pop();
          this.filterService.openCatgeory({ id: slug.replace('=', '').replace('/', '') })
        } else if (url.includes('brand')) {
          const slug = url.split("brand").pop();
          this.filterService.openBrand({ id: slug.replace('=', '').replace('/', '') })
        } else if (url.includes('shop')) {
          const slug = url.split("shop").pop();
          this.filterService.openShop({ id: slug.replace('=', '').replace('/', '') })
        } else if (url.includes('discount')) {
          const slug = url.split("discount").pop();
          this.router.navigate([`home/marketplace/discounts`, slug.replace('=', '').replace('/', '')]);
        }
      });
    });

    this.platform.ready().then(() => {
      this.otherService.setInitialAppLanguage();
      // Check Is First time Launch
      if (localStorage.getItem('firstTimeLaunch')) {
        this.otherService.firstTimeLaunch = JSON.parse(localStorage.getItem('firstTimeLaunch'));
      }
      // Social
      FacebookLogin.initialize({ appId: '1862394173879972' });
      GoogleAuth.initialize()
      // Profile
      this.profileService.getProfile();
    })
  }

  // Check Internet Connection
  checkInternet() {
    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      this.otherService.checkInternet = status.connected;
    };
    logCurrentNetworkStatus;
    Network.addListener('networkStatusChange', status => {
      this.otherService.checkInternet = status.connected;
    });
  }

}
