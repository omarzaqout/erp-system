import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SharedFormComponent, FormConfig } from '../shared-form/shared-form.component';

@Component({
  selector: 'app-form-page',
  template: `
    <div class="form-page">
      <div class="form-page-header">
        <div class="header-content">
          <button 
            type="button" 
            class="btn-back"
            (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="header-info">
            <div class="header-icon" *ngIf="icon">
              <i [class]="icon"></i>
            </div>
            <div>
              <h2 class="page-title">{{ title }}</h2>
              <nav aria-label="breadcrumb" *ngIf="breadcrumbs.length > 0">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item" *ngFor="let crumb of breadcrumbs; let last = last">
                    <a *ngIf="!last" [routerLink]="crumb.route">{{ crumb.label }}</a>
                    <span *ngIf="last">{{ crumb.label }}</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-page-body">
        <div class="form-container">
          <app-shared-form
            #sharedForm
            [config]="formConfig"
            [initialData]="initialData"
            [showActions]="true"
            [isSubmitting]="isSubmitting"
            (formSubmit)="onFormSubmit($event)"
            (formCancel)="onFormCancel()">
          </app-shared-form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import '../../../../styles/theme-config';
    .form-page {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--background);
    }
    
    .form-page-header {
      background-color: $white;
      border-bottom: 1px solid var(--border);
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      
      .header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        
        .btn-back {
          background: var(--light-blue);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          color: var(--primary-blue);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          
          &:hover {
            background: var(--primary-blue);
            color: white;
            transform: translateX(-2px);
          }
        }
        
        .header-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          
          .header-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
          }
          
          .page-title {
            margin: 0;
            font-size: 1.75rem;
            font-weight: 600;
            color: var(--text-dark);
          }
          
          .breadcrumb {
            margin: 0.25rem 0 0 0;
            background: transparent;
            padding: 0;
            font-size: 0.875rem;
            
            .breadcrumb-item {
              a {
                color: var(--text-light);
                text-decoration: none;
                
                &:hover {
                  color: var(--primary-blue);
                }
              }
              
              &.active {
                color: var(--text-dark);
              }
            }
          }
        }
      }
    }
    
    .form-page-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      
      .form-container {
        max-width: 1200px;
        margin: 0 auto;
        background-color: $white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        padding: 2rem;
      }
    }
    
    @media (max-width: 768px) {
      .form-page-header {
        padding: 1rem;
        
        .header-content {
          .header-info {
            .page-title {
              font-size: 1.5rem;
            }
          }
        }
      }
      
      .form-page-body {
        padding: 1rem;
        
        .form-container {
          padding: 1.5rem;
        }
      }
    }
  `]
})
export class FormPageComponent implements OnInit {
  @Input() title: string = 'Create New';
  @Input() icon?: string;
  @Input() formConfig!: FormConfig;
  @Input() initialData: any = null;
  @Input() breadcrumbs: { label: string; route?: string }[] = [];
  @Input() backRoute?: string;
  @Input() onSubmit?: (data: any) => void;
  
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Get initial data from route if available
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          this.initialData = JSON.parse(params['data']);
        } catch (e) {
          console.error('Error parsing initial data:', e);
        }
      }
    });
  }

  onFormSubmit(data: any) {
    this.isSubmitting = true;
    
    if (this.onSubmit) {
      this.onSubmit(data);
    }
    
    // After submission, navigate back or to success page
    setTimeout(() => {
      this.isSubmitting = false;
      this.goBack();
    }, 500);
  }

  onFormCancel() {
    this.goBack();
  }

  goBack() {
    if (this.backRoute) {
      this.router.navigate([this.backRoute]);
    } else {
      this.location.back();
    }
  }
}
