import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TaxConfig {
    id: string;
    name: string;
    rate: number; // e.g., 15 for 15%
    enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private _taxConfig = new BehaviorSubject<TaxConfig>({
      id: 'VAT',
      name: 'VAT',
      rate: 15,
      enabled: true
  });
  
  public taxConfig$ = this._taxConfig.asObservable();

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const saved = localStorage.getItem('erp_tax_config');
    if (saved) {
      this._taxConfig.next(JSON.parse(saved));
    }
  }

  updateConfig(config: TaxConfig) {
    this._taxConfig.next(config);
    localStorage.setItem('erp_tax_config', JSON.stringify(config));
  }

  calculateTax(amount: number): number {
    const config = this._taxConfig.value;
    if (!config.enabled) return 0;
    return (amount * config.rate) / 100;
  }
}
