import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { AccountingEngineService } from './core/services/accounting-engine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'ERP System';
  
  constructor(
    private themeService: ThemeService,
    private accountingEngine: AccountingEngineService
  ) {
    this.accountingEngine.init();
  }
}
