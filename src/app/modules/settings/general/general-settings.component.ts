import { Component, OnInit } from '@angular/core';
import { TranslationService, Language } from '../../../core/services/translation.service';
import { CurrencyManagementService, Currency } from '../../../core/services/currency-management.service';
import { ThemeService, AppTheme } from '../../../core/services/theme.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {
  currentLang: Language = 'en';
  currencies: Currency[] = [];
  baseCurrency: string = 'USD';
  
  currentTheme!: AppTheme;
  presets: AppTheme[] = [];

  constructor(
    private translationService: TranslationService,
    private currencyService: CurrencyManagementService,
    private themeService: ThemeService
  ) { 
    this.presets = this.themeService.getPresets();
  }

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(lang => this.currentLang = lang);
    this.currencyService.currencies$.subscribe(currencies => this.currencies = currencies);
    this.currencyService.baseCurrency$.subscribe(base => this.baseCurrency = base);
    this.themeService.theme$.subscribe(theme => this.currentTheme = theme);
  }

  onLanguageChange(lang: Language) {
    this.translationService.setLanguage(lang);
  }

  onBaseCurrencyChange(newBase: string) {
    this.currencyService.setBaseCurrency(newBase);
  }

  updateTheme(part: Partial<AppTheme>) {
    this.themeService.updatePart(part);
  }

  applyTheme(preset: AppTheme) {
    this.themeService.applyTheme(preset);
  }

  resetTheme() {
    const defaultTheme = this.presets.find(p => p.id === 'default');
    if (defaultTheme) {
      this.themeService.applyTheme(defaultTheme);
    }
  }
}
