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
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
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
