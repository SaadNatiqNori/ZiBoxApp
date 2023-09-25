import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular'; // Modal Controller
import { IconsService } from "src/app/services/icons.service";
import { OtherService } from 'src/app/services/other.service';
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: 'app-fashion-filter',
  templateUrl: './fashion-filter.component.html',
  styleUrls: ['./fashion-filter.component.scss'],
})
export class FashionFilterComponent implements OnInit {

  // Using for Back to top Content
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @Input() gender: string = '';
  @Input() categories: any = [];
  @Input() sizes: any = '';
  @Input() price: any = '';

  items: any = [];
  isLoading: boolean = false;
  categoriesData: any = [];
  chooseCategories: any = [];
  sizesData: any = [];
  chooseSizes: any = [];
  priceRange: any = {
    min_price: null,
    max_price: null
  }
  minPrice: any = 0;
  maxPrice: any = 0;

  constructor(
    private modalCtrl: ModalController, // Modal Controller
    public icons: IconsService,
    public otherService: OtherService,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    if (this.gender) {
      this.changeGender(this.gender)
    }
  }

  changeGender(gender) {
    if (this.gender != gender) {
      this.gender = gender;
      // Categories
      this.categories = '';
      this.categoriesData = [];
      this.getCategories(gender);
      // Sizes
      this.sizes = '';
      this.sizesData = [];
      this.getSizes(gender);
      // Price
      this.price = '';
      this.minPrice = 0;
      this.maxPrice = 0;
      this.getPrice(gender);
    }
  }

  // Get Categories by Gender
  getCategories(gender) {
    this.apiService.get(`get-fashion-categories-filter/new/${gender}?lang=${this.otherService.selected}`).subscribe((res: any) => {
      this.categoriesData = res.result;
    })
  }
  selectCategory(getId) {
    if (this.chooseCategories.indexOf(getId) > -1) {
      this.chooseCategories.splice(this.chooseCategories.indexOf(getId), 1)
    } else {
      this.chooseCategories.push(getId)
    }
  }

  // Get Sizes by Gender
  getSizes(gender) {
    this.apiService.get(`get-fashion-sizes-filter/new/${gender}`).subscribe((res: any) => {
      this.sizesData = res.result;
    })
  }
  selectSize(getSize) {
    if (this.chooseSizes.indexOf(getSize) > -1) {
      this.chooseSizes.splice(this.chooseSizes.indexOf(getSize), 1)
    } else {
      this.chooseSizes.push(getSize)
    }
  }

  // Get Price by Gender
  getPrice(gender) {
    this.apiService.get(`get-min-max-price-product/${gender}`).subscribe((res: any) => {
      this.priceRange = res.result;
      this.maxPrice = res.result.max_price
      this.minPrice = res.result.min_price
    })
  }

  // On Price Range Change
  onPriceChange(ev: any) {
    this.price = `${ev.detail.value.lower},${ev.detail.value.upper}`
    this.minPrice = ev.detail.value.lower;
    this.maxPrice = ev.detail.value.upper;
    this.price = `${this.minPrice}-${this.maxPrice}`
  }

  applyFilter() {
    return this.modalCtrl.dismiss({
      gender: this.gender,
      categories: this.chooseCategories.toString(),
      sizes: this.chooseSizes.toString(),
      price: this.price || '',
    }, 'confirm');
  }

  clearFilter() {
    return this.modalCtrl.dismiss(null, 'clear');
  }

  // Close Modal
  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
