import { Component, OnInit } from '@angular/core';
import { AccountingService, Account } from '../services/accounting.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-balance-sheet',
  template: `
    <div class="balance-sheet">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>{{ 'Balance Sheet' | translate }}</h3>
        <div class="text-muted">{{ 'As of' | translate }} {{ today | date }}</div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white border-bottom fw-bold text-primary">
              {{ 'Assets' | translate }}
            </div>
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <tbody>
                  <tr *ngFor="let acc of assets$ | async">
                    <td class="ps-4">{{ acc.AcctName | translate }}</td>
                    <td class="text-end pe-4">{{ acc.CurrTotal | erpCurrency }}</td>
                  </tr>
                </tbody>
                <tfoot class="table-light">
                  <tr class="fw-bold">
                    <td class="ps-4">{{ 'Total Assets' | translate }}</td>
                    <td class="text-end pe-4 text-primary">{{ totalAssets$ | async | erpCurrency }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <!-- Liabilities -->
          <div class="card border-0 shadow-sm mb-4">
             <div class="card-header bg-white border-bottom fw-bold text-danger">
              {{ 'Liabilities' | translate }}
            </div>
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <tbody>
                  <tr *ngFor="let acc of liabilities$ | async">
                    <td class="ps-4">{{ acc.AcctName | translate }}</td>
                    <td class="text-end pe-4">{{ acc.CurrTotal | erpCurrency }}</td>
                  </tr>
                </tbody>
                <tfoot class="table-light">
                   <tr class="fw-bold">
                    <td class="ps-4">{{ 'Total Liabilities' | translate }}</td>
                    <td class="text-end pe-4 text-danger">{{ totalLiabilities$ | async | erpCurrency }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Equity -->
          <div class="card border-0 shadow-sm">
             <div class="card-header bg-white border-bottom fw-bold text-success">
              {{ 'Equity' | translate }}
            </div>
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <tbody>
                  <tr *ngFor="let acc of equity$ | async">
                    <td class="ps-4">{{ acc.AcctName | translate }}</td>
                    <td class="text-end pe-4">{{ acc.CurrTotal | erpCurrency }}</td>
                  </tr>
                </tbody>
                <tfoot class="table-light">
                   <tr class="fw-bold">
                    <td class="ps-4">{{ 'Total Equity' | translate }}</td>
                    <td class="text-end pe-4 text-success">{{ totalEquity$ | async | erpCurrency }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Accounting Equation Check -->
      <div class="alert mt-4" [class.alert-success]="isBalanced$ | async" [class.alert-danger]="!(isBalanced$ | async)">
        <div class="d-flex justify-content-between align-items-center">
            <span>
                <i class="fas" [class.fa-check-circle]="isBalanced$ | async" [class.fa-exclamation-triangle]="!(isBalanced$ | async)"></i>
                {{ (isBalanced$ | async) ? ('Accounts are balanced' | translate) : ('Warning: Assets != Liabilities + Equity' | translate) }}
            </span>
            <span class="fw-bold">
                {{ 'Difference' | translate }}: {{ diff$ | async | erpCurrency }}
            </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th, .table td {
      border-top: none;
      padding: 0.75rem 1rem;
    }
  `]
})
export class BalanceSheetComponent implements OnInit {
  today = new Date();
  
  assets$: Observable<Account[]>;
  liabilities$: Observable<Account[]>;
  equity$: Observable<Account[]>;
  
  totalAssets$: Observable<number>;
  totalLiabilities$: Observable<number>;
  totalEquity$: Observable<number>;
  
  isBalanced$: Observable<boolean>;
  diff$: Observable<number>;

  constructor(private accountingService: AccountingService) {
    // SAP Group Masks: 1=Assets, 2=Liabilities, 3=Equity
    this.assets$ = this.accountingService.accounts$.pipe(map(accs => accs.filter(a => a.GroupMask === 1 && a.Postable === 'Y')));
    this.liabilities$ = this.accountingService.accounts$.pipe(map(accs => accs.filter(a => a.GroupMask === 2 && a.Postable === 'Y')));
    this.equity$ = this.accountingService.accounts$.pipe(map(accs => accs.filter(a => a.GroupMask === 3 && a.Postable === 'Y')));

    this.totalAssets$ = this.assets$.pipe(map(accs => accs.reduce((sum, a) => sum + a.CurrTotal, 0)));
    this.totalLiabilities$ = this.liabilities$.pipe(map(accs => accs.reduce((sum, a) => sum + a.CurrTotal, 0)));
    this.totalEquity$ = this.equity$.pipe(map(accs => accs.reduce((sum, a) => sum + a.CurrTotal, 0)));

    this.diff$ = this.accountingService.accounts$.pipe(
        map(accs => {
            const assets = accs.filter(a => a.GroupMask === 1 && a.Postable === 'Y').reduce((sum, a) => sum + a.CurrTotal, 0);
            const liab = accs.filter(a => a.GroupMask === 2 && a.Postable === 'Y').reduce((sum, a) => sum + a.CurrTotal, 0);
            const equity = accs.filter(a => a.GroupMask === 3 && a.Postable === 'Y').reduce((sum, a) => sum + a.CurrTotal, 0);
            return assets - (liab + equity);
        })
    );

    this.isBalanced$ = this.diff$.pipe(map(diff => Math.abs(diff) < 0.01));
  }

  ngOnInit(): void {}
}
