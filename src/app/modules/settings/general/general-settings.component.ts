import { Component, OnInit } from '@angular/core';
import { TranslationService, Language } from '../../../core/services/translation.service';
import { CurrencyService, CurrencyConfig, Currency } from '../../../core/services/currency.service';

@Component({
  selector: 'app-general-settings',
  template: `
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white py-3">
        <h5 class="mb-0">{{ 'General Settings' | translate }}</h5>
      </div>
      <div class="card-body p-4">
        <div class="row align-items-center mb-4">
          <div class="col-md-4">
            <label class="form-label fw-bold mb-0">{{ 'Language' | translate }}</label>
            <p class="text-muted small mb-0">{{ 'Select your preferred language' | translate }}</p>
          </div>
          <div class="col-md-8">
            <select class="form-select form-select-lg" [ngModel]="currentLang" (ngModelChange)="onLanguageChange($event)">
              <option value="en">English (LTR)</option>
              <option value="ar">العربية (Arabic - RTL)</option>
            </select>
          </div>
        </div>

        <div class="row align-items-center mb-4">
          <div class="col-md-4">
            <label class="form-label fw-bold mb-0">{{ 'Date Format' | translate }}</label>
            <p class="text-muted small mb-0">{{ 'Choose how dates are displayed' | translate }}</p>
          </div>
          <div class="col-md-8">
            <select class="form-select">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        <div class="row align-items-center mb-4" *ngIf="currencyConfig">
          <div class="col-md-4">
            <label class="form-label fw-bold mb-0">{{ 'Default Display Currency' | translate }}</label>
            <p class="text-muted small mb-0">{{ 'Currency used for displaying amounts' | translate }}</p>
          </div>
          <div class="col-md-8">
            <select class="form-select" [ngModel]="currencyConfig.baseCurrency" (ngModelChange)="onBaseCurrencyChange($event)">
              <option *ngFor="let curr of currencyConfig.currencies" [value]="curr.code">
                {{ curr.code }} ({{ curr.symbol }})
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Currency Management Section -->
    <div class="card shadow-sm border-0 animated fadeIn mb-4" *ngIf="currencyConfig">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 text-primary fw-bold"><i class="fas fa-coins me-2"></i>{{ 'Currency & Exchange Rates' | translate }}</h5>
        <div class="d-flex align-items-center gap-3">
            <div class="form-check form-switch mb-0">
              <input class="form-check-input" type="checkbox" id="autoRateToggle" 
                     [(ngModel)]="currencyConfig.useAutoRates" (change)="saveCurrencyConfig()">
              <label class="form-check-label small fw-bold" for="autoRateToggle">{{ 'Auto Exchange Rates' | translate }}</label>
            </div>
            <button class="btn btn-primary btn-sm rounded-pill px-3" (click)="showAddCurrency = !showAddCurrency">
                <i class="fas fa-plus me-1"></i> {{ 'Add Currency' | translate }}
            </button>
        </div>
      </div>
      <div class="card-body p-4">
        
        <!-- Add New Currency Form -->
        <div class="card bg-light border-0 mb-4 animated slideInDown" *ngIf="showAddCurrency">
            <div class="card-body">
                <h6 class="fw-bold mb-3">{{ 'New Currency' | translate }}</h6>
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="small text-muted mb-1">{{ 'Currency Code (e.g. ILS)' | translate }}</label>
                        <input type="text" class="form-control form-control-sm" [(ngModel)]="newCurrency.code" (input)="autoDetectSymbol()" placeholder="ILS">
                    </div>
                    <div class="col-md-3">
                        <label class="small text-muted mb-1">{{ 'Symbol (e.g. ₪)' | translate }}</label>
                        <input type="text" class="form-control form-control-sm" [(ngModel)]="newCurrency.symbol" placeholder="₪">
                    </div>
                    <div class="col-md-3">
                        <label class="small text-muted mb-1">{{ 'Initial Rate' | translate }}</label>
                        <input type="number" class="form-control form-control-sm" [(ngModel)]="newCurrency.rate">
                    </div>
                    <div class="col-md-3 d-flex align-items-end">
                        <button class="btn btn-success btn-sm w-100" (click)="addNewCurrency()">
                            <i class="fas fa-check me-1"></i> {{ 'Add' | translate }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="alert alert-info py-2 small" *ngIf="currencyConfig.useAutoRates">
          <i class="fas fa-info-circle me-2"></i> {{ 'Live rates are fetched from external API. Manual editing is disabled.' | translate }}
        </div>
        
        <table class="table table-hover align-middle">
          <thead>
            <tr class="text-muted small text-uppercase">
              <th>{{ 'Currency' | translate }}</th>
              <th>{{ 'Symbol' | translate }}</th>
              <th>{{ 'Rate' | translate }} (1 {{ currencyConfig.baseCurrency }} = X)</th>
              <th class="text-end">{{ 'Actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let curr of currencyConfig.currencies">
              <td>
                <div class="fw-bold d-flex align-items-center">
                    {{ curr.code }}
                    <span class="badge bg-primary ms-2" style="font-size: 0.6rem;" *ngIf="curr.isBase">{{ 'BASE' | translate }}</span>
                </div>
              </td>
              <td class="fs-5">{{ curr.symbol }}</td>
              <td>
                <div class="input-group input-group-sm" style="max-width: 150px;">
                  <input type="number" class="form-control" [(ngModel)]="curr.rate" 
                         [disabled]="currencyConfig.useAutoRates || curr.isBase"
                         (change)="saveCurrencyConfig()">
                </div>
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" *ngIf="!curr.isBase" (click)="setAsBase(curr)">
                      {{ 'Set as Base' | translate }}
                    </button>
                    <button class="btn btn-outline-danger" *ngIf="!curr.isBase" (click)="removeCurrency(curr.code)">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .form-select-lg {
      font-size: 1rem;
      padding: 0.75rem 1.25rem;
    }
    .animated { animation-duration: 0.3s; }
  `]
})
export class GeneralSettingsComponent implements OnInit {
  currentLang: Language = 'en';
  currencyConfig: CurrencyConfig | null = null;
  
