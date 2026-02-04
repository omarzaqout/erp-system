import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormPageComponent } from '../../../../shared/components/form-page/form-page.component';
import { CustomerFormConfig } from '../../../../shared/configs/form-configs';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { TabService } from '../../../../shared/services/tab.service';

@Component({
  selector: 'app-new-customer',
  template: `
    <app-form-page
      [title]="'Create New Customer'"
      [icon]="'fas fa-user-plus'"
      [formConfig]="formConfig"
      [breadcrumbs]="breadcrumbs"
      [backRoute]="'/crm/customers'"
      (onSubmit)="onSubmit($event)">
    </app-form-page>
  `,
  styles: [``]
})
export class NewCustomerComponent implements OnInit {
  formConfig = CustomerFormConfig;
  breadcrumbs = [
    { label: 'Home', route: '/dashboard' },
    { label: 'CRM', route: '/crm' },
    { label: 'Customers', route: '/crm/customers' },
    { label: 'New Customer' }
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
      title: 'New Customer',
      route: '/crm/customers/new',
      icon: 'fas fa-user-plus',
      closable: true,
      pinned: false
    });
  }

  onSubmit(data: any) {
    console.log('Creating customer:', data);
    // Add your customer creation logic here
    // Example: this.mockDataService.createCustomer(data).subscribe(...)
    
    // Navigate back to customers list after successful creation
    setTimeout(() => {
      this.router.navigate(['/crm/customers']);
    }, 1000);
  }
}
