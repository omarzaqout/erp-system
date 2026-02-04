import { Component, OnInit } from '@angular/core';
import { MockDataService, Invoice } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-invoices',
  template: `
    <div class="invoices-page">
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="card">
        <div class="card-body p-0">
          <app-data-table
            [columns]="columns"
            [data]="filteredInvoices"
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
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  columns: TableColumn[] = [
    { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'total', label: 'Total', type: 'currency', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'issueDate', label: 'Issue Date', type: 'date', sortable: true },
    { key: 'dueDate', label: 'Due Date', type: 'date', sortable: true },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.mockDataService.getInvoices().subscribe(invoices => {
      this.invoices = invoices;
      this.filteredInvoices = invoices.map(i => ({
        ...i,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'download', label: 'Download', icon: 'fas fa-download', class: 'btn-primary' }
        ]
      }));
      this.totalItems = invoices.length;
    });
  }

  onSearch(query: string) {
    if (!query) {
      this.loadInvoices();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this.filteredInvoices = this.invoices
      .filter(i => 
        i.invoiceNumber.toLowerCase().includes(lowerQuery) ||
        i.customerName.toLowerCase().includes(lowerQuery)
      )
      .map(i => ({
        ...i,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'download', label: 'Download', icon: 'fas fa-download', class: 'btn-primary' }
        ]
      }));
    this.totalItems = this.filteredInvoices.length;
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    console.log('Add new invoice');
  }

  onRowClick(invoice: Invoice) {
    console.log('Invoice clicked:', invoice);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
