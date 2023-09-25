import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage-angular";
import { Platform } from "@ionic/angular";

import { environment } from "src/environments/environment";

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api.service';
import { OtherService } from 'src/app/services/other.service';
import { ProfileService } from 'src/app/services/profile.service';
import { StartupService } from 'src/app/services/startup.service';

@Component({
  selector: 'zi-tabs',
  templateUrl: 'navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  // Newroz
  newrozDate: any = [
    { day: 20, month: 3 },
    { day: 21, month: 3 },
    { day: 22, month: 3 },
  ];
  showNewroz: boolean = false;
  // Ramadan
  ramadanDate: any = [
    { day: 23, month: 3 },
    { day: 24, month: 3 },
    { day: 25, month: 3 },
    { day: 26, month: 3 },
    { day: 27, month: 3 },
    { day: 28, month: 3 },
    { day: 29, month: 3 },
    { day: 30, month: 3 },
    { day: 31, month: 3 },
    { day: 1, month: 4 },
    { day: 2, month: 4 },
    { day: 3, month: 4 },
    { day: 4, month: 4 },
    { day: 5, month: 4 },
    { day: 6, month: 4 },
    { day: 7, month: 4 },
    { day: 8, month: 4 },
    { day: 9, month: 4 },
    { day: 10, month: 4 },
    { day: 11, month: 4 },
    { day: 12, month: 4 },
    { day: 13, month: 4 },
    { day: 14, month: 4 },
    { day: 15, month: 4 },
    { day: 16, month: 4 },
    { day: 17, month: 4 },
    { day: 18, month: 4 },
    { day: 19, month: 4 },
    { day: 20, month: 4 },
  ]
  showRamadan: boolean = false;
  // Update
  showUpdate: boolean = false;
  version: string = '';

  constructor(
    public router: Router,
    public apiService: ApiService,
    public otherService: OtherService,
    public profileService: ProfileService,
    public startupService: StartupService,
    public storage: Storage,
    private platform: Platform,
    private translate: TranslateService,
  ) {
    profileService.getInformation();
    if (profileService.isLogin) {
      startupService.getAllData();
    } else {
      startupService.getCurrency();
    }
  }

  ngOnInit(): void {
    // Call App Version
    this.getVersion();
    // Call Categories
    this.otherService.getAllCategories();
    // Notification
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        // alert('Push registration success, token: ' + token.value);
        console.log(token.value);
        localStorage.setItem('device_token', token.value)
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        // alert('Error on registration: ' + JSON.stringify(error));
        console.error(error)
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        // alert('Push received: ' + JSON.stringify(notification));
        console.log('Your Notification IS:', notification)
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        // console.log('Tap On Notification', notification)
        if (notification.notification.data.page === 'discount') {
          this.router.navigate([`/home/marketplace/discounts/${notification.notification.data.id}`]);
        } else if (notification.notification.data.page === 'product') {
          this.router.navigate([`/home/marketplace/product/${notification.notification.data.id}`]);
        } else if (notification.notification.data.page === 'category') {
          this.router.navigate([`/home/marketplace/categories/${notification.notification.data.id}`]);
        } else if (notification.notification.data.page === 'brand') {
          this.router.navigate([`/home/marketplace/brands/${notification.notification.data.id}`]);
        } else {

        }
      }
    );

    // Is Holiday Date?
    let date = new Date();
    // Is Newroz Date?
    let newrozHoliday = this.newrozDate.filter(holiday => holiday.day === date.getDate() && holiday.month === date.getMonth() + 1)
    if (newrozHoliday.length > 0) {
      this.showNewroz = true;
    } else {
      this.showNewroz = false;
    }
    // Is Ramadan Date?
    let ramadanHoliday = this.ramadanDate.filter(holiday => holiday.day === date.getDate() && holiday.month === date.getMonth() + 1)
    if (ramadanHoliday.length > 0) {
      this.showRamadan = true;
    } else {
      this.showRamadan = false;
    }
  }

  // Navigation Route
  navigateRoot(getRoute: string) {
    if (getRoute === 'home/marketplace' && this.router.url === '/' + getRoute) {
      document.getElementById('top').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    } else {
      this.router.navigate([`/${getRoute}`]);
    }
  }

  // Remove it for Mardin
  getVersion() {
    let appBuildNumber: number = 0;
    let currentBuildNumber: number = environment.appBuildingNumber;
    setTimeout(() => {
      this.apiService.getCore('version').subscribe((res: any) => {
        this.version = res.result.version
        if (this.platform.is('android')) {
          if (res.result.android != null) {
            appBuildNumber = res.result.android
            if (appBuildNumber > currentBuildNumber) {
              this.showUpdate = true;
            }
          }
        } else if (this.platform.is('ios')) {
          if (res.result.ios != null) {
            appBuildNumber = res.result.ios
            if (appBuildNumber > currentBuildNumber) {
              this.showUpdate = true;
            }
          }
        } else {
          if (res.result.build_number != null) {
            appBuildNumber = res.result.build_number
            if (appBuildNumber > currentBuildNumber) {
              this.showUpdate = true;
            }
          }
        }
      })
    }, 1000);
  }

  // Force Update
  update() {
    if (this.platform.is('android')) {
      window.open("https://play.google.com/store/apps/details?id=com.ionicframework.zitrade271041", "_system");
    } else if (this.platform.is('ios')) {
      window.open("https://apps.apple.com/iq/app/zibox-inc/id1217952415", "_system");
    } else {
      window.open("https://apps.apple.com/iq/app/zibox-inc/id1217952415", "_system");
    }
  }

}