  showAddCurrency = false;
  newCurrency: Partial<Currency> = {
      code: '',
      symbol: '',
      rate: 1,
      isBase: false
  };

  constructor(
    private translationService: TranslationService,
    private currencyService: CurrencyService
  ) { }

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });

    this.currencyService.config$.subscribe(config => {
      this.currencyConfig = JSON.parse(JSON.stringify(config));
    });
  }

  onLanguageChange(lang: Language) {
    this.translationService.setLanguage(lang);
  }

  autoDetectSymbol() {
    const code = this.newCurrency.code?.toUpperCase();
    if (!code) return;

    const symbols: { [key: string]: string } = {
      'ILS': '₪',
      'USD': '$',
      'IQD': 'ع.د',
      'EUR': '€',
      'GBP': '£',
      'SAR': 'ر.س',
      'EGP': 'ج.م',
      'AED': 'د.إ',
      'KWD': 'د.ك',
      'JOD': 'د.أ',
      'TRY': '₺',
      'JPY': '¥',
      'CNY': '¥'
    };

    if (symbols[code]) {
      this.newCurrency.symbol = symbols[code];
    }
  }

  saveCurrencyConfig() {
    if (this.currencyConfig) {
      this.currencyService.updateConfig(this.currencyConfig);
    }
  }

  setAsBase(currency: Currency) {
    if (this.currencyConfig) {
      this.currencyConfig.currencies.forEach(c => {
        c.isBase = (c.code === currency.code);
        if (c.isBase) c.rate = 1;
      });
      this.currencyConfig.baseCurrency = currency.code;
      this.saveCurrencyConfig();
    }
  }

  addNewCurrency() {
    if (!this.newCurrency.code || !this.newCurrency.symbol || !this.currencyConfig) return;
    
    // Check if exists
    if (this.currencyConfig.currencies.some(c => c.code === this.newCurrency.code)) {
        alert('Currency already exists!');
        return;
    }

    this.currencyConfig.currencies.push({
        code: this.newCurrency.code.toUpperCase(),
        symbol: this.newCurrency.symbol,
        rate: this.newCurrency.rate || 1,
        isBase: false
    });

    this.saveCurrencyConfig();
    this.showAddCurrency = false;
    this.newCurrency = { code: '', symbol: '', rate: 1, isBase: false };
  }

  removeCurrency(code: string) {
      if (this.currencyConfig) {
          this.currencyConfig.currencies = this.currencyConfig.currencies.filter(c => c.code !== code);
          this.saveCurrencyConfig();
      }
  }

  onBaseCurrencyChange(newBaseCurrency: string) {
    if (!this.currencyConfig) return;
    
    const selectedCurrency = this.currencyConfig.currencies.find(c => c.code === newBaseCurrency);
    if (!selectedCurrency) return;

    // Update all currencies
    this.currencyConfig.currencies.forEach(c => {
      c.isBase = (c.code === newBaseCurrency);
      if (c.isBase) {
        c.rate = 1;
      }
    });
    
    this.currencyConfig.baseCurrency = newBaseCurrency;
    this.saveCurrencyConfig();
  }
}
