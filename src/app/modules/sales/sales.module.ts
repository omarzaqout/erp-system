import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SalesComponent } from './sales.component';
import { OrdersComponent } from './orders/orders.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NewOrderComponent } from './orders/new-order/new-order.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { 
    path: '', 
    component: SalesComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/new', component: NewOrderComponent },
      { path: 'invoices', component: InvoicesComponent }
    ]
  }
];

@NgModule({
  declarations: [
    SalesComponent,
    OrdersComponent,
    InvoicesComponent,
    NewOrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SalesModule { }
