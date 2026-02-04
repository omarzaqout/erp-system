import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormPageComponent } from '../../../../shared/components/form-page/form-page.component';
import { OrderFormConfig } from '../../../../shared/configs/form-configs';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { TabService } from '../../../../shared/services/tab.service';

@Component({
  selector: 'app-new-order',
  template: `
    <app-form-page
      [title]="'Create New Order'"
      [icon]="'fas fa-shopping-cart'"
      [formConfig]="formConfig"
      [breadcrumbs]="breadcrumbs"
      [backRoute]="'/sales/orders'"
      (onSubmit)="onSubmit($event)">
    </app-form-page>
  `,
  styles: [``]
})
export class NewOrderComponent implements OnInit {
  formConfig = OrderFormConfig;
  breadcrumbs = [
    { label: 'Home', route: '/dashboard' },
    { label: 'Sales', route: '/sales' },
    { label: 'Orders', route: '/sales/orders' },
    { label: 'New Order' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mockDataService: MockDataService,
    private tabService: TabService
  ) {}

  ngOnInit() {
    // Open this page as a tab
    this.tabService.openTab({
      title: 'New Order',
      route: '/sales/orders/new',
      icon: 'fas fa-shopping-cart',
      closable: true,
      pinned: false
    });
  }

  onSubmit(data: any) {
    console.log('Creating order:', data);
    // Add your order creation logic here
    // Example: this.mockDataService.createOrder(data).subscribe(...)
    
    // Navigate back to orders list after successful creation
    setTimeout(() => {
      this.router.navigate(['/sales/orders']);
    }, 1000);
  }
}
