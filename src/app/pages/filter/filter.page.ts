import { Component } from '@angular/core';
import { DetailService } from 'src/app/services/details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'zi-filter',
  templateUrl: 'filter.page.html',
  styleUrls: ['filter.page.scss']
})
export class FilterPage {

  constructor(
    public detailServies: DetailService,
    public router: Router,
  ) { }

  // Navigation Route
  navigateRoot(getRoute: string) {
    if (getRoute === 'filter/brands' && this.router.url === '/' + getRoute) {
      document.getElementById('top').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    } else {
      this.router.navigate([`/${getRoute}`]);
    }
  }

}
