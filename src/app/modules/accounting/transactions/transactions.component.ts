import { Component, OnInit } from '@angular/core';
import { MockDataService, Transaction } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-transactions',
  template: `
    <div class="transactions-page">
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <app-stat-card
            icon="fas fa-arrow-down"
            [value]="totalIncome | erpCurrency"
            label="Total Income"
            color="success">
          </app-stat-card>
        </div>
        <div class="col-md-4">
          <app-stat-card
            icon="fas fa-arrow-up"
            [value]="totalExpenses | erpCurrency"
            label="Total Expenses"
            color="danger">
          </app-stat-card>
        </div>
        <div class="col-md-4">
          <app-stat-card
            icon="fas fa-wallet"
            [value]="(totalIncome - totalExpenses) | erpCurrency"
            label="Net Balance"
            color="primary">
          </app-stat-card>
        </div>
      </div>
      
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="card">
        <div class="card-body p-0">
          <app-data-table
            [columns]="columns"
            [data]="filteredTransactions"
            (rowClick)="onRowClick($event)">
          </app-data-table>
        </div>
      </div>
      
      <app-pagination
        [currentPage]="currentPage"
        [pageSize]="pageSize"
        [totalItems]="totalItems"
        (pageChange)="onPageChange($event)">
      </app-pagination>
    </div>
  `,
  styles: [``]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;

  columns: TableColumn[] = [
    { key: 'transactionNumber', label: 'Transaction #', sortable: true },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'date', label: 'Date', type: 'date', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' }
  ];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.mockDataService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.filteredTransactions = transactions;
      this.totalItems = transactions.length;
      
      this.totalIncome = transactions
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      this.totalExpenses = transactions
        .filter(t => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
    });
  }

  onSearch(query: string) {
    if (!query) {
      this.filteredTransactions = this.transactions;
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this.filteredTransactions = this.transactions.filter(t => 
      t.transactionNumber.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
    );
    this.totalItems = this.filteredTransactions.length;
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    console.log('Add new transaction');
  }

  onRowClick(transaction: Transaction) {
    console.log('Transaction clicked:', transaction);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
