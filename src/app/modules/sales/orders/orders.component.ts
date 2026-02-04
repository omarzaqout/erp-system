import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService, Order } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-orders',
  template: `
    <div class="orders-page">
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="card">
        <div class="card-body p-0">
          <app-data-table
            [columns]="columns"
            [data]="filteredOrders"
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
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  columns: TableColumn[] = [
    { key: 'orderNumber', label: 'Order #', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'total', label: 'Total', type: 'currency', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'paymentStatus', label: 'Payment', type: 'badge' },
    { key: 'orderDate', label: 'Date', type: 'date', sortable: true },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.mockDataService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.filteredOrders = orders.map(o => ({
        ...o,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
      this.totalItems = orders.length;
    });
  }

  onSearch(query: string) {
    if (!query) {
      this.loadOrders();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this.filteredOrders = this.orders
      .filter(o => 
        o.orderNumber.toLowerCase().includes(lowerQuery) ||
        o.customerName.toLowerCase().includes(lowerQuery)
      )
      .map(o => ({
        ...o,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
    this.totalItems = this.filteredOrders.length;
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    // Navigate to new order page instead of opening modal
    this.router.navigate(['/sales/orders/new']);
  }

  createOrder(orderData: any) {
    console.log('Creating order:', orderData);
    // Add your order creation logic here
    // Example: this.mockDataService.createOrder(orderData).subscribe(...)
    this.loadOrders(); // Reload orders after creation
  }

  onRowClick(order: Order) {
    console.log('Order clicked:', order);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
