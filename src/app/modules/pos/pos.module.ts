import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { PosContainerComponent } from './components/pos-container/pos-container.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';

// Redirect to new container
const routes: Routes = [
  { path: '', component: PosContainerComponent }
];

@NgModule({
  declarations: [
    PosContainerComponent,
    ProductListComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class PosModule { }
