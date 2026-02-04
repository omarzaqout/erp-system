import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';
import { ModalFormComponent } from '../modal-form/modal-form.component';

export interface ModalConfig {
  title: string;
  body?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
  closeOnBackdrop?: boolean;
  buttons?: ModalButton[];
}

export interface ModalButton {
  label: string;
  class?: string;
  action: () => void;
  closeOnClick?: boolean;
}

@Component({
  selector: 'app-modal',
  template: `
    <div 
      class="modal-overlay" 
      *ngIf="isOpen"
      (click)="onBackdropClick()">
      <div 
        class="modal-container"
        [class]="'modal-' + getSize()"
        [class.modal-form-mode]="mode === 'form'"
        (click)="$event.stopPropagation()">
        
        <!-- Standard Modal Mode -->
        <ng-container *ngIf="mode === 'standard'">
          <div class="modal-header">
            <h5 class="modal-title">{{ config?.title || 'Modal' }}</h5>
            <button 
              *ngIf="config?.showClose !== false"
              type="button" 
              class="btn-close" 
              (click)="close()"
              aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <ng-container *ngIf="config?.body; else defaultBody">
              <div [innerHTML]="config?.body || ''"></div>
            </ng-container>
            <ng-template #defaultBody>
              <ng-content></ng-content>
            </ng-template>
          </div>
          
          <div class="modal-footer" *ngIf="config && config.buttons && config.buttons.length > 0">
            <button
              *ngFor="let button of config.buttons"
              type="button"
              class="btn"
              [class]="button.class || 'btn-secondary'"
              (click)="onButtonClick(button)">
              {{ button.label }}
            </button>
          </div>
        </ng-container>

        <!-- Form Modal Mode -->
        <app-modal-form 
          *ngIf="mode === 'form' && formConfig"
          [config]="formConfig"
          (formSubmit)="onFormSubmit($event)"
          (formCancel)="onFormCancel()">
        </app-modal-form>

      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      padding: 1rem;
      backdrop-filter: blur(2px);
    }
    
    .modal-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      width: 100%;
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
      
      &.modal-form-mode {
        padding: 0;
        border-radius: 16px;
        overflow: hidden;
      }
    }
    
    .modal-sm {
      max-width: 400px;
    }
    
    .modal-md {
      max-width: 600px;
    }
    
    .modal-lg {
      max-width: 800px;
    }
    
    .modal-xl {
      max-width: 1200px;
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      
      .modal-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-dark);
      }
      
      .btn-close {
        background: none;
        border: none;
        font-size: 1.25rem;
        color: var(--text-light);
        cursor: pointer;
        padding: 0.25rem;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: all 0.2s;
        
        &:hover {
          background-color: var(--light-blue);
          color: var(--text-dark);
        }
      }
    }
    
    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }
    
    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border);
      background-color: var(--background);
      
      .btn {
        min-width: 100px;
      }
    }
    
    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `]
})
export class ModalComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;
  config: ModalConfig | null = null;
  formConfig: any = null;
  mode: 'standard' | 'form' = 'standard';
  
  private destroy$ = new Subject<void>();

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.modalState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isOpen = state.isOpen;
        this.config = state.config;
        this.formConfig = state.formConfig;
        this.mode = state.mode;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSize(): string {
    if (this.mode === 'form' && this.formConfig) {
      return this.formConfig.size || 'lg';
    }
    return this.config?.size || 'md';
  }

  close() {
    this.modalService.close();
  }

  onBackdropClick() {
    if (this.mode === 'form') {
      // Don't close on backdrop for forms to prevent accidental data loss
      return;
    }
    if (this.config?.closeOnBackdrop !== false) {
      this.close();
    }
  }

  onButtonClick(button: ModalButton) {
    button.action();
    if (button.closeOnClick !== false) {
      this.close();
    }
  }

  onFormSubmit(data: any) {
    if (this.formConfig?.onSubmit) {
      this.formConfig.onSubmit(data);
    }
  }

  onFormCancel() {
    if (this.formConfig?.onCancel) {
      this.formConfig.onCancel();
    }
    this.close();
  }
}
