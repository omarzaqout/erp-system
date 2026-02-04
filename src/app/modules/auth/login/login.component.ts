import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-card">
      <div class="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue to ERP System</p>
      </div>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
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
              [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
          </div>
          <div class="invalid-feedback" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            Please enter a valid email address
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="fas fa-lock"></i>
            </span>
            <input 
              [type]="showPassword ? 'text' : 'password'" 
              id="password"
              class="form-control" 
              formControlName="password"
              placeholder="Enter your password"
              [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              (click)="togglePassword()">
              <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
            </button>
          </div>
          <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            Password is required
          </div>
        </div>
        
        <div class="form-options">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="remember">
            <label class="form-check-label" for="remember">Remember me</label>
          </div>
          <a routerLink="/auth/forgot-password" class="forgot-link">Forgot password?</a>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100"
          [disabled]="loginForm.invalid || isLoading">
          <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Don't have an account? <a routerLink="/auth/register">Sign up</a></p>
      </div>
      
      <div class="demo-credentials">
        <p class="text-muted text-center mb-2">Demo Credentials:</p>
        <p class="text-center"><strong>Email:</strong> admin&#64;erp.com</p>
        <p class="text-center"><strong>Password:</strong> admin</p>
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
          
          &.is-invalid {
            border-color: var(--danger-red);
          }
        }
      }
      
      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        
        .form-check-label {
          color: var(--text-light);
          font-size: 0.875rem;
        }
        
        .forgot-link {
          color: var(--primary-blue);
          font-size: 0.875rem;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
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
      
      .demo-credentials {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px dashed var(--border);
        
        p {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(success => {
      this.isLoading = false;
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
