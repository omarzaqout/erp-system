import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CrmComponent } from './crm.component';
import { CustomersComponent } from './customers/customers.component';
import { LeadsComponent } from './leads/leads.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { NewCustomerComponent } from './customers/new-customer/new-customer.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { 
    path: '', 
    component: CrmComponent,
    children: [
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: 'customers', component: CustomersComponent },
      { path: 'customers/new', component: NewCustomerComponent },
      { path: 'customers/:id', component: CustomerDetailComponent },
      { path: 'leads', component: LeadsComponent }
    ]
  }
];

@NgModule({
  declarations: [
    CrmComponent,
    CustomersComponent,
    LeadsComponent,
    CustomerDetailComponent,
    NewCustomerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CrmModule { }
