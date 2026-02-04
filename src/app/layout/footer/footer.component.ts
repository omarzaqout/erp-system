import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <span class="copyright">
            © {{ currentYear }} ERP System. All rights reserved.
          </span>
        </div>
        <div class="footer-right">
          <a href="#" class="footer-link">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Service</a>
          <a href="#" class="footer-link">Support</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: white;
      border-top: 1px solid var(--border);
      padding: 1rem 1.5rem;
      
      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        @media (max-width: 768px) {
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }
      }
      
      .footer-left {
        .copyright {
          color: var(--text-light);
          font-size: 0.875rem;
        }
      }
      
      .footer-right {
        display: flex;
        gap: 1.5rem;
        
        @media (max-width: 768px) {
          gap: 1rem;
        }
        
        .footer-link {
          color: var(--text-light);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s;
          
          &:hover {
            color: var(--primary-blue);
          }
        }
      }
    }
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
