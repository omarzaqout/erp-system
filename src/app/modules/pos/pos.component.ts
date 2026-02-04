import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pos',
  template: `
    <div class="pos-page">
      <div class="page-header">
        <div>
          <h1>Point of Sale</h1>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/dashboard">Home</a></li>
              <li class="breadcrumb-item active">POS</li>
            </ol>
          </nav>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline-primary me-2" (click)="openSettings()">
            <i class="fas fa-cog"></i> Settings
          </button>
        </div>
      </div>

      <div class="pos-container">
        <!-- Products/Search Panel -->
        <div class="pos-left-panel">
          <div class="search-section">
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search products..."
                [(ngModel)]="searchQuery"
                (input)="onSearch()">
            </div>
          </div>

          <div class="categories-section">
            <div class="category-tabs">
              <button 
                *ngFor="let category of categories"
                class="category-tab"
                [class.active]="selectedCategory === category.id"
                (click)="selectCategory(category.id)">
                <i [class]="category.icon"></i>
                {{ category.name }}
              </button>
            </div>
          </div>

          <div class="products-grid">
            <div 
              *ngFor="let product of filteredProducts"
              class="product-card"
              (click)="addToCart(product)">
              <div class="product-image">
                <i class="fas fa-box"></i>
              </div>
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-price">{{ product.price | erpCurrency }}</div>
                <div class="product-stock" [class.low]="product.stock < 10">
                  Stock: {{ product.stock }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart/Checkout Panel -->
        <div class="pos-right-panel">
          <div class="cart-section">
            <div class="cart-header">
              <h5>Current Sale</h5>
              <button class="btn-clear" (click)="clearCart()">
                <i class="fas fa-trash"></i> Clear
              </button>
            </div>

            <div class="cart-items">
              <div 
                *ngFor="let item of cartItems; let i = index"
                class="cart-item">
                <div class="item-info">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-details">
                    <span class="item-price">{{ item.price | erpCurrency }}</span>
                    <span class="item-quantity">x{{ item.quantity }}</span>
                  </div>
                </div>
                <div class="item-actions">
                  <button class="btn-qty" (click)="decreaseQuantity(i)">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button class="btn-qty" (click)="increaseQuantity(i)">
                    <i class="fas fa-plus"></i>
                  </button>
                  <button class="btn-remove" (click)="removeItem(i)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div class="item-total">{{ (item.price * item.quantity) | erpCurrency }}</div>
              </div>

              <div class="cart-empty" *ngIf="cartItems.length === 0">
                <i class="fas fa-shopping-cart"></i>
                <p>Cart is empty</p>
                <p class="text-muted">Add products to start a sale</p>
              </div>
            </div>
          </div>

          <div class="checkout-section">
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>{{ subtotal | erpCurrency }}</span>
              </div>
              <div class="total-row">
                <span>Tax ({{ taxRate }}%):</span>
                <span>{{ tax | erpCurrency }}</span>
              </div>
              <div class="total-row total">
                <span>Total:</span>
                <span>{{ total | erpCurrency }}</span>
              </div>
            </div>

            <div class="payment-methods">
              <button 
                *ngFor="let method of paymentMethods"
                class="btn-payment"
                [class]="'btn-payment-' + method.type"
                (click)="processPayment(method)">
                <i [class]="method.icon"></i>
                {{ method.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pos-page {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: white;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }

    .pos-container {
      display: flex;
      gap: 1.5rem;
      flex: 1;
      padding: 0 1.5rem 1.5rem 1.5rem;
      overflow: hidden;
    }

    .pos-left-panel {
      flex: 2;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .search-section {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
    }

    .categories-section {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }

    .category-tabs {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
    }

    .category-tab {
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.5rem 1rem;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        background: var(--light-blue);
        border-color: var(--primary-blue);
      }

      &.active {
        background: var(--primary-blue);
        color: white;
        border-color: var(--primary-blue);
      }
    }

    .products-grid {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .product-card {
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: var(--primary-blue);
      }

      .product-image {
        width: 80px;
        height: 80px;
        margin: 0 auto 0.75rem;
        background: var(--light-blue);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: var(--primary-blue);
      }

      .product-name {
        font-weight: 600;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }

      .product-price {
        color: var(--primary-blue);
        font-weight: 700;
        font-size: 1.125rem;
        margin-bottom: 0.25rem;
      }

      .product-stock {
        font-size: 0.75rem;
        color: var(--text-light);

        &.low {
          color: var(--danger-red);
          font-weight: 600;
        }
      }
    }

    .pos-right-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
    }

    .cart-section {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);

      h5 {
        margin: 0;
      }

      .btn-clear {
        background: none;
        border: none;
        color: var(--danger-red);
        cursor: pointer;
        font-size: 0.875rem;
      }
    }

    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .cart-item {
      background: var(--background);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 0.75rem;

      .item-info {
        margin-bottom: 0.75rem;

        .item-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .item-details {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: var(--text-light);
        }
      }

      .item-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;

        .btn-qty {
          width: 28px;
          height: 28px;
          border: 1px solid var(--border);
          background: white;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-value {
          min-width: 30px;
          text-align: center;
          font-weight: 600;
        }

        .btn-remove {
          background: var(--danger-red);
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          margin-left: auto;
        }
      }

      .item-total {
        font-weight: 700;
        color: var(--primary-blue);
        font-size: 1.125rem;
      }
    }

    .cart-empty {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-light);

      i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.3;
      }
    }

    .checkout-section {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 1.5rem;
    }

    .totals {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);

      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        font-size: 0.9375rem;

        &.total {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-blue);
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
      }
    }

    .payment-methods {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .btn-payment {
      padding: 1rem;
      border: 2px solid var(--border);
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;

      i {
        font-size: 1.5rem;
      }

      &:hover {
        border-color: var(--primary-blue);
        background: var(--light-blue);
      }

      &.btn-payment-cash {
        border-color: var(--success-green);
        color: var(--success-green);

        &:hover {
          background: rgba(40, 167, 69, 0.1);
        }
      }

      &.btn-payment-card {
        border-color: var(--primary-blue);
        color: var(--primary-blue);

        &:hover {
          background: var(--light-blue);
        }
      }
    }
  `]
})
export class PosComponent implements OnInit {
  searchQuery: string = '';
  selectedCategory: string = 'all';
  categories = [
    { id: 'all', name: 'All', icon: 'fas fa-th' },
    { id: 'electronics', name: 'Electronics', icon: 'fas fa-laptop' },
    { id: 'clothing', name: 'Clothing', icon: 'fas fa-tshirt' },
    { id: 'food', name: 'Food', icon: 'fas fa-utensils' }
  ];

