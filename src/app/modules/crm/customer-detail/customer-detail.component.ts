import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockDataService, Customer } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-customer-detail',
  template: `
    <div class="customer-detail" *ngIf="customer">
      <div class="page-header">
        <div>
          <h1>{{ customer.name }}</h1>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/dashboard">Home</a></li>
              <li class="breadcrumb-item"><a routerLink="/crm/customers">Customers</a></li>
              <li class="breadcrumb-item active">{{ customer.name }}</li>
            </ol>
          </nav>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline-secondary me-2" routerLink="/crm/customers">
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-edit"></i>
            Edit
          </button>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-4">
          <div class="card">
            <div class="card-body text-center">
              <div class="customer-avatar">
                <i class="fas fa-building"></i>
              </div>
              <h4>{{ customer.name }}</h4>
              <p class="text-muted">{{ customer.company }}</p>
              <span class="badge" [ngClass]="customer.status | statusBadge">
                {{ customer.status | titlecase }}
              </span>
            </div>
          </div>
          
          <div class="card mt-4">
            <div class="card-header">
              <h5 class="mb-0">Contact Information</h5>
            </div>
            <div class="card-body">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>{{ customer.email }}</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>{{ customer.phone }}</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ customer.address }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-8">
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <app-stat-card
                icon="fas fa-shopping-cart"
                [value]="customer.totalOrders"
                label="Total Orders"
                color="primary">
              </app-stat-card>
            </div>
            <div class="col-md-6">
              <app-stat-card
                icon="fas fa-dollar-sign"
                [value]="customer.totalSpent | erpCurrency"
                label="Total Spent"
                color="success">
              </app-stat-card>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Recent Orders</h5>
            </div>
            <div class="card-body">
              <p class="text-muted text-center py-4">No recent orders found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-detail {
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

      .customer-avatar {
        width: 100px;
        height: 100px;
        background: var(--light-blue);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        
        i {
          font-size: 3rem;
          color: var(--primary-blue);
        }
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--border);
        
        &:last-child {
          border-bottom: none;
        }
        
        i {
          width: 20px;
          color: var(--primary-blue);
        }
        
        span {
          color: var(--text-dark);
        }
      }
    }
  `]
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;

  constructor(
    private route: ActivatedRoute,
    private mockDataService: MockDataService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mockDataService.getCustomerById(id).subscribe(customer => {
        this.customer = customer || null;
      });
    }
  }
}
