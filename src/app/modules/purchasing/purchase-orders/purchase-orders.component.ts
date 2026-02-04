import { Component, OnInit } from '@angular/core';
import { MockDataService, PurchaseOrder } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-purchase-orders',
  template: `
    <div class="purchase-orders-page">
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="card">
        <div class="card-body p-0">
          <app-data-table
            [columns]="columns"
            [data]="filteredPOs"
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
export class PurchaseOrdersComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  filteredPOs: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  columns: TableColumn[] = [
    { key: 'poNumber', label: 'PO #', sortable: true },
    { key: 'vendorName', label: 'Vendor', sortable: true },
    { key: 'total', label: 'Total', type: 'currency', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'orderDate', label: 'Order Date', type: 'date', sortable: true },
    { key: 'expectedDate', label: 'Expected', type: 'date', sortable: true },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders() {
    this.mockDataService.getPurchaseOrders().subscribe(pos => {
      this.purchaseOrders = pos;
      this.filteredPOs = pos.map(po => ({
        ...po,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
      this.totalItems = pos.length;
    });
  }

  onSearch(query: string) {
    if (!query) {
      this.loadPurchaseOrders();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this.filteredPOs = this.purchaseOrders
      .filter(po => 
        po.poNumber.toLowerCase().includes(lowerQuery) ||
        po.vendorName.toLowerCase().includes(lowerQuery)
      )
      .map(po => ({
        ...po,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
    this.totalItems = this.filteredPOs.length;
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    console.log('Add new purchase order');
  }

  onRowClick(po: PurchaseOrder) {
    console.log('PO clicked:', po);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
