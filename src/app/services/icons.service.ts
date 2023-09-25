import { Injectable } from "@angular/core";
import { OtherService } from './other.service';


@Injectable({
  providedIn: 'root'
})
export class IconsService {

  constructor(
    private otherService: OtherService,
  ) { }

  detailIcon = () => this.otherService.direction == 'ltr' ? 'chevron-forward-outline' : 'chevron-back-outline';
  backIcon = () => this.otherService.direction == 'ltr' ? 'arrow-back-outline' : 'arrow-forward-outline';
  buyIcon = () => this.otherService.direction == 'ltr' ? 'arrow-forward-outline' : 'arrow-back-outline';
  closeIcon = () => 'close-outline';

  changeLanguageDirection() {
    this.detailIcon();
    this.backIcon();
    this.buyIcon();
  }

}