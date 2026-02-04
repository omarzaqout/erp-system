import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PurchasingComponent } from './purchasing.component';
import { VendorsComponent } from './vendors/vendors.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { 
    path: '', 
    component: PurchasingComponent,
    children: [
      { path: '', redirectTo: 'vendors', pathMatch: 'full' },
      { path: 'vendors', component: VendorsComponent },
      { path: 'purchase-orders', component: PurchaseOrdersComponent }
    ]
  }
];

@NgModule({
  declarations: [
    PurchasingComponent,
    VendorsComponent,
    PurchaseOrdersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PurchasingModule { }
