import { Component, OnInit } from '@angular/core';
import { HrService, PayrollRun } from '../services/hr.service';
import { AccountingService, JournalEntry } from '../../accounting/services/accounting.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payroll',
  template: `
    <div class="payroll-page">
      <div class="page-header">
        <div>
          <h1 class="mb-1">{{ 'Payroll Management' | translate }}</h1>
          <p class="text-muted">{{ 'Manage employee salaries and generate accounting entries' | translate }}</p>
        </div>
        <button class="btn btn-primary" (click)="generatePayroll()">
          <i class="fas fa-plus me-2"></i> {{ 'Generate Monthly Payroll' | translate }}
        </button>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <thead class="bg-light">
                  <tr>
                    <th class="ps-4">{{ 'Payroll ID' | translate }}</th>
                    <th>{{ 'Month/Year' | translate }}</th>
                    <th>{{ 'Employees' | translate }}</th>
                    <th>{{ 'Total Amount' | translate }}</th>
                    <th>{{ 'Status' | translate }}</th>
                    <th class="text-end pe-4">{{ 'Actions' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let run of payrollRuns$ | async">
                    <td class="ps-4 fw-bold">{{ run.id }}</td>
                    <td>{{ run.month | translate }} {{ run.year }}</td>
                    <td>{{ run.employeesCount }}</td>
                    <td class="fw-bold">{{ run.totalAmount | erpCurrency }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'bg-success': run.status === 'Paid',
                        'bg-warning text-dark': run.status === 'Draft',
                        'bg-info': run.status === 'Approved'
                      }">{{ run.status | translate }}</span>
                    </td>
                    <td class="text-end pe-4">
                      <button *ngIf="run.status === 'Draft'" class="btn btn-sm btn-outline-success me-2" (click)="approvePayroll(run)">
                        <i class="fas fa-check"></i> {{ 'Approve & Post' | translate }}
                      </button>
                      <button class="btn btn-sm btn-light">
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payroll-page {
      padding: 1.5rem;
    }
  `]
})
export class PayrollComponent implements OnInit {
  payrollRuns$: Observable<PayrollRun[]>;

  constructor(
    private hrService: HrService,
    private accountingService: AccountingService
  ) {
    this.payrollRuns$ = this.hrService.payrollRuns$;
  }

  ngOnInit(): void {}

  generatePayroll() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const newRun: PayrollRun = {
      id: 'PAY-' + now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0'),
      month: months[now.getMonth()],
      year: now.getFullYear(),
      status: 'Draft',
      totalAmount: 52450.00, // Mock calculation
      employeesCount: 18,
      date: new Date()
    };
    
    this.hrService.addPayrollRun(newRun);
  }

  approvePayroll(run: PayrollRun) {
    if (confirm(`Approve payroll for ${run.month} ${run.year} and generate accounting entries?`)) {
      // 1. Update HR Status
      this.hrService.updatePayrollStatus(run.id, 'Paid');

      // 2. Create Accounting Journal Entry (SAP/Odoo style)
      // Debit: Salaries & Wages Expense (ID: 10 - adjusted to represent an expense)
      // Credit: Cash (ID: 2)
      const entry: JournalEntry = {
        id: 'HR-' + run.id,
        date: new Date(),
        reference: `Payroll ${run.month} ${run.year}`,
        memo: `Monthly salary payment for ${run.employeesCount} employees`,
        status: 'Posted',
        totalAmount: run.totalAmount,
        lines: [
          {
            accountId: '10', // Rent Expense (Temporary id, usually Salaries Expense)
            debit: run.totalAmount,
            credit: 0,
            description: `Salary Expense - ${run.month}`
          },
          {
            accountId: '2', // Cash
            debit: 0,
            credit: run.totalAmount,
            description: 'Cash payment for salaries'
          }
        ]
      };

      this.accountingService.addJournalEntry(entry);
      alert('Payroll approved and accounting entries posted successfully!');
    }
  }
}
