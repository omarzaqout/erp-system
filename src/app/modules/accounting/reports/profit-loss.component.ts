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
            <!-- Revenue -->
            <thead class="table-light">
              <tr>
                <th class="ps-4">{{ 'Revenue' | translate }}</th>
                <th class="text-end pe-4">{{ 'Total' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let acc of revenue$ | async">
                <td class="ps-4 text-muted small">{{ acc.AcctName | translate }}</td>
                <td class="text-end pe-4">{{ acc.CurrTotal | erpCurrency }}</td>
              </tr>
              <tr class="fw-bold bg-light bg-opacity-50">
                <td class="ps-4">{{ 'Total Revenue' | translate }}</td>
                <td class="text-end pe-4 text-success">{{ totalRevenue$ | async | erpCurrency }}</td>
              </tr>

              <tr class="table-light"><td colspan="2"></td></tr>

              <!-- Cost of Sales / Purchasing -->
              <thead class="table-light">
                <tr>
                  <th class="ps-4">{{ 'Cost of Sales / Purchasing' | translate }}</th>
                  <th class="text-end pe-4"></th>
                </tr>
              </thead>
              <tr *ngFor="let acc of costOfSales$ | async">
                <td class="ps-4 text-muted small">{{ acc.AcctName | translate }}</td>
                <td class="text-end pe-4">({{ acc.CurrTotal | erpCurrency }})</td>
              </tr>
              <tr class="fw-bold bg-light bg-opacity-50 border-top">
                <td class="ps-4">{{ 'Total Cost of Sales' | translate }}</td>
                <td class="text-end pe-4">({{ totalCostOfSales$ | async | erpCurrency }})</td>
              </tr>

              <tr class="fw-bold bg-success bg-opacity-10">
                <td class="ps-4">{{ 'Gross Profit' | translate }}</td>
                <td class="text-end pe-4 text-success">{{ grossProfit$ | async | erpCurrency }}</td>
              </tr>

              <tr class="table-light"><td colspan="2"></td></tr>

              <!-- Expenses -->
              <thead class="table-light">
                <tr>
                  <th class="ps-4">{{ 'Operating Expenses' | translate }}</th>
                  <th class="text-end pe-4"></th>
                </tr>
              </thead>
              <tr *ngFor="let acc of expenses$ | async">
                <td class="ps-4 text-muted small">{{ acc.AcctName | translate }}</td>
                <td class="text-end pe-4">({{ acc.CurrTotal | erpCurrency }})</td>
              </tr>
              <tr class="fw-bold bg-light bg-opacity-50">
                <td class="ps-4">{{ 'Total Operating Expenses' | translate }}</td>
                <td class="text-end pe-4 text-danger">({{ totalExpenses$ | async | erpCurrency }})</td>
              </tr>
            </tbody>
            <tfoot class="bg-primary bg-opacity-10">
              <tr class="fw-bold fs-5 border-top border-primary">
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
    .table th { border-bottom: none; }
    .table td { border-top: none; }
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
