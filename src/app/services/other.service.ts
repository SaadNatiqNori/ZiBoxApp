import { TranslateService } from "@ngx-translate/core";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { ModalController } from '@ionic/angular'; // Modal Controller
import { NotificationComponent } from "src/app/shared/notification/notification.component";
import { LanguageComponent } from "src/app/shared/language/language.component";
import { SignPage } from "src/app/shared/sign/sign.page";
import { ProfileService } from "./profile.service";
import { CurrencyComponent } from "../shared/currency/currency.component";
import { ApiService } from "./api.service";

const LNG_KEY = 'SELECTED_LANGUAGE';
const LNG_DIR = 'LANGUAGE_DIRECTION';
const CUR_KEY = 'SELECTED_CURRENCY';

@Injectable({
  providedIn: 'root'
})
export class OtherService {

  // For Check the user is login or not
  isLogin: boolean = false;
  languageIsChanging: boolean = false;
  firstTimeLaunch: boolean = true;
  checkInternet: boolean = true;

  // Language
  languages: any = [
    { label: 'English', code: 'en', dir: 'ltr' },
    { label: 'کوردی', code: 'ku_s', dir: 'rtl' },
    { label: 'العربية', code: 'ar', dir: 'rtl' },
    { label: 'فارسی', code: 'fa', dir: 'rtl' },
    { label: 'Kurdî', code: 'ku_k', dir: 'ltr' },
    { label: 'Türkçe', code: 'tr', dir: 'ltr' },
    { label: 'Русский', code: 'ru', dir: 'ltr' },
    { label: 'Українська', code: 'uk', dir: 'ltr' },
  ]
  direction: string = 'ltr';
  actionDirection: string = 'start';
  selected: string = 'en';
  language: string = 'English';
  // Cuurency
  currencies: any = [
    { id: 2, label: '$' },
    { id: 4, label: 'IQD' },
  ]
  selectedCurrency: number = 4;
  currency: string = 'IQD';
  exchangeRate = 0;

  constructor(
    private translate: TranslateService,
    private profile: ProfileService,
    private apiService: ApiService,
    private storage: Storage,
    private modalCtrl: ModalController, // Modal Controller
  ) { }

  setInitialAppLanguage() {
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language)
    this.storage.create();
    // Language
    this.storage.get(LNG_KEY).then(val => {
      if (val) {
        var language = this.languages.filter(lang => lang.code == val)[0]
        this.language = language.label;
        this.setLanguage(language);
        this.selected = val || 'en';
      }
    });
    // Currency
    this.storage.get(CUR_KEY).then(val => {
      if (val) {
        var currency = this.currencies.filter(cur => cur.id == val)[0]
        this.currency = currency.label;
        this.setCurrency(currency);
        this.selectedCurrency = val || 4;
      }
    });
    this.exchangeRate = parseFloat(localStorage.getItem('currency')) || 0;
  }

  // Change Language
  setLanguage(lng) {
    this.translate.use(lng.code);
    this.storage.set(LNG_KEY, lng.code);
    this.storage.set(LNG_DIR, lng.dir);
    this.selected = lng.code;
    this.language = lng.label;
    this.direction = lng.dir;
    this.actionDirection = lng.dir == 'ltr' ? 'start' : 'end';
    this.getAllCategories()
    setTimeout(() => {
      this.languageIsChanging = false;
    }, 1500);
  }

  // Change Currency
  setCurrency(cur) {
    this.storage.set(CUR_KEY, cur.id);
    this.selectedCurrency = cur.id;
    this.currency = cur.label;
    this.modalCtrl.dismiss();
  }

  // Comma
  comma(value: string, currency_id?): string {
    let price: any = parseFloat(value)
    const numberFormatter = Intl.NumberFormat('en-US');
    // Currency Type
    if (this.selectedCurrency === 2) {
      try {
        if (currency_id === 4) {
          price = (parseFloat(value) / parseFloat(localStorage.getItem('currency')) || 0).toFixed(2)
        }
      } catch (error) {
        price = parseFloat(value).toFixed(2);
      }
    } else if (this.selectedCurrency === 4) {
      try {
        if (currency_id === 2) {
          price = (parseInt((parseFloat(value) * parseFloat(localStorage.getItem('currency'))).toString()) || 0).toFixed(0)
        }
      } catch (error) {
        price = parseFloat(value).toFixed(0);
      }
    }
    return numberFormatter.format(price);
  }

  // Open Language Modal
  async openLanguages() {
    const modal = await this.modalCtrl.create({
      component: LanguageComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75, 1]
    },);
    modal.present();
  }

  // Open Currency Modal
  async openCurrency() {
    const modal = await this.modalCtrl.create({
      component: CurrencyComponent,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 0.75, 1]
    },);
    modal.present();
  }

  // Open Notification Modal
  async openNotifications() {
    if (this.profile.isLogin) {
      const modal = await this.modalCtrl.create({
        component: NotificationComponent,
        initialBreakpoint: 0.75,
        breakpoints: [0, 0.25, 0.5, 0.75, 1]
      },);
      modal.present();
    } else {
      this.openSign()
    }
  }

  // Open Sign Page (Sign-In & Sign-Out)
  async openSign() {
    const modal = await this.modalCtrl.create({
      component: SignPage
    },);
    modal.present();
  }

  // All Categories
  getAllCategories() {
    this.apiService.get(`categories-full?lang=${this.selected}`).subscribe((res: any) => {
      this.storage.create();
      this.storage.set('all-categories', res.result)
    })
  }
}