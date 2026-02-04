import { Component, OnInit } from '@angular/core';
import { MockDataService, Vendor } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-vendors',
  template: `
    <div class="vendors-page">
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="card">
        <div class="card-body p-0">
          <app-data-table
            [columns]="columns"
            [data]="filteredVendors"
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
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  filteredVendors: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  columns: TableColumn[] = [
    { key: 'name', label: 'Vendor Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'totalPurchases', label: 'Purchases', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.loadVendors();
  }

  loadVendors() {
    this.mockDataService.getVendors().subscribe(vendors => {
      this.vendors = vendors;
      this.filteredVendors = vendors.map(v => ({
        ...v,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
      this.totalItems = vendors.length;
    });
  }

  onSearch(query: string) {
    if (!query) {
      this.loadVendors();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this.filteredVendors = this.vendors
      .filter(v => 
        v.name.toLowerCase().includes(lowerQuery) ||
        v.email.toLowerCase().includes(lowerQuery) ||
        v.category.toLowerCase().includes(lowerQuery)
      )
      .map(v => ({
        ...v,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
    this.totalItems = this.filteredVendors.length;
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    console.log('Add new vendor');
  }

  onRowClick(vendor: Vendor) {
    console.log('Vendor clicked:', vendor);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
