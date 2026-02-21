import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  totalRevenue: number = 0;
  totalOrders: number = 0;
  totalCustomers: number = 0;
  conversionRate: number = 68;

  topProducts = [
    { name: 'Wireless Mouse', sales: 245 },
    { name: 'Mechanical Keyboard', sales: 189 },
    { name: 'USB-C Hub', sales: 156 },
    { name: 'Webcam 4K', sales: 134 },
    { name: 'Laptop Stand', sales: 98 }
  ];

  topCustomers = [
    { name: 'Acme Corporation', total: 125000 },
    { name: 'Smart Retail Co', total: 198000 },
    { name: 'TechStart Inc', total: 78000 },
    { name: 'Digital Dynamics', total: 92000 },
    { name: 'Global Solutions Ltd', total: 34000 }
  ];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.mockDataService.getDashboardStats().subscribe(stats => {
      this.totalRevenue = stats.totalRevenue;
      this.totalOrders = stats.totalOrders;
      this.totalCustomers = stats.totalCustomers;
    });
  }
}
