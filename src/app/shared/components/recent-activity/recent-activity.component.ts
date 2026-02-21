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
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.scss']
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
