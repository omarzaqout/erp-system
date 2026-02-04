import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-reports',
  template: `
    <div class="reports-page">
      <div class="page-header">
        <div>
          <h1>{{ 'Reports' | translate }}</h1>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/dashboard">{{ 'Home' | translate }}</a></li>
              <li class="breadcrumb-item active">{{ 'Reports' | translate }}</li>
            </ol>
          </nav>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline-primary me-2">
            <i class="fas fa-calendar"></i>
            {{ 'This Month' | translate }}
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-download"></i>
            {{ 'Export Report' | translate }}
          </button>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-xl-3 col-md-6">
          <app-stat-card
            icon="fas fa-dollar-sign"
            [value]="totalRevenue | erpCurrency"
            [label]="'Total Revenue' | translate"
            [change]="12.5"
            color="primary">
          </app-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <app-stat-card
            icon="fas fa-shopping-cart"
            [value]="totalOrders"
            [label]="'Total Orders' | translate"
            [change]="8.2"
            color="success">
          </app-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <app-stat-card
            icon="fas fa-users"
            [value]="totalCustomers"
            [label]="'New Customers' | translate"
            [change]="5.7"
            color="warning">
          </app-stat-card>
        </div>
        <div class="col-xl-3 col-md-6">
          <app-stat-card
            icon="fas fa-percentage"
            [value]="conversionRate + '%'"
            [label]="'Conversion Rate' | translate"
            [change]="2.3"
            color="danger">
          </app-stat-card>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">{{ 'Sales by Month' | translate }}</h5>
            </div>
            <div class="card-body">
              <div class="chart-placeholder">
                <i class="fas fa-chart-bar"></i>
                <p>{{ 'Sales Chart' | translate }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">{{ 'Revenue vs Expenses' | translate }}</h5>
            </div>
            <div class="card-body">
              <div class="chart-placeholder">
                <i class="fas fa-chart-line"></i>
                <p>{{ 'Revenue Chart' | translate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mt-2">
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">{{ 'Top Products' | translate }}</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let product of topProducts">
                  {{ product.name | translate }}
                  <span class="badge bg-primary">{{ product.sales }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">{{ 'Top Customers' | translate }}</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let customer of topCustomers">
                  {{ customer.name | translate }}
                  <span class="badge bg-success">{{ customer.total | erpCurrency }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">{{ 'Sales by Category' | translate }}</h5>
            </div>
            <div class="card-body">
              <div class="chart-placeholder small">
                <i class="fas fa-chart-pie"></i>
                <p>{{ 'Category Chart' | translate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-page {
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

      .chart-placeholder {
        height: 300px;
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
          margin: 0;
        }
        
        &.small {
          height: 200px;
          
          i {
            font-size: 2rem;
          }
        }
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  totalRevenue: number = 0;
  totalOrders: number = 0;
  totalCustomers: number = 0;
  conversionRate: number = 68;

  topProducts = [
    { name: 'Wireless Mouse', sales: 245 },
    { name: 'Mechanical Keyboard', sales: 189 },
    { name: 'USB-C Hub', sales: 156 },
    { name: 'Webcam 4K', sales: 134 },
    { name: 'Laptop Stand', sales: 98 }
  ];

  topCustomers = [
    { name: 'Acme Corporation', total: 125000 },
    { name: 'Smart Retail Co', total: 198000 },
    { name: 'TechStart Inc', total: 78000 },
    { name: 'Digital Dynamics', total: 92000 },
    { name: 'Global Solutions Ltd', total: 34000 }
  ];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.mockDataService.getDashboardStats().subscribe(stats => {
      this.totalRevenue = stats.totalRevenue;
      this.totalOrders = stats.totalOrders;
      this.totalCustomers = stats.totalCustomers;
    });
  }
}
