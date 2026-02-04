import { Component } from '@angular/core';

@Component({
  selector: 'app-accounting',
  template: `
    <div class="accounting-page">
      <div class="page-header shadow-sm bg-white mb-4">
        <div class="container-fluid py-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item"><a routerLink="/dashboard" class="text-decoration-none text-muted"><i class="fas fa-home me-1"></i>{{ 'Home' | translate }}</a></li>
                  <li class="breadcrumb-item active fw-bold text-primary">{{ 'Accounting' | translate }}</li>
                </ol>
              </nav>
            </div>
            <div class="d-flex align-items-center gap-3">
               <span class="badge bg-light text-dark border p-2">
                  <i class="fas fa-calendar-alt text-primary me-2"></i> {{ today | date:'mediumDate' }}
               </span>
               <button class="btn btn-sm btn-outline-secondary">
                  <i class="fas fa-sync-alt me-1"></i> Refresh
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
    .accounting-page {
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
    .breadcrumb-item + .breadcrumb-item::before {
      content: "›";
      font-size: 1.2rem;
      line-height: 1;
      vertical-align: middle;
      color: #adb5bd;
    }
  `]
})
export class AccountingComponent {
  today = new Date();
}
