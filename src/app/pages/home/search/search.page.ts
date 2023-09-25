import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { OtherService } from "src/app/services/other.service"; // Tab Service
import { ApiService } from "src/app/services/api.service";
import { IconsService } from "src/app/services/icons.service";
import { Storage } from "@ionic/storage-angular";

import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { RouterEvent, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  // Using for Back to top Content from Child's Components
  @ViewChild(IonContent, { static: false }) content: IonContent;
  // Menu Navigation bar
  menuNavbar = document.getElementById('menuNavbar') as HTMLDivElement;
  // Search
  showSearch: boolean = false;
  searchTimer: any;
  searchWord: string = '';
  searchResult: any = [];
  searchIsLoading: boolean = false;
  // Recent Search
  recentSearch: any = [];
  // Voice
  recording: boolean = false;
  voiceWord: string = '';
  voiceTimer: any;
  // Other
  selectCategory: string = '';

  constructor(
    private router: Router,
    public otherService: OtherService, // Tab Service
    public apiService: ApiService,
    public icons: IconsService,
    public storage: Storage,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getRecentData();
    setTimeout(() => {
      (document.getElementById('search') as HTMLInputElement).focus();
    }, 100);
  }

  // Listener Voice
  async startRecognition() {
    SpeechRecognition.requestPermission()
    const { available } = await SpeechRecognition.available();
    if (available) {
      this.voiceWord = '';
      this.menuNavbar.classList.add('hide-search')
      SpeechRecognition.start({
        popup: false,
        partialResults: true,
        language: 'en-US',
      })
    }
    if (SpeechRecognition.hasPermission()) {
      this.recording = true;
      SpeechRecognition.addListener("partialResults", (data: any) => {
        clearTimeout(this.voiceTimer)
        if ('value' in data) {
          if (data.value.length > 0) {
            this.voiceWord = data.value;
            this.changeDetectorRef.detectChanges();
          }
        } else {
          if (data.matches.length > 0) {
            this.voiceWord = data.matches;
            this.changeDetectorRef.detectChanges();
          }
        }
        this.voiceTimer = setTimeout(() => {
          this.searchWord = this.voiceWord;
          (document.getElementById('voiceSearch') as HTMLDivElement).click();
        }, 1000);
      });
    }
  }

  // Stop to listen voice
  async stopRecognition() {
    this.recording = false;
    this.searchGo(this.voiceWord);
    this.closeVoiceModal();
  }
  async closeVoiceModal() {
    this.menuNavbar.classList.remove('hide-search')
    this.recording = false;
    await SpeechRecognition.stop();
  }

  // Get Recent Search
  getRecentData() {
    this.recentSearch = JSON.parse(localStorage.getItem('recentSearch')) || [];
    this.recentSearch = JSON.parse(localStorage.getItem('recentSearch')) || [];
  }

  // Open Search
  openSearch(value) {
    this.showSearch = value;
    let search = document.getElementById('search') as HTMLInputElement;
    if (value) {
      this.menuNavbar.classList.add('hide-search')
      search.focus();
    } else {
      this.menuNavbar.classList.remove('hide-search')
    }
  }

  // On Search
  onSearch() {
    this.searchIsLoading = true;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.apiService.get(`products-live-search?search=${this.searchWord}`).subscribe((res: any) => {
        this.searchResult = res.result
        this.searchIsLoading = false;
      }, err => {
        this.searchResult = [];
        this.searchIsLoading = false;
      });
    }, 300);
  }
  searchGo(text) {
    setTimeout(() => {
      this.searchWord = '';
      this.router.navigate([`home/search/result/${text.title.replaceAll('/', '|||')}?language=${text.language || 'en'}`]);
      let menuNavbar = document.getElementById('menuNavbar') as HTMLDivElement;
      menuNavbar.classList.remove('hide-search')
    }, 1);
    this.showSearch = false;
    // Save Recent Search
    if (this.recentSearch.indexOf(text) > -1) {
      this.recentSearch.splice(this.recentSearch.indexOf(text), 1)
    }
    this.recentSearch.push(text);
    localStorage.setItem('recentSearch', JSON.stringify(this.recentSearch));
  }
  // Delete Recent Search
  deleteRecentSearch(getText) {
    this.recentSearch.splice(this.recentSearch.indexOf(getText), 1)
    localStorage.setItem('recentSearch', JSON.stringify(this.recentSearch));
  }
  clearRecentSearch() {
    this.recentSearch = [];
    localStorage.removeItem('recentSearch');
  }

  // Back to Previewus Route
  back() {
    window.history.back();
  }

}