  products: any[] = [];
  filteredProducts: any[] = [];
  cartItems: any[] = [];
  taxRate: number = 10;

  paymentMethods = [
    { type: 'cash', label: 'Cash', icon: 'fas fa-money-bill-wave' },
    { type: 'card', label: 'Card', icon: 'fas fa-credit-card' },
    { type: 'mobile', label: 'Mobile', icon: 'fas fa-mobile-alt' },
    { type: 'other', label: 'Other', icon: 'fas fa-wallet' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Mock products - replace with actual service call
    this.products = [
      { id: 1, name: 'Product 1', price: 29.99, stock: 50, category: 'electronics' },
      { id: 2, name: 'Product 2', price: 49.99, stock: 30, category: 'clothing' },
      { id: 3, name: 'Product 3', price: 19.99, stock: 5, category: 'food' },
      { id: 4, name: 'Product 4', price: 99.99, stock: 15, category: 'electronics' }
    ];
    this.filteredProducts = this.products;
  }

  onSearch() {
    this.filterProducts();
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.filterProducts();
  }

  filterProducts() {
    let filtered = this.products;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query)
      );
    }

    this.filteredProducts = filtered;
  }

  addToCart(product: any) {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        ...product,
        quantity: 1
      });
    }
  }

  increaseQuantity(index: number) {
    this.cartItems[index].quantity++;
  }

  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  clearCart() {
    this.cartItems = [];
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get tax(): number {
    return this.subtotal * (this.taxRate / 100);
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  processPayment(method: any) {
    if (this.cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    console.log('Processing payment:', method, 'Total:', this.total);
    // Add payment processing logic here
    
    // After successful payment
    this.clearCart();
    alert('Payment processed successfully!');
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }
}
