import { Injectable } from "@angular/core";
import { OtherService } from "src/app/services/other.service"; // Tab Service
import { ApiService } from "src/app/services/api.service";
import { ProfileService } from "src/app/services/profile.service";
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: 'root'
})

export class StartupService {

  notificationErrorCount: number = 0;
  addressesErrorCount: number = 0;
  currenciesErrorCount: number = 0;
  repeatTime: number = 5;

  constructor(
    public otherService: OtherService, // Tab Service
    public apiService: ApiService,
    private profileService: ProfileService,
    public storage: Storage,
  ) { }

  getAllData() {
    this.getMyNotifications();
    this.getMyAddresses();
    this.getCurrency();
  }

  // My Notifications
  getMyNotifications() {
    this.apiService.get(`notifications?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.storage.create()
      this.storage.set('notifications', res.result);
    }, (err) => {
      if (this.notificationErrorCount < this.repeatTime) {
        setTimeout(() => {
          this.getMyNotifications()
          this.notificationErrorCount += 1;
        }, 1000);
      }
    })
  }

  // Get My Addresses
  getMyAddresses() {
    this.apiService.get(`user-addresses?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.storage.create()
      this.storage.set('my-addresses', res.result)
    }, (err) => {
      if (this.addressesErrorCount < this.repeatTime) {
        setTimeout(() => {
          this.getMyAddresses()
          this.addressesErrorCount += 1;
        }, 1000);
      }
    })
  }

  // Get Currency
  getCurrency() {
    this.apiService.get(`currency/get-exchange/2`).subscribe((res: any) => {
      localStorage.setItem('currency', res.result.exchange_rate)
      this.otherService.exchangeRate = res.result.exchange_rate;
      setTimeout(() => {
        this.getCurrency()
      }, 1800000);
    }, (err) => {
      if (this.currenciesErrorCount < this.repeatTime) {
        setTimeout(() => {
          this.getCurrency()
        }, 1000);
      }
    })
  }
}