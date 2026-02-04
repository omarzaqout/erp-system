import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountingService, Account, JournalEntry } from '../../services/accounting.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-journal-entry',
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">{{ 'New Journal Entry' | translate }}</h5>
          <button class="btn btn-success" [disabled]="entryForm.invalid || !isBalanced" (click)="saveEntry()">
            <i class="fas fa-save me-2"></i> {{ 'Post Entry' | translate }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <form [formGroup]="entryForm">
          <!-- Header Inputs -->
          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label class="form-label">{{ 'Reference' | translate }}</label>
              <input type="text" class="form-control" formControlName="reference" [placeholder]="'e.g. INV-001' | translate">
            </div>
            <div class="col-md-4">
              <label class="form-label">{{ 'Date' | translate }}</label>
              <input type="date" class="form-control" formControlName="date">
            </div>
             <div class="col-md-4">
              <label class="form-label">{{ 'Memo' | translate }}</label>
              <input type="text" class="form-control" formControlName="memo" [placeholder]="'Description' | translate">
            </div>
          </div>

          <!-- Journal Lines -->
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th style="width: 40%">{{ 'Account' | translate }}</th>
                  <th style="width: 30%">{{ 'Description' | translate }}</th>
                  <th style="width: 12%">{{ 'Debit' | translate }}</th>
                  <th style="width: 12%">{{ 'Credit' | translate }}</th>
                  <th style="width: 6%"></th>
                </tr>
              </thead>
              <tbody formArrayName="lines">
                <tr *ngFor="let line of lines.controls; let i=index" [formGroupName]="i">
                  <td>
                    <select class="form-select" formControlName="accountId">
                        <option value="" disabled>{{ 'Select Account' | translate }}</option>
                        <option *ngFor="let acc of accounts$ | async" [value]="acc.AcctCode">
                            {{ acc.AcctCode }} - {{ acc.AcctName | translate }}
                        </option>
                    </select>
                  </td>
                  <td>
                    <input type="text" class="form-control" formControlName="description">
                  </td>
                  <td>
                    <input type="number" class="form-control" formControlName="debit" min="0">
                  </td>
                  <td>
                    <input type="number" class="form-control" formControlName="credit" min="0">
                  </td>
                  <td class="text-center align-middle">
                    <button class="btn btn-sm btn-outline-danger border-0" (click)="removeLine(i)">
                       <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot class="table-light fw-bold">
                <tr>
                  <td colspan="2">
                    <button class="btn btn-sm btn-outline-primary" (click)="addLine()">
                      <i class="fas fa-plus me-1"></i> {{ 'Add Line' | translate }}
                    </button>
                  </td>
                  <td [class.text-danger]="totalDebit !== totalCredit">{{ totalDebit | erpCurrency }}</td>
                  <td [class.text-danger]="totalDebit !== totalCredit">{{ totalCredit | erpCurrency }}</td>
                  <td></td>
                </tr>
                <tr *ngIf="!isBalanced">
                    <td colspan="5" class="text-danger text-center">
                        {{ 'Debit and Credit totals must match' | translate }}. {{ 'Difference' | translate }}: {{ (totalDebit - totalCredit) | erpCurrency }}
                    </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    input.ng-invalid.ng-touched, select.ng-invalid.ng-touched {
      border-color: #dc3545;
    }
  `]
})
export class JournalEntryComponent implements OnInit {

  entryForm: FormGroup;
  accounts$: Observable<Account[]>;

  constructor(
    private fb: FormBuilder,
    private accountingService: AccountingService
  ) {
    // Only show postable accounts in Journal Entry
    this.accounts$ = this.accountingService.accounts$.pipe(
      map(accs => accs.filter(a => a.Postable === 'Y').sort((a,b) => a.AcctCode.localeCompare(b.AcctCode)))
    );
    
    this.entryForm = this.fb.group({
      reference: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      memo: [''],
      lines: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Add initial two lines for convenience
    this.addLine();
    this.addLine();
  }

  get lines() {
    return this.entryForm.get('lines') as FormArray;
  }

  addLine() {
    const line = this.fb.group({
      accountId: ['', Validators.required],
      description: [''],
      debit: [0, [Validators.required, Validators.min(0)]],
      credit: [0, [Validators.required, Validators.min(0)]]
    });
    this.lines.push(line);
  }

  removeLine(index: number) {
    this.lines.removeAt(index);
  }

  get totalDebit(): number {
    return this.lines.controls
      .map(c => c.get('debit')?.value || 0)
      .reduce((a, b) => a + b, 0);
  }

  get totalCredit(): number {
    return this.lines.controls
      .map(c => c.get('credit')?.value || 0)
      .reduce((a, b) => a + b, 0);
  }

  get isBalanced(): boolean {
    return Math.abs(this.totalDebit - this.totalCredit) < 0.01 && this.totalDebit > 0;
  }

  saveEntry() {
    if (this.entryForm.invalid || !this.isBalanced) return;

    const formValue = this.entryForm.value;
    const entry: JournalEntry = {
        id: Math.random().toString(36).substr(2, 9),
        ...formValue,
        status: 'Posted',
        totalAmount: this.totalDebit
    };

    this.accountingService.addJournalEntry(entry);
    
    // Reset form
    this.entryForm.reset({
        date: new Date().toISOString().substring(0, 10),
        lines: []
    });
    this.lines.clear();
    this.addLine();
    this.addLine();
    
    alert('Journal Entry Posted Successfully!');
  }
}
