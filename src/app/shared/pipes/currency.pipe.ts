import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService, CurrencyConfig } from '../../core/services/currency.service';

@Pipe({
  name: 'erpCurrency',
  pure: false
})
export class CurrencyPipe implements PipeTransform {
  private config: CurrencyConfig | null = null;

  constructor(private currencyService: CurrencyService) {
    this.currencyService.config$.subscribe(config => {
      this.config = config;
    });
  }

  transform(value: number | null | undefined, currencyCode?: string): string {
    if (value === null || value === undefined) value = 0;
    if (!this.config) return value.toFixed(2);
    
    // Use provided currency code or default to base currency
    const displayCurrency = currencyCode || this.config.baseCurrency;
    const symbol = this.currencyService.getSymbol(displayCurrency);
    
    // If a specific currency is requested and it's different from base, convert
    let amount = value;
    if (currencyCode && currencyCode !== this.config.baseCurrency) {
      amount = this.currencyService.convert(value, this.config.baseCurrency, currencyCode);
    }
    
    const formattedValue = amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return `${symbol}${formattedValue}`;
  }
}
