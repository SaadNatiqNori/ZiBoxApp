import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular'; // On Scrolling & Modal Controller
import { OtherService } from 'src/app/services/other.service';
import { IconsService } from 'src/app/services/icons.service';
import { ApiService } from "src/app/services/api.service";
import { FilterService } from '../filter.service';
import { Storage } from "@ionic/storage-angular";

@Component({
  selector: 'zi-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class MenuCategoriesPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;

  items: any = [];
  isLoading: boolean = false;
  // Search
  searchTimer: any;
  searchWord: string = '';
  // Category
  categories: any = [];
  selectCategories: any = {};
  subCategories: any = [];
  selectSubCategories: any = {};
  subSubCategories: any = [];
  selectSubSubCategories: any = {};
  subSubSubCategories: any = [];

  constructor(
    public otherService: OtherService,
    public icons: IconsService,
    private apiService: ApiService,
    public storage: Storage,
    public filterService: FilterService,
  ) { }

  ngOnInit() {
    this.getData();
    this.otherService.getAllCategories();
    this.storage.get('all-categories').then((val: any) => {
      this.categories = val;
    });
  }

  // Open Category Details
  openCategory(getItem: any) {
    this.filterService.openCatgeory(getItem);
  }

  // On Search
  onSearch() {
    this.isLoading = true;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.items = [];
      this.getData();
    }, 300);
  }

  // Get All Catgeories
  getData() {
    this.apiService.get(`categories/search/new?lang=${this.otherService.selected}&search=${this.searchWord}`).subscribe((res: any) => {
      this.items = res.result;
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    })
  }

  // Using for Back to top of Content from Parent Component
  backToTop() {
    this.content.scrollToTop(1500);
  }

}
