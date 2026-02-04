import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  breadcrumbs: string[] = ['Dashboard'];
  showSearch: boolean = false;
  searchQuery: string = '';
  showNotifications: boolean = false;
  showUserMenu: boolean = false;
  notifications: Notification[] = [];
  unreadCount: number = 0;
  
  userName: string = 'John Doe';
  userEmail: string = 'john.doe@company.com';
  userAvatar: string = 'https://ui-avatars.com/api/?name=John+Doe&background=0070C0&color=fff';

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications.slice(0, 5);
      this.unreadCount = this.notificationService.getUnreadCount();
    });

    // Update breadcrumbs based on route
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const segments = url.split('/').filter(s => s);
      this.breadcrumbs = segments.length > 0 
        ? segments.map(s => s.charAt(0).toUpperCase() + s.slice(1))
        : ['Dashboard'];
    });
  }

  toggleSidebar() {
    // Emit event to sidebar component
    document.querySelector('.sidebar')?.classList.toggle('show');
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onSearch() {
    console.log('Search:', this.searchQuery);
    this.showSearch = false;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }

  markAllRead() {
    this.notificationService.markAllAsRead();
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'success': 'fas fa-check-circle',
      'warning': 'fas fa-exclamation-triangle',
      'info': 'fas fa-info-circle',
      'error': 'fas fa-times-circle'
    };
    return icons[type] || 'fas fa-bell';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }
}
