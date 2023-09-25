import { Component, OnInit } from '@angular/core';
import { OtherService } from "src/app/services/other.service";
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { SpeechRecognition, SpeechRecognitionPlugin } from "@capacitor-community/speech-recognition";
import { registerPlugin } from "@capacitor/core";
import { App } from '@capacitor/app';

@Component({
  selector: 'zi-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {

  closeOnboarding: boolean = false;
  languages = [];
  selectLanguage: string = 'en';
  langIsLoading: boolean = false;
  slide = [];
  // Loading
  welcomeDelay: boolean = false;
  allowLocationLoading: boolean = false;
  allowNotificationLoading: boolean = false;
  allowVoiceLoading: boolean = false;

  constructor(
    private otherService: OtherService,
  ) {
    setTimeout(() => {
      this.welcomeDelay = true;
    }, 100);
    this.languages = otherService.languages;
  }

  ngOnInit() {
  }

  changeLanguage() {
    this.langIsLoading = true;
    let getLanguage = this.languages.filter(lang => lang.code == this.selectLanguage)[0];
    this.otherService.setLanguage(getLanguage)
    setTimeout(() => {
      this.slide.push('permission');
      localStorage.setItem('firstTimeLaunch', 'false')
    }, 500);
    setTimeout(() => {
      this.slide.push('location');
    }, 1000);
  }

  async allowLocation() {
    this.allowLocationLoading = true;
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.slide.pop();
      this.slide.push('notification');
      return;
    }
    Geolocation.getCurrentPosition().then(data => {
      this.slide.pop();
      this.slide.push('notification');
    }).catch(err => {
      this.allowLocationLoading = false;
    });
  }

  allowNotification() {
    this.allowNotificationLoading = true;
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
        this.slide.pop();
        this.slide.push('voice');
      } else {
        this.allowNotificationLoading = false;
      }
    });
  }

  allowVoice() {
    this.allowVoiceLoading = true;
    SpeechRecognition.requestPermission();
    if (SpeechRecognition.hasPermission()) {
      setTimeout(() => {
        this.allowVoiceLoading = false;
        this.otherService.firstTimeLaunch = false;
      }, 1500);
    }
  }

  skipLocation() {
    this.slide.pop();
    this.slide.push('notification');
  }

  skipNotification() {
    this.slide.pop();
    this.slide.push('voice');
  }

  skipVoice() {
    this.otherService.firstTimeLaunch = false;
    this.closeOnboarding = true;
  }

}
