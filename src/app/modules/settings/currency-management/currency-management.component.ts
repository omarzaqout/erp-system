import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyManagementService, Currency, ExchangeRate } from '../../../core/services/currency-management.service';
import { ModalService } from '../../../shared/services/modal.service';
import { FormConfig } from '../../../shared/components/shared-form/shared-form.component';

@Component({
  selector: 'app-currency-management',
  templateUrl: './currency-management.component.html',
  styleUrls: ['./currency-management.component.scss']
})
export class CurrencyManagementComponent implements OnInit {
  currencies: Currency[] = [];
  baseCurrency: string = 'USD';
  selectedCurrency: Currency | null = null;
  exchangeRateHistory: ExchangeRate[] = [];
  
  // View state
  activeTab: 'currencies' | 'rates' = 'currencies';

  constructor(
    private currencyService: CurrencyManagementService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for tab query param
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'rates' || params['tab'] === 'currencies') {
        this.activeTab = params['tab'];
      }
    });

    this.currencyService.currencies$.subscribe(currencies => {
      this.currencies = currencies;
    });

    this.currencyService.baseCurrency$.subscribe(base => {
      this.baseCurrency = base;
    });
  }

  setActiveTab(tab: 'currencies' | 'rates') {
    this.activeTab = tab;
  }

  addCurrency() {
    const formConfig: FormConfig = {
      fields: [
        {
          key: 'CurrCode',
          label: 'Currency Code',
          type: 'text',
          required: true,
          placeholder: 'e.g., USD, EUR, IQD'
        },
        {
          key: 'CurrName',
          label: 'Currency Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., US Dollar'
        },
        {
          key: 'DocCurrCod',
          label: 'Symbol',
          type: 'text',
          required: true,
          placeholder: 'e.g., $, €, ع.د'
        },
        {
          key: 'Rate',
          label: 'Exchange Rate',
          type: 'number',
          required: true,
          placeholder: `Rate against ${this.baseCurrency}`
        }
      ],
      submitLabel: 'Add Currency',
      layout: 'two-column'
    };

    this.modalService.openForm({
      title: 'Add New Currency (OCRN)',
      icon: 'fas fa-coins',
      size: 'lg',
      formConfig,
      initialData: { Rate: 1, Locked: 'N' },
      onSubmit: (data) => {
        try {
          const newCurrency: Currency = {
            CurrCode: data.CurrCode.toUpperCase(),
            CurrName: data.CurrName,
            DocCurrCod: data.DocCurrCod,
            Rate: parseFloat(data.Rate),
            Locked: 'N',
            UserSign: 1,
            UserDate: new Date()
          };
          this.currencyService.addCurrency(newCurrency);
          
          // Add initial exchange rate to ORTT
          this.currencyService.addExchangeRate({
            RateDate: new Date(),
            Currency: newCurrency.CurrCode,
            Rate: newCurrency.Rate,
            RefCurrncy: this.baseCurrency
          });
          
          this.modalService.close();
        } catch (error: any) {
          alert(error.message);
        }
      }
    });
  }

  editCurrency(currency: Currency) {
    const formConfig: FormConfig = {
      fields: [
        {
          key: 'CurrCode',
          label: 'Currency Code',
          type: 'text',
          required: true,
          disabled: true
        },
        {
          key: 'CurrName',
          label: 'Currency Name',
          type: 'text',
          required: true
        },
        {
          key: 'DocCurrCod',
          label: 'Symbol',
          type: 'text',
          required: true
        },
        {
          key: 'Rate',
          label: 'Exchange Rate',
          type: 'number',
          required: true
        }
      ],
      submitLabel: 'Update Currency',
      layout: 'two-column'
    };

    this.modalService.openForm({
      title: `Edit Currency: ${currency.CurrCode}`,
      icon: 'fas fa-edit',
      size: 'lg',
      formConfig,
      initialData: currency,
      onSubmit: (data) => {
        const updated: Currency = {
          ...currency,
          CurrName: data.CurrName,
          DocCurrCod: data.DocCurrCod,
          Rate: parseFloat(data.Rate)
        };
        this.currencyService.updateCurrency(updated);
        this.modalService.close();
      }
    });
  }

  deleteCurrency(currCode: string) {
    this.modalService.open({
      title: 'Confirm Delete',
      size: 'sm',
      body: `<div class="text-center">
              <i class="fas fa-exclamation-triangle text-warning mb-3" style="font-size: 3rem;"></i>
              <p>Are you sure you want to delete currency <strong>${currCode}</strong>?</p>
              <p class="text-muted small">This will also remove all exchange rate history.</p>
             </div>`,
      buttons: [
        {
          label: 'Cancel',
          class: 'btn-secondary',
          action: () => {}
        },
        {
          label: 'Delete',
          class: 'btn-danger',
          action: () => {
            this.currencyService.deleteCurrency(currCode);
          }
        }
      ]
    });
  }

  toggleLock(currency: Currency) {
    this.currencyService.toggleCurrencyLock(currency.CurrCode);
  }

  setAsBase(currCode: string) {
    this.currencyService.setBaseCurrency(currCode);
  }

  viewRateHistory(currency: Currency) {
    this.selectedCurrency = currency;
    this.exchangeRateHistory = this.currencyService.getExchangeRateHistory(currency.CurrCode);
  }

  addExchangeRate() {
    if (!this.selectedCurrency) return;

    const formConfig: FormConfig = {
      fields: [
        {
          key: 'RateDate',
          label: 'Rate Date',
          type: 'date',
          required: true
        },
        {
          key: 'Rate',
          label: 'Exchange Rate',
          type: 'number',
          required: true,
          placeholder: `Rate against ${this.baseCurrency}`
        }
      ],
      submitLabel: 'Add Rate',
      layout: 'single'
    };

    this.modalService.openForm({
      title: `Add Exchange Rate for ${this.selectedCurrency.CurrCode}`,
      icon: 'fas fa-chart-line',
      size: 'md',
      formConfig,
      initialData: { RateDate: new Date().toISOString().split('T')[0] },
      onSubmit: (data) => {
        const newRate: ExchangeRate = {
          RateDate: new Date(data.RateDate),
          Currency: this.selectedCurrency!.CurrCode,
          Rate: parseFloat(data.Rate),
          RefCurrncy: this.baseCurrency
        };
        this.currencyService.addExchangeRate(newRate);
        this.exchangeRateHistory = this.currencyService.getExchangeRateHistory(this.selectedCurrency!.CurrCode);
        this.modalService.close();
      }
    });
  }

  closeRateHistory() {
    this.selectedCurrency = null;
    this.exchangeRateHistory = [];
  }

  exportCurrencies() {
    const headers = ['Code', 'Name', 'Symbol', 'Rate', 'Status', 'Last Updated'];
    const rows = this.currencies.map(c => [
      c.CurrCode,
      c.CurrName,
      c.DocCurrCod,
      c.Rate,
      c.Locked === 'Y' ? 'Locked' : 'Active',
      c.UserDate?.toLocaleDateString() || ''
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OCRN_Currencies_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
