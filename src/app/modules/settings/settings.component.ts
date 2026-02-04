import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <div class="settings-page">
      <div class="page-header">
        <div>
          <h1>{{ 'Settings' | translate }}</h1>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/dashboard">{{ 'Home' | translate }}</a></li>
              <li class="breadcrumb-item active">{{ 'Settings' | translate }}</li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div class="row">
        <div class="col-lg-3">
          <div class="card">
            <div class="list-group list-group-flush">
              <a class="list-group-item" routerLink="general" routerLinkActive="active">
                <i class="fas fa-cog"></i>
                {{ 'General' | translate }}
              </a>
              <a class="list-group-item" routerLink="profile" routerLinkActive="active">
                <i class="fas fa-user"></i>
                {{ 'Profile' | translate }}
              </a>
              <a class="list-group-item" routerLink="company" routerLinkActive="active">
                <i class="fas fa-building"></i>
                {{ 'Company' | translate }}
              </a>
              <a class="list-group-item" href="#">
                <i class="fas fa-bell"></i>
                {{ 'Notifications' | translate }}
              </a>
              <a class="list-group-item" href="#">
                <i class="fas fa-shield-alt"></i>
                {{ 'Security' | translate }}
              </a>
              <a class="list-group-item" href="#">
                <i class="fas fa-database"></i>
                {{ 'Backup' | translate }}
              </a>
            </div>
          </div>
        </div>
        <div class="col-lg-9">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border);

        h1 {
          font-size: 1.75rem;
          margin-bottom: 0.25rem;
        }

        .breadcrumb {
          margin-bottom: 0;
          background: transparent;
          padding: 0;
        }
      }

      .list-group-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        color: var(--text-dark);
        text-decoration: none;
        border: none;
        border-bottom: 1px solid var(--border);
        
        &:last-child {
          border-bottom: none;
        }
        
        i {
          width: 20px;
          color: var(--text-light);
        }
        
        &:hover {
          background-color: var(--light-blue);
        }
        
        &.active {
          background-color: var(--primary-blue);
          color: white;
          
          i {
            color: white;
          }
        }
      }
    }
  `]
})
export class SettingsComponent { }
