import { Component, OnInit } from '@angular/core';
import { AccountingService, Account } from '../services/accounting.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-profit-loss',
  template: `
    <div class="profit-loss">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>{{ 'Profit & Loss Statement' | translate }}</h3>
        <div class="text-muted">{{ 'Period' | translate }}: {{ 'Year to Date' | translate }}</div>
      </div>

      <div class="card border-0 shadow-sm overflow-hidden">
        <div class="card-body p-0">
          <table class="table mb-0">
            <tbody>
              <!-- Revenue Section -->
              <tr class="category-header">
                <td class="ps-4 fw-bold">{{ 'Revenue' | translate }}</td>
                <td class="text-end pe-4 fw-bold">{{ 'Total' | translate }}</td>
              </tr>
              <tr *ngFor="let acc of revenue$ | async">
                <td class="ps-4 text-muted small">{{ acc.AcctName | translate }}</td>
                <td class="text-end pe-4">{{ acc.CurrTotal | erpCurrency }}</td>
              </tr>
              <tr class="total-row">
                <td class="ps-4">{{ 'Total Revenue' | translate }}</td>
                <td class="text-end pe-4 text-success">{{ totalRevenue$ | async | erpCurrency }}</td>
              </tr>

              <tr class="spacer-row"><td colspan="2"></td></tr>

              <!-- Cost of Sales Section -->
              <tr class="category-header">
                <td class="ps-4 fw-bold">{{ 'Cost of Sales / Purchasing' | translate }}</td>
                <td class="text-end pe-4"></td>
              </tr>
              <tr *ngFor="let acc of costOfSales$ | async">
                <td class="ps-4 text-muted small">{{ acc.AcctName | translate }}</td>
                <td class="text-end pe-4">({{ acc.CurrTotal | erpCurrency }})</td>
              </tr>
              <tr class="total-row border-top">
                <td class="ps-4">{{ 'Total Cost of Sales' | translate }}</td>
                <td class="text-end pe-4">({{ totalCostOfSales$ | async | erpCurrency }})</td>
              </tr>

              <tr class="profit-row success">
                <td class="ps-4 fw-bold">{{ 'Gross Profit' | translate }}</td>
                <td class="text-end pe-4 fw-bold text-success">{{ grossProfit$ | async | erpCurrency }}</td>
              </tr>

              <tr class="spacer-row"><td colspan="2"></td></tr>

              <!-- Expenses Section -->
              <tr class="category-header">
                <td class="ps-4 fw-bold">{{ 'Operating Expenses' | translate }}</td>
                <td class="text-end pe-4"></td>
              </tr>
              <tr *ngFor="let acc of expenses$ | async">
                <td class="ps-4 text-muted small">{{ acc.AcctName | translate }}</td>
                <td class="text-end pe-4">({{ acc.CurrTotal | erpCurrency }})</td>
              </tr>
              <tr class="total-row">
                <td class="ps-4">{{ 'Total Operating Expenses' | translate }}</td>
                <td class="text-end pe-4 text-danger">({{ totalExpenses$ | async | erpCurrency }})</td>
              </tr>
            </tbody>
            <tfoot class="net-income-row">
              <tr class="fw-bold fs-5">
                <td class="ps-4">{{ 'Net Income' | translate }}</td>
                <td class="text-end pe-4 text-primary">{{ netIncome$ | async | erpCurrency }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div class="mt-4 text-center text-muted small">
        <p>{{ '* This report is generated dynamically from the General Ledger' | translate }}</p>
      </div>
    </div>
  `,
  styles: [`
    .table td { border: none !important; }
    
    .category-header {
      background-color: var(--table-header-bg) !important;
      color: var(--text-dark);
      border-bottom: 2px solid var(--border) !important;
    }
    
    .total-row {
      background-color: rgba(var(--primary-blue-rgb), 0.05) !important;
      font-weight: 600;
      color: var(--text-dark);
    }
    
    .profit-row.success {
      background-color: rgba(40, 167, 69, 0.1) !important;
      color: var(--success-green);
    }
    
    .net-income-row {
      background-color: rgba(var(--primary-blue-rgb), 0.1) !important;
      border-top: 2px solid var(--primary-blue) !important;
    }
    
    .spacer-row td {
      height: 20px;
      background-color: var(--white) !important;
    }
  `]
})
export class ProfitLossComponent implements OnInit {
  revenue$: Observable<Account[]>;
  costOfSales$: Observable<Account[]>;
  expenses$: Observable<Account[]>;
  
  totalRevenue$: Observable<number>;
  totalCostOfSales$: Observable<number>;
  grossProfit$: Observable<number>;
  totalExpenses$: Observable<number>;
  netIncome$: Observable<number>;

  constructor(private accountingService: AccountingService) {
    // SAP Group Masks: 4=Revenue, 5=Cost of Sales (Purchasing), 6=Expenses
    this.revenue$ = this.accountingService.accounts$.pipe(map(accs => accs.filter(a => a.GroupMask === 4 && a.Postable === 'Y')));
    this.costOfSales$ = this.accountingService.accounts$.pipe(map(accs => accs.filter(a => a.GroupMask === 5 && a.Postable === 'Y')));
    this.expenses$ = this.accountingService.accounts$.pipe(map(accs => accs.filter(a => a.GroupMask === 6 && a.Postable === 'Y')));

    this.totalRevenue$ = this.revenue$.pipe(map(accs => accs.reduce((sum, a) => sum + a.CurrTotal, 0)));
    this.totalCostOfSales$ = this.costOfSales$.pipe(map(accs => accs.reduce((sum, a) => sum + a.CurrTotal, 0)));
    this.totalExpenses$ = this.expenses$.pipe(map(accs => accs.reduce((sum, a) => sum + a.CurrTotal, 0)));

    this.grossProfit$ = this.accountingService.accounts$.pipe(
        map(accs => {
          const rev = accs.filter(a => a.GroupMask === 4 && a.Postable === 'Y').reduce((sum, a) => sum + a.CurrTotal, 0);
          const cos = accs.filter(a => a.GroupMask === 5 && a.Postable === 'Y').reduce((sum, a) => sum + a.CurrTotal, 0);
          return rev - cos;
        })
    );

    this.netIncome$ = this.accountingService.accounts$.pipe(
      map(accs => {
        const rev = accs.filter(a => a.GroupMask === 4 && a.Postable === 'Y').reduce((sum, a) => sum + a.CurrTotal, 0);
        const cos = accs.filter(a => a.GroupMask === 5 && a.Postable === 'Y').reduce((sum, a) => sum + a.CurrTotal, 0);
        const exp = accs.filter(a => a.GroupMask === 6 && a.Postable === 'Y').reduce((sum, a) => sum + a.CurrTotal, 0);
        return rev - cos - exp;
      })
    );
  }

  ngOnInit(): void {}
}
