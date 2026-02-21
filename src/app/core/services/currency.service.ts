import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CurrencyManagementService } from './currency-management.service';

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
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
  constructor(private currencyManagement: CurrencyManagementService) {}

  public config$ = this.currencyManagement.currencies$.pipe(
    map(currencies => ({
      baseCurrency: this.currencyManagement.baseCurrency,
      useAutoRates: false,
      currencies: currencies.map(c => ({
        code: c.CurrCode,
        symbol: c.DocCurrCod,
        rate: c.Rate,
        isBase: c.CurrCode === this.currencyManagement.baseCurrency
      }))
    }))
  );

  private _selectedCurrency = new BehaviorSubject<string>('USD');
  public selectedCurrency$ = this._selectedCurrency.asObservable();

  get config(): CurrencyConfig {
    return {
      baseCurrency: this.currencyManagement.baseCurrency,
      useAutoRates: false,
      currencies: this.currencyManagement.getActiveCurrencies().map(c => ({
        code: c.CurrCode,
        symbol: c.DocCurrCod,
        rate: c.Rate,
        isBase: c.CurrCode === this.currencyManagement.baseCurrency
      }))
    };
  }

  get selectedCurrency(): string {
    return this._selectedCurrency.value;
  }

  setSelectedCurrency(code: string) {
    this._selectedCurrency.next(code);
    localStorage.setItem('erp_selected_currency', code);
  }

  updateConfig(newConfig: CurrencyConfig) {
    // This is now managed by Financial module, but we can set base currency
    this.currencyManagement.setBaseCurrency(newConfig.baseCurrency);
  }

  getRate(code: string): number {
    const currency = this.currencyManagement.getCurrency(code);
    return currency ? currency.Rate : 1;
  }

  getSymbol(code: string): string {
    const currency = this.currencyManagement.getCurrency(code);
    return currency ? currency.DocCurrCod : '$';
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
    const currency = this.currencyManagement.getCurrency(currencyCode);
    if (!currency) return amount.toFixed(2);
    return `${currency.DocCurrCod}${amount.toFixed(2)}`;
  }
}
