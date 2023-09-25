import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { OtherService } from '../../services/other.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit {

  currencies: any = []
  selectedCurrency: number = null;

  constructor(
    private otherService: OtherService,
    public apiService: ApiService,
  ) {
    this.currencies = otherService.currencies;
    this.selectedCurrency = otherService.selectedCurrency;
  }

  ngOnInit() { }

  // Set Currency
  setCurrrency(getCurrency) {
    this.selectedCurrency = getCurrency.id;
    this.otherService.setCurrency(getCurrency);
    this.selectedCurrency = this.otherService.selectedCurrency;
    // Get Currency
    this.apiService.get(`currency/get-exchange/2`).subscribe((res: any) => {
      localStorage.setItem('currency', res.result.exchange_rate)
      this.otherService.exchangeRate = res.result.exchange_rate;
    })
  }

}
