import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockProducts: number;
  pendingOrders: number;
}

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>{{ 'Dashboard' | translate }}</h1>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item active">{{ 'Home' | translate }}</li>
            </ol>
          </nav>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline-primary me-2">
            <i class="fas fa-download"></i>
            {{ 'Export' | translate }}
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i>
            {{ 'New Order' | translate }}
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-xl-3 col-md-6">
          <app-stat-card
            icon="fas fa-dollar-sign"
            [value]="stats.totalRevenue | erpCurrency"
            [label]="'Total Revenue' | translate"
            [change]="12.5"
            color="primary">
          </app-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <app-stat-card
            icon="fas fa-shopping-cart"
            [value]="stats.totalOrders"
            [label]="'Total Orders' | translate"
            [change]="8.2"
            color="success">
          </app-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <app-stat-card
            icon="fas fa-users"
            [value]="stats.totalCustomers"
            [label]="'Active Customers' | translate"
            [change]="5.7"
            color="warning">
          </app-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <app-stat-card
            icon="fas fa-box"
            [value]="stats.lowStockProducts"
            [label]="'Low Stock Items' | translate"
            [change]="-2.1"
            color="danger">
          </app-stat-card>
        </div>
      </div>

      <!-- Charts and Activity -->
      <div class="row g-4 mb-4">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">{{ 'Revenue Overview' | translate }}</h5>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-secondary active">{{ 'Monthly' | translate }}</button>
                <button class="btn btn-sm btn-outline-secondary">{{ 'Weekly' | translate }}</button>
                <button class="btn btn-sm btn-outline-secondary">{{ 'Daily' | translate }}</button>
              </div>
            </div>
            <div class="card-body">
              <div class="revenue-chart">
                <div class="chart-placeholder">
                  <i class="fas fa-chart-line"></i>
                  <p>{{ 'Revenue Chart' | translate }}</p>
                  <small class="text-muted">{{ 'Revenue' | translate }}: {{ stats.totalRevenue | erpCurrency }} | {{ 'Expenses' | translate }}: {{ stats.totalExpenses | erpCurrency }} | {{ 'Profit' | translate }}: {{ stats.totalProfit | erpCurrency }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <app-recent-activity [activities]="recentActivities"></app-recent-activity>
        </div>
      </div>

      <!-- Recent Orders and Top Products -->
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">{{ 'Recent Orders' | translate }}</h5>
              <a routerLink="/sales/orders" class="btn btn-sm btn-outline-primary">{{ 'View All' | translate }}</a>
            </div>
            <div class="card-body p-0">
              <app-data-table
                [columns]="orderColumns"
                [data]="recentOrders"
                (rowClick)="onOrderClick($event)">
              </app-data-table>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">{{ 'Sales by Category' | translate }}</h5>
            </div>
            <div class="card-body">
              <div class="category-chart">
                <div class="chart-placeholder">
                  <i class="fas fa-chart-pie"></i>
                  <p>{{ 'Category Distribution' | translate }}</p>
                </div>
              </div>
              <div class="category-list mt-3">
                <div class="category-item" *ngFor="let category of salesByCategory">
                  <div class="category-info">
                    <span class="category-color" [style.background-color]="category.color"></span>
                    <span class="category-name">{{ category.name | translate }}</span>
                  </div>
                  <span class="category-value">{{ category.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border);

        h1 {
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
        }

        .breadcrumb {
          margin-bottom: 0;
          background: transparent;
          padding: 0;
        }
      }

      .page-actions {
        display: flex;
        gap: 0.5rem;
      }

      .revenue-chart {
        height: 300px;
        
        .chart-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--background);
          border-radius: 8px;
          color: var(--text-light);
          
          i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--primary-blue);
          }
          
          p {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
          }
        }
      }

      .category-chart {
        height: 200px;
        
        .chart-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--background);
          border-radius: 8px;
          color: var(--text-light);
          
          i {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: var(--primary-blue);
          }
          
          p {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-dark);
            margin: 0;
          }
        }
      }

      .category-list {
        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border);
          
          &:last-child {
            border-bottom: none;
          }
          
          .category-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            
            .category-color {
              width: 12px;
              height: 12px;
              border-radius: 3px;
            }
            
            .category-name {
              color: var(--text-dark);
              font-size: 0.875rem;
            }
          }
          
          .category-value {
            font-weight: 600;
            color: var(--text-dark);
            font-size: 0.875rem;
          }
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    pendingOrders: 0
  };

  orderColumns: TableColumn[] = [
    { key: 'orderNumber', label: 'Order #', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'total', label: 'Total', type: 'currency', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'orderDate', label: 'Date', type: 'date', sortable: true }
  ];

  recentOrders: any[] = [];

  recentActivities = [
    {
      id: '1',
      type: 'order' as const,
      title: 'New Order Received',
      description: 'Order #ORD-2024-001 from Acme Corporation',
      timestamp: new Date(),
      user: 'System'
    },
    {
      id: '2',
      type: 'payment' as const,
      title: 'Payment Received',
      description: '$2,500 payment from TechStart Inc',
      timestamp: new Date(Date.now() - 3600000),
      user: 'Jane Smith'
    },
    {
      id: '3',
      type: 'product' as const,
      title: 'Low Stock Alert',
      description: 'USB-C Hub is running low (8 units remaining)',
      timestamp: new Date(Date.now() - 7200000),
      user: 'System'
    },
    {
      id: '4',
      type: 'user' as const,
      title: 'New Employee Added',
      description: 'Charlie Brown joined as Operations Manager',
      timestamp: new Date(Date.now() - 86400000),
      user: 'HR Team'
    }
  ];

  salesByCategory = [
    { name: 'Electronics', percentage: 45, color: '#0070C0' },
    { name: 'Accessories', percentage: 30, color: '#28A745' },
    { name: 'Software', percentage: 15, color: '#FF6B35' },
    { name: 'Services', percentage: 10, color: '#FFC107' }
  ];

  constructor(
    private mockDataService: MockDataService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.mockDataService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });

    this.mockDataService.getOrders().subscribe(orders => {
      this.recentOrders = orders.slice(0, 5).map(order => ({
        ...order,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
    });
  }

  onOrderClick(order: any) {
    console.log('Order clicked:', order);
  }
}
