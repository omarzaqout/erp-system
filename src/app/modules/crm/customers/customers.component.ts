import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService, Customer } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-customers',
  template: `
    <div class="customers-page">
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="card">
        <div class="card-body p-0">
          <app-data-table
            [columns]="columns"
            [data]="filteredCustomers"
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
  styles: [`
    .customers-page {
      .card {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  columns: TableColumn[] = [
    { key: 'name', label: 'Customer Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'totalOrders', label: 'Orders', sortable: true },
    { key: 'totalSpent', label: 'Total Spent', type: 'currency', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { 
      key: 'actions', 
      label: 'Actions', 
      type: 'actions'
    }
  ];

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.mockDataService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.filteredCustomers = customers.map(c => ({
        ...c,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' },
          { key: 'delete', label: 'Delete', icon: 'fas fa-trash', class: 'btn-danger' }
        ]
      }));
      this.totalItems = customers.length;
    });
  }

  onSearch(query: string) {
    if (!query) {
      this.loadCustomers();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this.filteredCustomers = this.customers
      .filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.company.toLowerCase().includes(lowerQuery)
      )
      .map(c => ({
        ...c,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' },
          { key: 'delete', label: 'Delete', icon: 'fas fa-trash', class: 'btn-danger' }
        ]
      }));
    this.totalItems = this.filteredCustomers.length;
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    // Navigate to new customer page instead of opening modal
    this.router.navigate(['/crm/customers/new']);
  }

  onRowClick(customer: Customer) {
    console.log('Customer clicked:', customer);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
