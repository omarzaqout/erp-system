import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company',
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Company Settings</h5>
      </div>
      <div class="card-body">
        <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
          <div class="form-group mb-3">
            <label>Company Name</label>
            <input type="text" class="form-control" formControlName="name">
          </div>
          
          <div class="form-group mb-3">
            <label>Address</label>
            <textarea class="form-control" rows="2" formControlName="address"></textarea>
          </div>
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label>Phone</label>
                <input type="tel" class="form-control" formControlName="phone">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label>Email</label>
                <input type="email" class="form-control" formControlName="email">
              </div>
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label>Website</label>
            <input type="url" class="form-control" formControlName="website">
          </div>
          
          <div class="form-group mb-3">
            <label>Tax ID</label>
            <input type="text" class="form-control" formControlName="taxId">
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn btn-primary" [disabled]="companyForm.invalid || isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [``]
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.companyForm = this.fb.group({
      name: ['ERP Company Ltd', Validators.required],
      address: ['123 Business Street, New York, NY 10001', Validators.required],
      phone: ['+1 555-123-4567', Validators.required],
      email: ['info@erpcompany.com', [Validators.required, Validators.email]],
      website: ['https://www.erpcompany.com'],
      taxId: ['12-3456789']
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.companyForm.invalid) return;
    
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('Company settings updated successfully!');
    }, 1000);
  }
}
