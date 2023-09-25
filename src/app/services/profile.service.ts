import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  profile: any;
  isLogin: boolean = false;

  constructor(
    private storage: Storage,
    private apiService: ApiService
  ) {
    if (localStorage.getItem('token')) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    this.getKeyValues();
  }

  // Set User Information to Ionic Storage
  setInformation(getInfo: any) {
    this.storage.create()
    this.storage.set('profile', getInfo)
    localStorage.setItem('token', getInfo.access_token);
    this.profile = getInfo;
    this.isLogin = true;
  }

  // Get User Information From Ionic Storage
  getInformation() {
    try {
      this.storage.get('profile').then(res => {
        if (res) {
          localStorage.setItem('token', res.access_token)
          this.isLogin = true;
          this.profile = res;
          this.getKeyValues();
        }
      })
    } catch (error) {
      this.profile = {};
    }
  }

  // Get User Information Variables
  fullname = () => this.profile?.nickname || ''
  username = () => this.profile?.username || ''
  email = () => this.profile?.profile?.email || ''
  phone = () => this.profile?.phone || ''
  countryCode = () => this.profile?.country_code || '+964'
  gender = () => this.profile?.gender || '0'
  dateOfBirth = () => this.profile?.date_of_birth || ''
  invitionCode = () => this.profile?.invition_code || ''
  invitedBy = () => this.profile?.invited_by || null
  inviterName = () => this.profile?.inviter_name || null
  userId = () => this.profile?.user_id || 0
  profileId = () => this.profile?.profile?.id || ''
  registratedAt = () => this.profile?.c_time || ''
  lastUpdateAt = () => this.profile?.profile?.utime || ''
  picture = () => this.profile?.profile_picture || ''
  favoriteProducts = () => this.profile?.profile?.favoritesProducts || ''
  points = () => this.profile?.points_credit || 0

  // Refresh All User Information Variables
  getKeyValues() {
    this.fullname();
    this.username();
    this.email();
    this.phone();
    this.gender();
    this.dateOfBirth();
    this.invitionCode();
    this.userId();
    this.profileId();
    this.registratedAt();
    this.lastUpdateAt();
    this.picture();
    this.favoriteProducts();
    this.points();
  }

  // Get User Profile Information from Back-end
  getProfile(lang: string = 'en') {
    this.apiService.get(`profile?lang=${lang}`).subscribe((res: any) => {
      this.setInformation(res.result);
      this.getKeyValues();
    })
  }

  logout() {
    this.storage.remove('profile');
    this.storage.remove('notifications');
    this.storage.remove('my-addresses');
    this.storage.remove('token');
    localStorage.removeItem('token')
    this.profile = {};
    this.getKeyValues();
    this.isLogin = false;
  }
}