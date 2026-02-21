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
  templateUrl: './shared-form.component.html',
  styleUrls: ['./shared-form.component.scss']
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
