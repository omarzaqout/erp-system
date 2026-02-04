import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InventoryComponent } from './inventory.component';
import { ProductsComponent } from './products/products.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { 
    path: '', 
    component: InventoryComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
      { path: 'warehouses', component: WarehousesComponent }
    ]
  }
];

@NgModule({
  declarations: [
    InventoryComponent,
    ProductsComponent,
    WarehousesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryModule { }
