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
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
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
