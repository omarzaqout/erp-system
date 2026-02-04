import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-form',
  template: `
    <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Customer Name <span class="text-danger">*</span></label>
          <input 
            type="text" 
            class="form-control" 
            formControlName="customerName"
            placeholder="Enter customer name"
            [class.is-invalid]="orderForm.get('customerName')?.invalid && orderForm.get('customerName')?.touched">
          <div class="invalid-feedback" *ngIf="orderForm.get('customerName')?.invalid && orderForm.get('customerName')?.touched">
            Customer name is required
          </div>
        </div>
        
        <div class="col-md-6">
          <label class="form-label">Order Date <span class="text-danger">*</span></label>
          <input 
            type="date" 
            class="form-control" 
            formControlName="orderDate"
            [class.is-invalid]="orderForm.get('orderDate')?.invalid && orderForm.get('orderDate')?.touched">
          <div class="invalid-feedback" *ngIf="orderForm.get('orderDate')?.invalid && orderForm.get('orderDate')?.touched">
            Order date is required
          </div>
        </div>
        
        <div class="col-md-6">
          <label class="form-label">Total Amount <span class="text-danger">*</span></label>
          <input 
            type="number" 
            class="form-control" 
            formControlName="total"
            placeholder="0.00"
            step="0.01"
            [class.is-invalid]="orderForm.get('total')?.invalid && orderForm.get('total')?.touched">
          <div class="invalid-feedback" *ngIf="orderForm.get('total')?.invalid && orderForm.get('total')?.touched">
            Valid amount is required
          </div>
        </div>
        
        <div class="col-md-6">
          <label class="form-label">Status <span class="text-danger">*</span></label>
          <select 
            class="form-select" 
            formControlName="status"
            [class.is-invalid]="orderForm.get('status')?.invalid && orderForm.get('status')?.touched">
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div class="invalid-feedback" *ngIf="orderForm.get('status')?.invalid && orderForm.get('status')?.touched">
            Status is required
          </div>
        </div>
        
        <div class="col-md-6">
          <label class="form-label">Payment Status</label>
          <select class="form-select" formControlName="paymentStatus">
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
          </select>
        </div>
        
        <div class="col-12">
          <label class="form-label">Notes</label>
          <textarea 
            class="form-control" 
            formControlName="notes"
            rows="3"
            placeholder="Additional notes..."></textarea>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .form-label {
      font-weight: 500;
      color: var(--text-dark);
      margin-bottom: 0.5rem;
    }
    
    .form-control, .form-select {
      border-color: var(--border);
      
      &:focus {
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(0, 112, 192, 0.1);
      }
      
      &.is-invalid {
        border-color: var(--danger-red);
      }
    }
    
    .invalid-feedback {
      display: block;
      font-size: 0.875rem;
      color: var(--danger-red);
      margin-top: 0.25rem;
    }
    
    .text-danger {
      color: var(--danger-red);
    }
  `]
})
export class OrderFormComponent implements OnInit {
  @Input() initialData: any = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formValid = new EventEmitter<boolean>();
  
  orderForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      orderDate: [new Date().toISOString().split('T')[0], Validators.required],
      total: [0, [Validators.required, Validators.min(0.01)]],
      status: ['pending', Validators.required],
      paymentStatus: ['pending'],
      notes: ['']
    });
    
    // Emit form validity changes
    this.orderForm.statusChanges.subscribe(() => {
      this.formValid.emit(this.orderForm.valid);
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.orderForm.patchValue(this.initialData);
    }
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.formSubmit.emit(this.orderForm.value);
    }
  }

  getFormValue() {
    return this.orderForm.value;
  }

  isValid() {
    return this.orderForm.valid;
  }
}
