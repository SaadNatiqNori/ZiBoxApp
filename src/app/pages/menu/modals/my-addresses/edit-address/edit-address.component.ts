import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; // Modal Controller
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from 'src/app/services/api.service';
import { IconsService } from 'src/app/services/icons.service';
import { ProfileService } from "src/app/services/profile.service";
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// Map
import * as mapboxgl from 'mapbox-gl';
import { environment } from "src/environments/environment";

interface location {
  lat: string,
  lng: string,
}

@Component({
  selector: 'zi-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss'],
})
export class EditAddressComponent implements OnInit {

  @Input() address: any;
  @Input() isNew: string = null;
  cities: any = [];
  isLoading: boolean = false;
  // Map
  mapId: string = `map_${parseInt((Math.random() * 12458963).toString()).toString()}`;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v12';
  zoom = 15;
  marker: any;
  isTurnOnLoaction: boolean = false;

  // Phone Variables
  countryData: any = [];
  countrySearch: any = [];

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
  savePhoneNumber: boolean = false;

  // Location Details - Temp
  globalCode: string = null;
  country: string = null;
  governorate: string = null;
  place: string = null;
  route: string = null;
  nearestPoint: string = null;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    private alert: AlertService, // Alert Service
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    public profileService: ProfileService,
  ) {
    this.phoneCode = profileService.countryCode();
    this.getPhoneCode();
    // Map Token
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  // Address Form
  addressForm = new FormGroup({
    contact_name: new FormControl(this.profileService.fullname(), [Validators.required]),
    country_code: new FormControl(this.phoneCode),
    mobile_phone: new FormControl(this.profileService.phone()),
    global_code: new FormControl(''),
    country: new FormControl('Iraq'),
    city: new FormControl('Erbil', [Validators.required]),
    area_name: new FormControl('', [Validators.required]),
    locality: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    residential_type: new FormControl('house'),
    building_name: new FormControl(''),
    floor_number: new FormControl(''),
    apartment_number: new FormControl(''),
    nearest_point: new FormControl('', [Validators.required]),
    lat: new FormControl(''),
    lng: new FormControl(''),
    as_default: new FormControl(false),
  })
  // Phone Number Form
  phoneForm = new FormGroup({
    country_code: new FormControl(this.phoneCode, [Validators.required]),
    phone: new FormControl(this.profileService.phone(), [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
  });
  // Phone Verification Form
  verificationForm = new FormGroup({
    code: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    phone: new FormControl(this.phoneForm.getRawValue().phone),
    country_code: new FormControl(this.phoneForm.getRawValue().country_code),
  });

  ngOnInit() {
    this.getCities()
    if (!this.isNew) {
      this.address.residential_type = this.address.residential_type.toLowerCase();
      this.addressForm.patchValue(this.address);
      setTimeout(() => {
        this.buildMap(this.mapId, { lng: this.address.lng, lat: this.address.lat }, true);
        this.getDetails(this.address.lng, this.address.lat)
      }, 300);
    } else {
      setTimeout(() => {
        this.setMap();
      }, 300);
    }

    // Phone Number is Saved?
    if (localStorage.getItem('countryCode') && localStorage.getItem('mobilePhone')) {
      this.addressForm.patchValue({
        country_code: localStorage.getItem('countryCode'),
        mobile_phone: localStorage.getItem('mobilePhone'),
      })
      localStorage.setItem('countryCode', this.phoneForm.getRawValue().country_code)
      localStorage.setItem('mobilePhone', this.phoneForm.getRawValue().phone)
    }
  }

  // Phone Number
  getPhoneCode() {
    this.http.get('./assets/data/country-codes.json').subscribe((res: any) => {
      this.phoneCodeData = res.filter(item => item.status === 1)
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
    this.phoneForm.get('phone').setValidators([Validators.required, Validators.minLength(getItem.min), Validators.maxLength(getItem.max)])
    this.modalCtrl.dismiss();
    setTimeout(() => {
      this.phoneCodeSearch = [...this.phoneCodeData];
    }, 300);
  }
  // Send Verification Code to Phone Number
  sendVerfication() {
    this.isVerificationLoading = true;
    this.apiService.post(`send-code-user-address?lang=${this.otherService.selected}`, this.phoneForm.value).subscribe(result => {
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
    this.apiService.post(`account-phone-user-address?lang=${this.otherService.selected}`, this.verificationForm.value).subscribe((res: any) => {
      this.addressForm.patchValue({
        country_code: this.phoneForm.getRawValue().country_code,
        mobile_phone: this.phoneForm.getRawValue().phone,
      })
      localStorage.setItem('countryCode', this.phoneForm.getRawValue().country_code)
      localStorage.setItem('mobilePhone', this.phoneForm.getRawValue().phone)
      this.close();
      this.phoneIsActive = true;
      this.isVerificationLoading = false;
      this.showVerificationInput = true;
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

  // Build Map
  buildMap(mapId: string, location: location, canChangeMapMarker: boolean = false) {
    this.map = new mapboxgl.Map({
      container: `${mapId}`,
      style: this.style,
      zoom: this.zoom,
      center: [location.lng, location.lat],
    })
    this.isTurnOnLoaction = true;
    // Add Defualt Marker
    this.marker = new mapboxgl.Marker()
      .setLngLat([location.lng, location.lat])
      .addTo(this.map);
    // If The user Loaction
    if (canChangeMapMarker) {
      // Remove & Add Marker to the Map on Click
      this.map.on('click', address => {
        this.marker.remove();
        this.marker = new mapboxgl.Marker()
          .setLngLat([address.lngLat.lng, address.lngLat.lat])
          .addTo(this.map);
        this.getDetails(address.lngLat.lng, address.lngLat.lat)
      })
      // Map Controler
      this.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));
    } else {
      // If the market Loaction
      // this.map.addControl(new mapboxgl.FullscreenControl());
    }
  }
  // Get Loacation Position
  getLocation() {
    return {
      lat: this.marker.getLngLat().lat,
      lng: this.marker.getLngLat().lng,
    }
  }
  // Get Loacation Details
  getDetails(lng, lat) {
    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=en&key=AIzaSyB81Ni6GpeDu57cIygSYufJPuI_vChaFlk`).subscribe((data) => {
      if (data['status'] === 'OK') {
        let city = data['results'].filter(c => c.types.indexOf('administrative_area_level_1') > -1)[0]?.address_components[0]?.long_name?.replace(' Governorate', '') || null;
        let street = data['results'].filter(c => c.types.indexOf('route') > -1)[0]?.formatted_address?.replace('،', ',')?.split(',', 1) || null;
        let area = data['results'].filter(c => c.types.indexOf('neighborhood') > -1)[0]?.formatted_address?.replace('،', ',')?.split(',', 1) || null;
        let locality = data['results'].filter(c => c.types.indexOf('locality') > -1)[0]?.formatted_address?.replace('،', ',')?.split(',', 1) || null;
        this.addressForm.patchValue({
          global_code: data['plus_code'].global_code || null,
          country: data['results'][0].address_components.filter(c => c.types.indexOf('country') > -1)[0]?.long_name || null,
          city: city ? city.toString() : '',
          area_name: area ? area.toString() : '',
          street: street == 'Unnamed Road' ? null : (street ? street.toString() : ''),
          locality: locality ? locality.toString() : '',
        })
      } else {
        console.log(`Geocoder failed due to: ${data['error_message']}`);
      }
    });
  }

  // Country
  countryChange(event) {
    const query = event.target.value.toLowerCase();
    this.countrySearch = this.countryData.filter(country => country.name.toLowerCase().indexOf(query) > -1);
  }
  // Get Cities
  getCities() {
    this.apiService.get(`cities?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.cities = res.result
    })
  }

  setMap() {
    // Map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(res => {
        this.buildMap(this.mapId, { lng: res.coords.longitude.toString(), lat: res.coords.latitude.toString() }, true);
        this.getDetails(res.coords.longitude.toString(), res.coords.latitude.toString());

        this.isLoading = false;
      }, err => {
        // The User have denied the request for Geolocation.
        if (err.PERMISSION_DENIED) {
          this.buildMap(this.mapId, { lng: '0', lat: '0' }, true);
          this.getDetails('0', '0');
        }
        this.isLoading = false;
      });
    } else {
      // The Browser Does not Support Geolocation
      this.buildMap(this.mapId, { lng: '0', lat: '0' }, true);
      this.getDetails('0', '0');
      this.isLoading = false;
    }
  }

  confirm() {
    this.isLoading = true;
    // Location & Country Code
    this.addressForm.patchValue({
      lat: this.getLocation().lat.toString(),
      lng: this.getLocation().lng.toString(),
      country_code: this.phoneCode,
    })
    // Create or Update Route
    if (this.isNew) {
      this.apiService.post(`user-addresses/create?lang=${this.otherService.selected}`, this.addressForm.value).subscribe((res: any) => {
        this.modalCtrl.dismiss(null, 'confirm');
        this.isLoading = false;
      }, err => {
        this.alert.show('address', err)
        this.isLoading = false;
      })
    } else {
      this.apiService.put(`user-addresses/update/${this.address.id}?lang=${this.otherService.selected}`, this.addressForm.value).subscribe((res: any) => {
        this.modalCtrl.dismiss(null, 'confirm');
        this.isLoading = false;
      }, err => {
        this.alert.show('address', err)
        this.isLoading = false;
      })
    }
  }

  // Close Modal
  onWillDismiss(event: Event) {
    this.modalCtrl.dismiss(null, 'confirm');
  }
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
