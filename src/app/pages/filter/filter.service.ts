import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  name: string = '';

  constructor(
    public router: Router,
  ) { }

  // Open Catgeories Page
  openCatgeories(){
    this.router.navigate([`filter/categories`]);
  }
  // Open Category Details
  openCatgeory(item){
    this.name = item.name;
    this.router.navigate([`filter/category`, item.id]);
  }

  // Open Brands Page
  openBrands(){
    this.router.navigate([`filter/brands`]);
  }
  // Open Brand Details
  openBrand(item){
    this.name = item.name;
    this.router.navigate([`filter/brand`, item.id]);
  }

  // Open Shops Page
  openShops(){
    this.router.navigate([`filter/shops`]);
  }
  // Open Shop Details
  openShop(item){
    this.name = item.name;
    this.router.navigate([`filter/shop`, item.id]);
  }
}
