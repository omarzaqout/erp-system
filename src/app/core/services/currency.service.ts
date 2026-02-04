import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate relative to base currency (e.g., 1 USD = X SAR)
  isBase: boolean;
}

export interface CurrencyConfig {
  baseCurrency: string;
  useAutoRates: boolean;
  currencies: Currency[];
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private _config = new BehaviorSubject<CurrencyConfig>({
    baseCurrency: 'USD',
    useAutoRates: false,
    currencies: [
      { code: 'USD', symbol: '$', rate: 1, isBase: true },
      { code: 'IQD', symbol: 'ع.د', rate: 1310, isBase: false },
      { code: 'SAR', symbol: 'ر.س', rate: 3.75, isBase: false },
      { code: 'EGP', symbol: 'ج.م', rate: 30.85, isBase: false },
      { code: 'EUR', symbol: '€', rate: 0.92, isBase: false }
    ]
  });

  public config$ = this._config.asObservable();
  private _selectedCurrency = new BehaviorSubject<string>('USD');
  public selectedCurrency$ = this._selectedCurrency.asObservable();

  constructor() {
    this.loadConfig();
    
    // Simulate periodic auto-rate updates if enabled
    setInterval(() => {
        if (this._config.value.useAutoRates) {
            this.fetchAutoRates();
        }
    }, 30000); // Every 30 seconds
  }

  private fetchAutoRates() {
      const config = { ...this._config.value };
      config.currencies.forEach(c => {
          if (!c.isBase) {
              const fluctuation = (Math.random() - 0.5) * 0.01;
              c.rate = +(c.rate + fluctuation).toFixed(4);
          }
      });
      this._config.next(config);
  }

  private loadConfig() {
    const saved = localStorage.getItem('erp_currency_config');
    if (saved) {
      this._config.next(JSON.parse(saved));
    }
    const savedSelected = localStorage.getItem('erp_selected_currency');
    if (savedSelected) {
      this._selectedCurrency.next(savedSelected);
    }
  }

  get config(): CurrencyConfig {
    return this._config.value;
  }

  get selectedCurrency(): string {
    return this._selectedCurrency.value;
  }

  updateConfig(newConfig: CurrencyConfig) {
    this._config.next(newConfig);
    localStorage.setItem('erp_currency_config', JSON.stringify(newConfig));
  }

  setSelectedCurrency(code: string) {
    this._selectedCurrency.next(code);
    localStorage.setItem('erp_selected_currency', code);
  }

  getRate(code: string): number {
    const currency = this._config.value.currencies.find(c => c.code === code);
    return currency ? currency.rate : 1;
  }

  getSymbol(code: string): string {
    const currency = this._config.value.currencies.find(c => c.code === code);
    return currency ? currency.symbol : '$';
  }

  convert(amount: number, from: string, to: string): number {
    const fromRate = this.getRate(from);
    const toRate = this.getRate(to);
    return (amount / fromRate) * toRate;
  }

  getBaseAmount(amount: number, fromCurrency: string): number {
    const rate = this.getRate(fromCurrency);
    return amount / (rate || 1);
  }

  getFormattedAmount(amount: number, currencyCode: string): string {
    const currency = this._config.value.currencies.find(c => c.code === currencyCode);
    if (!currency) return amount.toFixed(2);
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
}
