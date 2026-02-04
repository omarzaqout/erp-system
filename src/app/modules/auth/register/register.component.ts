import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-card">
      <div class="auth-header">
        <h2>Create Account</h2>
        <p>Sign up to get started with ERP System</p>
      </div>
      
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName"
                class="form-control" 
                formControlName="firstName"
                placeholder="First name"
              >
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName"
                class="form-control" 
                formControlName="lastName"
                placeholder="Last name"
              >
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            type="email" 
            id="email"
            class="form-control" 
            formControlName="email"
            placeholder="Enter your email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password"
            class="form-control" 
            formControlName="password"
            placeholder="Create a password"
          >
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword"
            class="form-control" 
            formControlName="confirmPassword"
            placeholder="Confirm your password"
          >
        </div>
        
        <div class="form-group">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="terms" formControlName="terms">
            <label class="form-check-label" for="terms">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100"
          [disabled]="registerForm.invalid || isLoading">
          <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-card {
      background: white;
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      
      .auth-header {
        text-align: center;
        margin-bottom: 2rem;
        
        h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }
        
        p {
          color: var(--text-light);
          margin: 0;
        }
      }
      
      .form-group {
        margin-bottom: 1.25rem;
        
        label {
          font-weight: 500;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }
        
        .form-control {
          border-color: var(--border);
          
          &:focus {
            border-color: var(--primary-blue);
            box-shadow: 0 0 0 3px rgba(0, 112, 192, 0.1);
          }
        }
        
        .form-check-label {
          color: var(--text-light);
          font-size: 0.875rem;
          
          a {
            color: var(--primary-blue);
          }
        }
      }
      
      .btn-primary {
        padding: 0.875rem;
        font-weight: 600;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 112, 192, 0.3);
        }
      }
      
      .auth-footer {
        text-align: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);
        
        p {
          color: var(--text-light);
          margin: 0;
          
          a {
            color: var(--primary-blue);
            font-weight: 600;
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    
    // Simulate registration
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/auth/login']);
    }, 1500);
  }
}
