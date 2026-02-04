import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Profile Settings</h5>
      </div>
      <div class="card-body">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label>First Name</label>
                <input type="text" class="form-control" formControlName="firstName">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group mb-3">
                <label>Last Name</label>
                <input type="text" class="form-control" formControlName="lastName">
              </div>
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label>Email</label>
            <input type="email" class="form-control" formControlName="email">
          </div>
          
          <div class="form-group mb-3">
            <label>Phone</label>
            <input type="tel" class="form-control" formControlName="phone">
          </div>
          
          <div class="form-group mb-3">
            <label>Bio</label>
            <textarea class="form-control" rows="3" formControlName="bio"></textarea>
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || isLoading">
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
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['John', Validators.required],
      lastName: ['Doe', Validators.required],
      email: ['john.doe@company.com', [Validators.required, Validators.email]],
      phone: ['+1 234 567 890', Validators.required],
      bio: ['System Administrator with 5+ years of experience.']
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.profileForm.invalid) return;
    
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('Profile updated successfully!');
    }, 1000);
  }
}
