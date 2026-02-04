import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Account {
  AcctCode: string;       // G/L Account Code
  AcctName: string;       // G/L Account Name
  FatherNum?: string;     // Parent Account Code (FatherNum)
  GroupMask: number;      // Group Number (Drawer: 1=Assets, 2=Liabilities, etc)
  Levels: number;         // Account Level (1-10)
  Finanse: 'Y' | 'N';     // Financial Account (Title account if 'N', but SAP logic varies, let's use it for Title)
  Postable: 'Y' | 'N';    // Can be Posted to
  ActCurr: string;        // Default Account Currency
  DebCred: 'D' | 'C';     // D = Debit, C = Credit
  Active: 'Y' | 'N';      // Is Account Active
  CurrTotal: number;      // Current Balance In Local Currency
  FcunBal?: number;       // Current Balance In Foreign Currency
  FormatCode: string;     // Formatted Code
  ActType: 'N' | 'I' | 'E' | 'O'; // Account Type: I=Income, E=Expense, N=Others
  CashAccount: 'Y' | 'N'; // Cash Account
  CreateDate?: Date;
  UserSign?: number;
}

export interface JournalEntryLine {
  accountId: string; // Refers to AcctCode
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntry {
  id: string;
  date: Date;
  reference: string;
  memo: string;
  lines: JournalEntryLine[];
  status: 'Draft' | 'Posted';
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  private _accounts = new BehaviorSubject<Account[]>([
    // Assets (Group 1)
    { 
      AcctCode: '10000000', AcctName: 'ASSETS', FatherNum: undefined, GroupMask: 1, Levels: 1, 
      Finanse: 'N', Postable: 'N', ActCurr: 'USD', DebCred: 'D', Active: 'Y', 
      CurrTotal: 0, FormatCode: '1-000', ActType: 'N', CashAccount: 'N' 
    },
    { 
      AcctCode: '11000000', AcctName: 'Current Assets', FatherNum: '10000000', GroupMask: 1, Levels: 2, 
      Finanse: 'N', Postable: 'N', ActCurr: 'USD', DebCred: 'D', Active: 'Y', 
      CurrTotal: 0, FormatCode: '1-100', ActType: 'N', CashAccount: 'N' 
    },
    { 
      AcctCode: '11100000', AcctName: 'Cash and Bank', FatherNum: '11000000', GroupMask: 1, Levels: 3, 
      Finanse: 'N', Postable: 'N', ActCurr: 'USD', DebCred: 'D', Active: 'Y', 
      CurrTotal: 0, FormatCode: '1-110', ActType: 'N', CashAccount: 'Y' 
    },
    { 
      AcctCode: '11101000', AcctName: 'Petty Cash', FatherNum: '11100000', GroupMask: 1, Levels: 4, 
      Finanse: 'Y', Postable: 'Y', ActCurr: 'USD', DebCred: 'D', Active: 'Y', 
      CurrTotal: 1500, FormatCode: '1-110-01', ActType: 'N', CashAccount: 'Y' 
    },
    { 
      AcctCode: '11102000', AcctName: 'Main Bank Account', FatherNum: '11100000', GroupMask: 1, Levels: 4, 
      Finanse: 'Y', Postable: 'Y', ActCurr: 'USD', DebCred: 'D', Active: 'Y', 
      CurrTotal: 45000, FormatCode: '1-110-02', ActType: 'N', CashAccount: 'Y' 
    },
    
    // Liabilities (Group 2)
    { 
      AcctCode: '20000000', AcctName: 'LIABILITIES', FatherNum: undefined, GroupMask: 2, Levels: 1, 
      Finanse: 'N', Postable: 'N', ActCurr: 'USD', DebCred: 'C', Active: 'Y', 
      CurrTotal: 0, FormatCode: '2-000', ActType: 'N', CashAccount: 'N' 
    },
    { 
      AcctCode: '21100000', AcctName: 'Accounts Payable', FatherNum: '20000000', GroupMask: 2, Levels: 2, 
      Finanse: 'Y', Postable: 'Y', ActCurr: 'USD', DebCred: 'C', Active: 'Y', 
      CurrTotal: 25000, FormatCode: '2-110', ActType: 'N', CashAccount: 'N' 
    },

    // Equity (Group 3)
    { 
      AcctCode: '30000000', AcctName: 'EQUITY', FatherNum: undefined, GroupMask: 3, Levels: 1, 
      Finanse: 'N', Postable: 'N', ActCurr: 'USD', DebCred: 'C', Active: 'Y', 
      CurrTotal: 0, FormatCode: '3-000', ActType: 'N', CashAccount: 'N' 
    },

    // Revenue (Group 4)
    { 
      AcctCode: '40000000', AcctName: 'REVENUE', FatherNum: undefined, GroupMask: 4, Levels: 1, 
      Finanse: 'N', Postable: 'N', ActCurr: 'USD', DebCred: 'C', Active: 'Y', 
      CurrTotal: 0, FormatCode: '4-000', ActType: 'I', CashAccount: 'N' 
    },

    // Cost of Sales / Purchasing (Group 5)
    { 
      AcctCode: '50000000', AcctName: 'COST OF SALES / PURCHASING', FatherNum: undefined, GroupMask: 5, Levels: 1, 
      Finanse: 'N', Postable: 'N', ActCurr: 'USD', DebCred: 'D', Active: 'Y', 
      CurrTotal: 0, FormatCode: '5-000', ActType: 'E', CashAccount: 'N' 
    },
    { 
      AcctCode: '51000000', AcctName: 'Purchases (Finished Goods)', FatherNum: '50000000', GroupMask: 5, Levels: 2, 
      Finanse: 'Y', Postable: 'Y', ActCurr: 'USD', DebCred: 'D', Active: 'Y', 
      CurrTotal: 12000, FormatCode: '5-110', ActType: 'E', CashAccount: 'N' 
    },

    // Expenses (Group 6)
    { 
      AcctCode: '60000000', AcctName: 'EXPENSES', FatherNum: undefined, GroupMask: 6, Levels: 1, 
      Finanse: 'N', Postable: 'N', ActCurr: 'USD', DebCred: 'D', Active: 'Y', 
      CurrTotal: 0, FormatCode: '6-000', ActType: 'E', CashAccount: 'N' 
    }
  ]);

  private _journalEntries = new BehaviorSubject<JournalEntry[]>([]);

  constructor() { }

  get accounts$(): Observable<Account[]> {
    return this._accounts.asObservable();
  }

  get journalEntries$(): Observable<JournalEntry[]> {
    return this._journalEntries.asObservable();
  }

  addAccount(account: Account) {
    const current = this._accounts.value;
    this._accounts.next([...current, account]);
  }

  addJournalEntry(entry: JournalEntry) {
    const current = this._journalEntries.value;
    this._journalEntries.next([...current, entry]);
    this.updateAccountBalances(entry);
  }

  updateAccount(updatedAccount: Account) {
    const current = this._accounts.value;
    const index = current.findIndex(a => a.AcctCode === updatedAccount.AcctCode);
    if (index !== -1) {
      const updatedAccounts = [...current];
      updatedAccounts[index] = updatedAccount;
      this._accounts.next(updatedAccounts);
    }
  }

  deleteAccount(acctCode: string) {
    const current = this._accounts.value;
    this._accounts.next(current.filter(a => a.AcctCode !== acctCode));
  }

  private updateAccountBalances(entry: JournalEntry) {
    if (entry.status !== 'Posted') return;

    const currentAccounts = this._accounts.value;
    const accountMap = new Map(currentAccounts.map(a => [a.AcctCode, a]));

    entry.lines.forEach(line => {
        const account = accountMap.get(line.accountId);
        if (account) {
            // GroupMask: 1=Assets, 5=Cost of Sales, 6=Expenses (Increase on Debit)
            // GroupMask: 2=Liabilities, 3=Equity, 4=Revenue (Increase on Credit)
            if ([1, 5, 6].includes(account.GroupMask)) {
                account.CurrTotal += (line.debit - line.credit);
            } else {
                account.CurrTotal += (line.credit - line.debit);
            }
        }
    });
    
    this._accounts.next(Array.from(accountMap.values()));
  }
}
