import { Component } from '@angular/core';

@Component({
  selector: 'app-sales',
  template: `
    <div class="sales-page">
      <div class="page-header shadow-sm bg-white mb-4">
        <div class="container-fluid py-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item"><a routerLink="/dashboard" class="text-decoration-none text-muted"><i class="fas fa-home me-1"></i>{{ 'Home' | translate }}</a></li>
                  <li class="breadcrumb-item active fw-bold text-primary">{{ 'Sales' | translate }}</li>
                </ol>
              </nav>
            </div>
            <div class="header-actions">
               <button class="btn btn-primary btn-sm" routerLink="orders/new">
                  <i class="fas fa-plus me-1"></i> {{ 'New Order' | translate }}
               </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="container-fluid">
        <div class="content-fade-in">
           <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sales-page {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    .page-header {
      border-bottom: 1px solid #dee2e6;
    }
    .content-fade-in {
      animation: fadeIn 0.4s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SalesComponent { }
