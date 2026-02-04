import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-products',
  template: `
    <div class="products-page">
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="card">
        <div class="card-body p-0">
          <app-data-table
            [columns]="columns"
            [data]="filteredProducts"
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
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  columns: TableColumn[] = [
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', type: 'currency', sortable: true },
    { key: 'quantity', label: 'Stock', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  constructor(private inventoryService: InventoryService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.inventoryService.products$.subscribe(products => {
      this.products = products;
      this.applyDataMapping(products);
      this.totalItems = products.length;
    });
  }

  applyDataMapping(products: Product[]) {
    this.filteredProducts = products.map(p => ({
        ...p,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' },
          { key: 'delete', label: 'Delete', icon: 'fas fa-trash', class: 'btn-danger' }
        ]
      }));
  }

  onSearch(query: string) {
    if (!query) {
      this.applyDataMapping(this.products);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = this.products
      .filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    this.applyDataMapping(filtered);
    this.totalItems = filtered.length;
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    console.log('Add new product');
  }

  onRowClick(product: Product) {
    console.log('Product clicked:', product);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
