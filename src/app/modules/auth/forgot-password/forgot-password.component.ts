import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="auth-card">
      <div class="auth-header">
        <h2>Forgot Password?</h2>
        <p>Enter your email and we'll send you instructions to reset your password</p>
      </div>
      
      <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" *ngIf="!emailSent">
        <div class="form-group">
          <label for="email">Email Address</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-envelope"></i>
            </span>
            <input 
              type="email" 
              id="email"
              class="form-control" 
              formControlName="email"
              placeholder="Enter your email"
            >
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100"
          [disabled]="forgotForm.invalid || isLoading">
          <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>
      
      <div class="success-message" *ngIf="emailSent">
        <div class="icon-success">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Check Your Email</h3>
        <p>We've sent password reset instructions to your email address.</p>
        <button class="btn btn-primary w-100" (click)="backToLogin()">
          Back to Login
        </button>
      </div>
      
      <div class="auth-footer" *ngIf="!emailSent">
        <p>Remember your password? <a routerLink="/auth/login">Sign in</a></p>
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
        margin-bottom: 1.5rem;
        
        label {
          font-weight: 500;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }
        
        .input-group-text {
          background: var(--background);
          border-color: var(--border);
          color: var(--text-light);
        }
        
        .form-control {
          border-color: var(--border);
          
          &:focus {
            border-color: var(--primary-blue);
            box-shadow: 0 0 0 3px rgba(0, 112, 192, 0.1);
          }
        }
      }
      
      .btn-primary {
        padding: 0.875rem;
        font-weight: 600;
      }
      
      .success-message {
        text-align: center;
        padding: 1rem 0;
        
        .icon-success {
          width: 80px;
          height: 80px;
          background: rgba(40, 167, 69, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          
          i {
            font-size: 2.5rem;
            color: var(--success-green);
          }
        }
        
        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
        }
        
        p {
          color: var(--text-light);
          margin-bottom: 1.5rem;
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
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading: boolean = false;
  emailSent: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    
    // Simulate sending reset email
    setTimeout(() => {
      this.isLoading = false;
      this.emailSent = true;
    }, 1500);
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
