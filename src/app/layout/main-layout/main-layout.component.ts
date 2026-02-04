import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  template: `
    <div class="main-wrapper">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-header></app-header>
        <app-tabs-container></app-tabs-container>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .main-wrapper {
      display: flex;
      min-height: 100vh;
    }
    
    .main-content {
      flex: 1;
      margin-inline-start: var(--sidebar-width);
      padding-top: var(--header-height);
      transition: margin-inline-start 0.3s ease;
      display: flex;
      flex-direction: column;
      min-height: 100vh;

      :host-context([dir='rtl']) & {
        margin-inline-start: var(--sidebar-width); // Re-assert logical property
      }
    }
    
    .content-area {
      flex: 1;
      padding: 1.5rem;
      background-color: var(--background);
    }
    
    @media (max-width: 991px) {
      .main-content {
        margin-left: var(--sidebar-collapsed);
        [dir='rtl'] & {
          margin-left: 0;
          margin-right: var(--sidebar-collapsed);
        }
      }
    }
    
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        [dir='rtl'] & {
          margin-right: 0;
        }
      }
    }
  `]
})
export class MainLayoutComponent { }
