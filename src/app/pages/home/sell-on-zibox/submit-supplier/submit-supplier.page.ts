import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular'; // Modal Controller
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IconsService } from 'src/app/services/icons.service';

@Component({
  selector: 'app-submit-supplier',
  templateUrl: './submit-supplier.page.html',
  styleUrls: ['./submit-supplier.page.scss'],
})
export class SubmitSupplierPage implements OnInit {

  marketLogo: any = ''
  phoneCode: string = '+964'
  phoneCodeData: any = [];
  phoneCodeSearch: any = [];
  productCategories: any = []
  brandCategories: any = []
  mapId: string = `map_${parseInt((Math.random() * 12458963).toString()).toString()}`;
  isLoading: boolean = false;

  submitIsSend: boolean = false;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private modalCtrl: ModalController, // Modal Controller
    private apiService: ApiService,
    private mapService: MapService,
    private router: Router,
    public icons: IconsService,
  ) {
    this.getPhoneCode();
  }

  supplierForm = new FormGroup({
    market_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone_number: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  })

  ngOnInit() {
    this.setMap();
  }

  // Change Profile Picture
  fileChangeEvent(event: any): void {
    var reader = new FileReader();
    reader.onload = _ => {
      this.marketLogo = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  // Phone Number code
  getPhoneCode() {
    this.http.get('./assets/data/country-codes.json').subscribe(res => {
      this.phoneCodeData = res
      this.phoneCodeSearch = [...this.phoneCodeData];
    })
  }
  countryCodeChange(event) {
    const query = event.target.value.toLowerCase();
    this.phoneCodeSearch = this.phoneCodeData.filter(country => country.name.toLowerCase().indexOf(query) > -1);
  }
  selectCountryCode(getItem) {
    this.phoneCode = getItem.code;
    this.modalCtrl.dismiss();
    setTimeout(() => {
      this.phoneCodeSearch = [...this.phoneCodeData];
    }, 300);
  }

  // Product Categories
  addProductCategory(category) {
    this.productCategories.push(category)
  }
  deleteProductCategory(category) {
    this.productCategories.splice(this.productCategories.indexOf(category), 1)
  }

  // Brand Categories
  addBrandCategory(category) {
    this.brandCategories.push(category)
  }
  deleteBrandCategory(category) {
    this.brandCategories.splice(this.brandCategories.indexOf(category), 1)
  }

  setMap() {
    // Map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(res => {
        this.mapService.buildMap(this.mapId, { lng: res.coords.longitude.toString(), lat: res.coords.latitude.toString() }, true);
        this.isLoading = false;
      }, err => {
        // The User have denied the request for Geolocation.
        if (err.PERMISSION_DENIED) {
          this.mapService.buildMap(this.mapId, { lng: '0', lat: '0' }, true);
        }
        this.isLoading = false;
      });
    } else {
      // The Browser Does not Support Geolocation
      this.mapService.buildMap(this.mapId, { lng: '0', lat: '0' }, true);
      this.isLoading = false;
    }
  }

  confirm() {
    this.isLoading = true;
    let data = this.supplierForm.value;
    data['logo'] = this.marketLogo;
    data['phone_number'] = this.phoneCode + this.supplierForm.getRawValue().phone_number;
    data['product_categories'] = this.productCategories;
    data['brand_categories'] = this.brandCategories;
    data['lat'] = this.mapService.getLocation().lat.toString();
    data['lng'] = this.mapService.getLocation().lng.toString();
    // Submit Supplier
    this.apiService.post(`request-seller`, data).subscribe((res: any) => {
      this.submitIsSend = true;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
    })
  }

}
