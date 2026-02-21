import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockProducts: number;
  pendingOrders: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    pendingOrders: 0
  };

  orderColumns: TableColumn[] = [
    { key: 'orderNumber', label: 'Order #', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'total', label: 'Total', type: 'currency', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'orderDate', label: 'Date', type: 'date', sortable: true }
  ];

  recentOrders: any[] = [];

  recentActivities = [
    {
      id: '1',
      type: 'order' as const,
      title: 'New Order Received',
      description: 'Order #ORD-2024-001 from Acme Corporation',
      timestamp: new Date(),
      user: 'System'
    },
    {
      id: '2',
      type: 'payment' as const,
      title: 'Payment Received',
      description: '$2,500 payment from TechStart Inc',
      timestamp: new Date(Date.now() - 3600000),
      user: 'Jane Smith'
    },
    {
      id: '3',
      type: 'product' as const,
      title: 'Low Stock Alert',
      description: 'USB-C Hub is running low (8 units remaining)',
      timestamp: new Date(Date.now() - 7200000),
      user: 'System'
    },
    {
      id: '4',
      type: 'user' as const,
      title: 'New Employee Added',
      description: 'Charlie Brown joined as Operations Manager',
      timestamp: new Date(Date.now() - 86400000),
      user: 'HR Team'
    }
  ];

  salesByCategory = [
    { name: 'Electronics', percentage: 45, color: '#0070C0' },
    { name: 'Accessories', percentage: 30, color: '#28A745' },
    { name: 'Software', percentage: 15, color: '#FF6B35' },
    { name: 'Services', percentage: 10, color: '#FFC107' }
  ];

  constructor(
    private mockDataService: MockDataService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.mockDataService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });

    this.mockDataService.getOrders().subscribe(orders => {
      this.recentOrders = orders.slice(0, 5).map(order => ({
        ...order,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
    });
  }

  onOrderClick(order: any) {
    console.log('Order clicked:', order);
  }
}
