import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { SharedFormComponent, FormConfig } from '../shared-form/shared-form.component';

export interface ModalFormConfig {
  title: string;
  icon?: string;
  formConfig: FormConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initialData?: any;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

@Component({
  selector: 'app-modal-form',
  template: `
    <div class="modal-form-wrapper">
      <div class="modal-form-header">
        <div class="header-content">
          <div class="header-icon" *ngIf="config.icon">
            <i [class]="config.icon"></i>
          </div>
          <h4 class="header-title">{{ config.title }}</h4>
        </div>
        <button 
          type="button" 
          class="btn-close-header" 
          (click)="onClose()"
          aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-form-body">
        <app-shared-form
          #sharedForm
          [config]="config.formConfig"
          [initialData]="config.initialData"
          [showActions]="false"
          (formSubmit)="onFormSubmit($event)"
          (formCancel)="onFormCancel()">
        </app-shared-form>
      </div>
      
      <div class="modal-form-footer">
        <button 
          type="button" 
          class="btn btn-secondary"
          (click)="onCancel()">
          <i class="fas fa-times me-2"></i>
          {{ config.formConfig.cancelLabel || 'Cancel' }}
        </button>
        <button 
          type="button" 
          class="btn btn-primary"
          (click)="onSubmit()"
          [disabled]="!isFormValid || isSubmitting">
          <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          <i *ngIf="!isSubmitting" class="fas fa-check me-2"></i>
          {{ config.formConfig.submitLabel || 'Save' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-form-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
    }
    
    .modal-form-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%);
      color: white;
      
      .header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        
        .header-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          
          i {
            color: white;
          }
        }
        
        .header-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
        }
      }
      
      .btn-close-header {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        
        &:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
      }
    }
    
    .modal-form-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      background: var(--background);
    }
    
    .modal-form-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      border-top: 1px solid var(--border);
      background: white;
      
      .btn {
        min-width: 120px;
        padding: 0.75rem 1.5rem;
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.2s;
        
        i {
          font-size: 0.875rem;
        }
        
        &.btn-secondary {
          background: white;
          border: 1px solid var(--border);
          color: var(--text-dark);
          
          &:hover {
            background: var(--background);
            border-color: var(--text-light);
          }
        }
        
        &.btn-primary {
          background: var(--primary-blue);
          border: none;
          color: white;
          
          &:hover:not(:disabled) {
            background: var(--dark-blue);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 112, 192, 0.3);
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }
    }
    
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
      border-width: 0.15em;
    }
  `]
})
export class ModalFormComponent implements OnInit, AfterViewInit {
  @Input() config!: ModalFormConfig;
  @ViewChild('sharedForm') sharedForm!: SharedFormComponent;
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  
  isFormValid: boolean = false;
  isSubmitting: boolean = false;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    // Subscribe to form validity changes
    if (this.sharedForm) {
      this.sharedForm.formValid.subscribe(valid => {
        this.isFormValid = valid;
      });
    }
  }

  ngAfterViewInit() {
    // Subscribe to form validity after view init
    if (this.sharedForm) {
      this.sharedForm.formValid.subscribe(valid => {
        this.isFormValid = valid;
      });
    }
  }

  onSubmit() {
    if (this.sharedForm && this.sharedForm.isValid()) {
      this.isSubmitting = true;
      const formData = this.sharedForm.getFormValue();
      
      if (this.config.onSubmit) {
        this.config.onSubmit(formData);
      }
      
      this.formSubmit.emit(formData);
    }
  }

  onCancel() {
    if (this.config.onCancel) {
      this.config.onCancel();
    }
    this.formCancel.emit();
    this.modalService.close();
  }

  onClose() {
    this.modalService.close();
  }

  onFormSubmit(data: any) {
    // This is called when form's internal submit is triggered
    // We handle it through the footer button instead
  }

  onFormCancel() {
    this.onCancel();
  }

  setSubmitting(value: boolean) {
    this.isSubmitting = value;
  }
}
