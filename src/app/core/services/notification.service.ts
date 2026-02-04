import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  private mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'New Order Received',
      message: 'Order #ORD-2024-001 has been placed by Customer A',
      type: 'info',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'Product "Wireless Mouse" is running low on stock (5 units remaining)',
      type: 'warning',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Payment of $2,500 received from Customer B',
      type: 'success',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    },
    {
      id: '4',
      title: 'Task Completed',
      message: 'Monthly report generation completed successfully',
      type: 'success',
      timestamp: new Date(Date.now() - 86400000),
      read: true
    }
  ];

  constructor() {
    this.notificationsSubject.next(this.mockNotifications);
  }

  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  markAsRead(id: string): void {
    const notifications = this.notificationsSubject.value.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    const notifications = [newNotification, ...this.notificationsSubject.value];
    this.notificationsSubject.next(notifications);
  }

  removeNotification(id: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
  }
}
