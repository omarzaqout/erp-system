import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// OCRN - Currency Table (SAP B1)
export interface Currency {
  CurrCode: string;        // Currency code (e.g., "USD", "EUR")
  CurrName: string;        // Full name of the currency
  DocCurrCod: string;      // Currency symbol/abbreviation (for UI)
  Rate: number;            // Last recorded exchange rate
  Locked: 'Y' | 'N';       // 'Y' or 'N' - indicates if the currency is active
  UserSign?: number;       // User who created or modified the record
  UserDate?: Date;         // Date of creation or modification
}

// ORTT - Currency Exchange Rates Table (SAP B1)
export interface ExchangeRate {
  RateDate: Date;          // Date of the exchange rate
  Currency: string;        // Currency code (foreign currency)
  Rate: number;            // Exchange rate against base currency
  RefCurrncy: string;      // Reference currency (usually the local currency)
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyManagementService {
  // OCRN - Currencies
  private _currencies = new BehaviorSubject<Currency[]>([
    {
      CurrCode: 'USD',
      CurrName: 'US Dollar',
      DocCurrCod: '$',
      Rate: 1,
      Locked: 'N',
      UserSign: 1,
      UserDate: new Date()
    },
    {
      CurrCode: 'IQD',
      CurrName: 'Iraqi Dinar',
      DocCurrCod: 'ع.د',
      Rate: 1310,
      Locked: 'N',
      UserSign: 1,
      UserDate: new Date()
    },
    {
      CurrCode: 'EUR',
      CurrName: 'Euro',
      DocCurrCod: '€',
      Rate: 0.92,
      Locked: 'N',
      UserSign: 1,
      UserDate: new Date()
    },
    {
      CurrCode: 'GBP',
      CurrName: 'British Pound',
      DocCurrCod: '£',
      Rate: 0.79,
      Locked: 'N',
      UserSign: 1,
      UserDate: new Date()
    }
  ]);

  // ORTT - Exchange Rates History
  private _exchangeRates = new BehaviorSubject<ExchangeRate[]>([
    {
      RateDate: new Date('2026-02-01'),
      Currency: 'IQD',
      Rate: 1305,
      RefCurrncy: 'USD'
    },
    {
      RateDate: new Date('2026-02-02'),
      Currency: 'IQD',
      Rate: 1308,
      RefCurrncy: 'USD'
    },
    {
      RateDate: new Date('2026-02-04'),
      Currency: 'IQD',
      Rate: 1310,
      RefCurrncy: 'USD'
    },
    {
      RateDate: new Date('2026-02-04'),
      Currency: 'EUR',
      Rate: 0.92,
      RefCurrncy: 'USD'
    }
  ]);

  private _baseCurrency = new BehaviorSubject<string>('USD');

  public currencies$ = this._currencies.asObservable();
  public exchangeRates$ = this._exchangeRates.asObservable();
  public baseCurrency$ = this._baseCurrency.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const savedCurrencies = localStorage.getItem('erp_ocrn_currencies');
    if (savedCurrencies) {
      this._currencies.next(JSON.parse(savedCurrencies));
    }

    const savedRates = localStorage.getItem('erp_ortt_rates');
    if (savedRates) {
      const rates = JSON.parse(savedRates);
      rates.forEach((r: any) => r.RateDate = new Date(r.RateDate));
      this._exchangeRates.next(rates);
    }

    const savedBase = localStorage.getItem('erp_base_currency');
    if (savedBase) {
      this._baseCurrency.next(savedBase);
    }
  }

  private saveToStorage() {
    localStorage.setItem('erp_ocrn_currencies', JSON.stringify(this._currencies.value));
    localStorage.setItem('erp_ortt_rates', JSON.stringify(this._exchangeRates.value));
    localStorage.setItem('erp_base_currency', this._baseCurrency.value);
  }

  // OCRN Operations
  addCurrency(currency: Currency) {
    const current = this._currencies.value;
    if (current.some(c => c.CurrCode === currency.CurrCode)) {
      throw new Error('Currency already exists');
    }
    currency.UserDate = new Date();
    this._currencies.next([...current, currency]);
    this.saveToStorage();
  }

  updateCurrency(currency: Currency) {
    const current = this._currencies.value;
    const index = current.findIndex(c => c.CurrCode === currency.CurrCode);
    if (index !== -1) {
      currency.UserDate = new Date();
      current[index] = currency;
      this._currencies.next([...current]);
      this.saveToStorage();
    }
  }

  deleteCurrency(currCode: string) {
    const current = this._currencies.value;
    this._currencies.next(current.filter(c => c.CurrCode !== currCode));
    this.saveToStorage();
  }

  toggleCurrencyLock(currCode: string) {
    const current = this._currencies.value;
    const currency = current.find(c => c.CurrCode === currCode);
    if (currency) {
      currency.Locked = currency.Locked === 'Y' ? 'N' : 'Y';
      currency.UserDate = new Date();
      this._currencies.next([...current]);
      this.saveToStorage();
    }
  }

  // ORTT Operations
  addExchangeRate(rate: ExchangeRate) {
    const current = this._exchangeRates.value;
    this._exchangeRates.next([...current, rate]);
    
    // Update currency's last rate
    this.updateCurrencyRate(rate.Currency, rate.Rate);
    this.saveToStorage();
  }

  private updateCurrencyRate(currCode: string, rate: number) {
    const currencies = this._currencies.value;
    const currency = currencies.find(c => c.CurrCode === currCode);
    if (currency) {
      currency.Rate = rate;
      currency.UserDate = new Date();
      this._currencies.next([...currencies]);
    }
  }

  getExchangeRateHistory(currCode: string): ExchangeRate[] {
    return this._exchangeRates.value
      .filter(r => r.Currency === currCode)
      .sort((a, b) => b.RateDate.getTime() - a.RateDate.getTime());
  }

  setBaseCurrency(currCode: string) {
    this._baseCurrency.next(currCode);
    this.saveToStorage();
  }

  get baseCurrency(): string {
    return this._baseCurrency.value;
  }

  getCurrency(currCode: string): Currency | undefined {
    return this._currencies.value.find(c => c.CurrCode === currCode);
  }

  getActiveCurrencies(): Currency[] {
    return this._currencies.value.filter(c => c.Locked === 'N');
  }
}
