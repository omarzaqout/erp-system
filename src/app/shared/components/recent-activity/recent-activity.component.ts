import { Component, Input } from '@angular/core';

export interface Activity {
  id: string;
  type: 'order' | 'payment' | 'user' | 'product' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

@Component({
  selector: 'app-recent-activity',
  template: `
    <div class="card recent-activity">
      <div class="card-header">
        <h5 class="mb-0">{{ title }}</h5>
      </div>
      <div class="card-body p-0">
        <div class="activity-list">
          <div class="activity-item" *ngFor="let activity of activities">
            <div class="activity-icon" [ngClass]="'icon-' + activity.type">
              <i [class]="getIcon(activity.type)"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-description">{{ activity.description }}</div>
              <div class="activity-meta">
                <span class="activity-time">{{ activity.timestamp | erpDate:'datetime' }}</span>
                <span class="activity-user" *ngIf="activity.user">
                  by {{ activity.user }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recent-activity {
      height: 100%;
      
      .card-header {
        background: transparent;
        border-bottom: 1px solid var(--border);
        padding: 1rem 1.25rem;
        
        h5 {
          font-size: 1rem;
          font-weight: 600;
        }
      }
      
      .activity-list {
        max-height: 400px;
        overflow-y: auto;
      }
      
      .activity-item {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--border);
        transition: background-color 0.2s;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background-color: var(--light-blue);
        }
        
        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          
          &.icon-order {
            background-color: var(--light-blue);
            color: var(--primary-blue);
          }
          
          &.icon-payment {
            background-color: rgba(40, 167, 69, 0.1);
            color: var(--success-green);
          }
          
          &.icon-user {
            background-color: rgba(255, 107, 53, 0.1);
            color: var(--accent-orange);
          }
          
          &.icon-product {
            background-color: rgba(255, 193, 7, 0.1);
            color: var(--warning-yellow);
          }
          
          &.icon-system {
            background-color: rgba(108, 117, 125, 0.1);
            color: #6c757d;
          }
        }
        
        .activity-content {
          flex: 1;
          min-width: 0;
          
          .activity-title {
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.25rem;
          }
          
          .activity-description {
            color: var(--text-light);
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
          }
          
          .activity-meta {
            font-size: 0.75rem;
            color: var(--text-light);
            
            .activity-time {
              margin-right: 0.5rem;
            }
          }
        }
      }
    }
  `]
})
export class RecentActivityComponent {
  @Input() title: string = 'Recent Activity';
  @Input() activities: Activity[] = [];

  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'order': 'fas fa-shopping-cart',
      'payment': 'fas fa-dollar-sign',
      'user': 'fas fa-user',
      'product': 'fas fa-box',
      'system': 'fas fa-cog'
    };
    return icons[type] || 'fas fa-circle';
  }
}
