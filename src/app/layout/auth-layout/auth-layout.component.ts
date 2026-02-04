import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  template: `
    <div class="auth-layout">
      <div class="auth-background">
        <div class="auth-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      <div class="auth-content">
        <div class="auth-logo">
          <i class="fas fa-cubes"></i>
          <span>ERP System</span>
        </div>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      display: flex;
      position: relative;
      overflow: hidden;
      
      .auth-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%);
        
        .auth-shapes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          
          .shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            
            &.shape-1 {
              width: 400px;
              height: 400px;
              top: -100px;
              right: -100px;
            }
            
            &.shape-2 {
              width: 300px;
              height: 300px;
              bottom: -50px;
              left: -50px;
            }
            
            &.shape-3 {
              width: 200px;
              height: 200px;
              top: 50%;
              left: 30%;
              background: rgba(255, 255, 255, 0.05);
            }
          }
        }
      }
      
      .auth-content {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 450px;
        margin: auto;
        padding: 2rem;
        
        .auth-logo {
          text-align: center;
          margin-bottom: 2rem;
          color: white;
          
          i {
            font-size: 3rem;
            margin-bottom: 0.5rem;
          }
          
          span {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
          }
        }
      }
    }
  `]
})
export class AuthLayoutComponent { }
