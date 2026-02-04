import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountingComponent } from './accounting.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { JournalEntryComponent } from './transactions/journal-entry/journal-entry.component';
import { BalanceSheetComponent } from './reports/balance-sheet.component';
import { ProfitLossComponent } from './reports/profit-loss.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { 
    path: '', 
    component: AccountingComponent,
    children: [
      { path: '', redirectTo: 'transactions', pathMatch: 'full' },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'journal-entry', component: JournalEntryComponent },
      { path: 'chart-of-accounts', component: ChartOfAccountsComponent },
      { path: 'balance-sheet', component: BalanceSheetComponent },
      { path: 'profit-loss', component: ProfitLossComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AccountingComponent,
    TransactionsComponent,
    ChartOfAccountsComponent,
    JournalEntryComponent,
    BalanceSheetComponent,
    ProfitLossComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountingModule { }
