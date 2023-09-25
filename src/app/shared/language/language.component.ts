import { Component, OnInit } from '@angular/core';
import { OtherService } from '../../services/other.service';
import { Router } from '@angular/router';

@Component({
  selector: 'zi-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {

  languages: any = []
  selectedLanguage: string = '';

  constructor(
    private otherService: OtherService,
    private router: Router,
  ) {
    this.languages = otherService.languages;
    this.selectedLanguage = otherService.selected;
  }

  ngOnInit() { }

  // Set Language
  setLanguage(getLanguage) {
    this.otherService.languageIsChanging = true;
    this.router.navigate([`home/marketplace`]);
    this.selectedLanguage = getLanguage.code;
    this.otherService.setLanguage(getLanguage);
    this.selectedLanguage = this.otherService.selected;
  }

}
