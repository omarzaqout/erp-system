import { Component, OnInit, HostListener } from '@angular/core';
import { PosSessionService, PosSession } from '../../services/pos-session.service';
import { PosService } from '../../services/pos.service';
import { CurrencyService, CurrencyConfig } from '../../../../core/services/currency.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pos-container',
  templateUrl: './pos-container.component.html',
  styleUrls: ['./pos-container.component.scss']
})
export class PosContainerComponent implements OnInit {
  currentSession$: Observable<PosSession | null>;
  currencyConfig$: Observable<CurrencyConfig>;
  selectedCurrency$: Observable<string>;
  
  openingBalance: number = 0;
  actualClosingBalance: number = 0;
  
  showZReport: boolean = false;
  lastClosedSession: PosSession | null = null;
  activeMobileView: 'products' | 'cart' = 'products';
  
  get isMobile(): boolean {
    return window.innerWidth < 768;
  }
  
  // Barcode scanning buffer
  private barcodeBuffer: string = '';
  private lastKeyTime: number = 0;

  constructor(
    private sessionService: PosSessionService,
    private posService: PosService,
    private currencyService: CurrencyService
  ) {
    this.currentSession$ = this.sessionService.currentSession$;
    this.currencyConfig$ = this.currencyService.config$;
    this.selectedCurrency$ = this.currencyService.selectedCurrency$;
  }

  ngOnInit(): void { }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.sessionService.isSessionActive()) return;

    const now = Date.now();
    if (now - this.lastKeyTime > 100) {
        this.barcodeBuffer = '';
    } else {
        // High speed typing detected, could be a scanner
        this.posService.setScannerState('scanning');
    }
    this.lastKeyTime = now;

    if (event.key === 'Enter') {
        if (this.barcodeBuffer.length > 3) {
            this.posService.scanProduct(this.barcodeBuffer);
            this.barcodeBuffer = '';
            event.preventDefault();
        }
    } else if (event.key.length === 1) {
        this.barcodeBuffer += event.key;
    }
  }

  onCurrencyChange(code: string) {
    this.currencyService.setSelectedCurrency(code);
  }

  openSession() {
    if (this.openingBalance < 0) return;
    this.sessionService.startSession(this.openingBalance, 'John Doe'); 
  }

  closeSession() {
    let session: any = null;
    this.currentSession$.subscribe(s => session = s).unsubscribe();
    
    if (session) {
        const expected = session.openingBalance + session.cashSales - session.returnsAmount;
        const msg = `Expected Cash: $${expected.toFixed(2)}\nPlease enter actual cash in drawer:`;
        const actual = prompt(msg, expected.toString());
        
        if (actual !== null) {
            this.actualClosingBalance = parseFloat(actual);
            this.lastClosedSession = this.sessionService.closeSession(this.actualClosingBalance);
            this.showZReport = true;
        }
    }
  }

  printZReport() {
      window.print();
  }

  finishZReport() {
      this.showZReport = false;
      this.lastClosedSession = null;
  }
}
