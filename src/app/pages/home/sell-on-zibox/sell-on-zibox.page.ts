import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { OtherService } from "src/app/services/other.service";
import { IconsService } from 'src/app/services/icons.service';
import { Router } from '@angular/router';

@Component({
  selector: 'zi-sell',
  templateUrl: './sell-on-zibox.page.html',
  styleUrls: ['./sell-on-zibox.page.scss'],
})
export class SellOnZiboxPage implements OnInit {

  data: any = {
    title: null,
    description: null,
    image: null,
    card: [],
    grow: null,
    steps: [],
    hurry: null,
    further: null
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private otherService: OtherService,
    public icons: IconsService,
  ) { }

  ngOnInit() {
    this.http.get(`./assets/data/sell-on-zibox/${this.otherService.selected}.json`).subscribe(res => {
      this.data = res;
    })
  }

  // Go to Route
  goTo(url: string) {
    console.log(this.router)
    this.router.navigate([url]);
  }

}
