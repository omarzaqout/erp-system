import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'currency';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: any; label: string }[]; // For select fields
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (control: AbstractControl) => any;
  };
  defaultValue?: any;
  helpText?: string;
  rows?: number; // For textarea
  step?: number; // For number fields
}

export interface FormConfig {
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  layout?: 'single' | 'two-column' | 'three-column';
}

@Component({
  selector: 'app-shared-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="form-container" [class]="'layout-' + (config.layout || 'single')">
        <div 
          *ngFor="let field of config.fields || []" 
          class="form-field"
          [class.required]="field.required">
          
          <label [for]="field.key" class="form-label">
            {{ field.label }}
            <span *ngIf="field.required" class="text-danger">*</span>
          </label>
          
          <div *ngIf="field.helpText" class="form-help-text">
            {{ field.helpText }}
          </div>
          
          <!-- Text Input -->
          <input
            *ngIf="field.type === 'text' || field.type === 'email'"
            [id]="field.key"
            [type]="field.type"
            [formControlName]="field.key"
            [placeholder]="field.placeholder || ''"
            [disabled]="field.disabled || false"
            class="form-control"
            [class.is-invalid]="isFieldInvalid(field.key)">
          
          <!-- Number Input -->
          <input
            *ngIf="field.type === 'number' || field.type === 'currency'"
            [id]="field.key"
            type="number"
            [formControlName]="field.key"
            [placeholder]="field.placeholder || ''"
            [disabled]="field.disabled || false"
            [step]="field.step || (field.type === 'currency' ? 0.01 : 1)"
            [min]="field.validation?.min ?? null"
            [max]="field.validation?.max ?? null"
            class="form-control"
            [class.is-invalid]="isFieldInvalid(field.key)">
          
          <!-- Date Input -->
          <input
            *ngIf="field.type === 'date'"
            [id]="field.key"
            type="date"
            [formControlName]="field.key"
            [disabled]="field.disabled || false"
            class="form-control"
            [class.is-invalid]="isFieldInvalid(field.key)">
          
          <!-- Select Dropdown -->
          <select
            *ngIf="field.type === 'select'"
            [id]="field.key"
            [formControlName]="field.key"
            [disabled]="field.disabled || false"
            class="form-select"
            [class.is-invalid]="isFieldInvalid(field.key)">
            <option [value]="''" *ngIf="!field.required">Select {{ field.label }}</option>
            <option *ngFor="let option of field.options || []" [value]="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- Textarea -->
          <textarea
            *ngIf="field.type === 'textarea'"
            [id]="field.key"
            [formControlName]="field.key"
            [placeholder]="field.placeholder || ''"
            [disabled]="field.disabled || false"
            [rows]="field.rows || 3"
            class="form-control"
            [class.is-invalid]="isFieldInvalid(field.key)"></textarea>
          
          <!-- Checkbox -->
          <div *ngIf="field.type === 'checkbox'" class="form-check">
            <input
              [id]="field.key"
              type="checkbox"
              [formControlName]="field.key"
              [disabled]="field.disabled || false"
              class="form-check-input"
              [class.is-invalid]="isFieldInvalid(field.key)">
            <label [for]="field.key" class="form-check-label">
              {{ field.placeholder || field.label }}
            </label>
          </div>
          
          <!-- Error Messages -->
          <div class="invalid-feedback" *ngIf="isFieldInvalid(field.key)">
            <span *ngIf="getFieldControl(field.key)?.errors?.['required']">
              {{ field.label }} is required
            </span>
            <span *ngIf="getFieldControl(field.key)?.errors?.['email']">
              Please enter a valid email address
            </span>
            <span *ngIf="getFieldControl(field.key)?.errors?.['min']">
              Minimum value is {{ field.validation?.min }}
            </span>
            <span *ngIf="getFieldControl(field.key)?.errors?.['max']">
              Maximum value is {{ field.validation?.max }}
            </span>
            <span *ngIf="getFieldControl(field.key)?.errors?.['minlength']">
              Minimum length is {{ field.validation?.minLength }} characters
            </span>
            <span *ngIf="getFieldControl(field.key)?.errors?.['maxlength']">
              Maximum length is {{ field.validation?.maxLength }} characters
            </span>
            <span *ngIf="getFieldControl(field.key)?.errors?.['pattern']">
              Invalid format
            </span>
          </div>
        </div>
      </div>
      
      <div class="form-actions" *ngIf="showActions">
        <button 
          type="button" 
          class="btn btn-secondary"
          (click)="onCancel()"
          *ngIf="config.showCancel !== false">
          {{ config.cancelLabel || 'Cancel' }}
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          [disabled]="form.invalid || isSubmitting">
          <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ config.submitLabel || 'Submit' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    
    .form-container.layout-two-column {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    
    .form-container.layout-three-column {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    
    @media (max-width: 768px) {
      .form-container.layout-two-column,
      .form-container.layout-three-column {
        grid-template-columns: 1fr;
      }
    }
    
    .form-field {
      display: flex;
      flex-direction: column;
      
      &.required .form-label::after {
        content: '*';
        color: var(--danger-red);
        margin-left: 0.25rem;
      }
    }
    
    .form-label {
      font-weight: 500;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      font-size: 0.9375rem;
    }
    
    .form-help-text {
      font-size: 0.8125rem;
      color: var(--text-light);
      margin-bottom: 0.25rem;
    }
    
    .form-control,
    .form-select {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.625rem 0.875rem;
      font-size: 0.9375rem;
      transition: all 0.2s;
      
      &:focus {
        outline: none;
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(0, 112, 192, 0.1);
      }
      
      &:disabled {
        background-color: var(--background);
        cursor: not-allowed;
      }
      
      &.is-invalid {
        border-color: var(--danger-red);
        
        &:focus {
          border-color: var(--danger-red);
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
      }
    }
    
    .form-check {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .form-check-input {
        width: 18px;
        height: 18px;
        cursor: pointer;
        
        &:disabled {
          cursor: not-allowed;
        }
      }
      
      .form-check-label {
        margin: 0;
        cursor: pointer;
      }
    }
    
    .invalid-feedback {
      display: block;
      font-size: 0.875rem;
      color: var(--danger-red);
      margin-top: 0.25rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      
      .btn {
        min-width: 100px;
      }
    }
    
    .text-danger {
      color: var(--danger-red);
    }
    
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
      border-width: 0.15em;
    }
  `]
})
export class SharedFormComponent implements OnInit {
  @Input() config!: FormConfig;
  @Input() initialData: any = null;
  @Input() showActions: boolean = true;
  @Input() isSubmitting: boolean = false;
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formValid = new EventEmitter<boolean>();
  
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.buildForm();
    
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
    
    // Emit form validity changes
    this.form.statusChanges.subscribe(() => {
      this.formValid.emit(this.form.valid);
    });
  }

  private buildForm() {
    const formControls: any = {};
    
    if (this.config && this.config.fields) {
      this.config.fields.forEach(field => {
        const validators = [];
        
        if (field.required) {
          validators.push(Validators.required);
        }
        
        if (field.type === 'email') {
          validators.push(Validators.email);
        }
        
        if (field.validation) {
          if (field.validation.min !== undefined) {
            validators.push(Validators.min(field.validation.min));
          }
          if (field.validation.max !== undefined) {
            validators.push(Validators.max(field.validation.max));
          }
          if (field.validation.minLength !== undefined) {
            validators.push(Validators.minLength(field.validation.minLength));
          }
          if (field.validation.maxLength !== undefined) {
            validators.push(Validators.maxLength(field.validation.maxLength));
          }
          if (field.validation.pattern) {
            validators.push(Validators.pattern(field.validation.pattern));
          }
          if (field.validation.custom) {
            validators.push(field.validation.custom);
          }
        }
        
        formControls[field.key] = [
          { value: field.defaultValue || (field.type === 'checkbox' ? false : ''), disabled: field.disabled || false },
          validators
        ];
      });
    }
    
    this.form = this.fb.group(formControls);
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  isFieldInvalid(fieldKey: string): boolean {
    const control = this.form.get(fieldKey);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldControl(fieldKey: string): AbstractControl | null {
    return this.form.get(fieldKey);
  }

  getFormValue() {
    return this.form.value;
  }

  isValid() {
    return this.form.valid;
  }

  reset() {
    this.form.reset();
    this.buildForm();
  }
}
