import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HrComponent } from './hr.component';
import { EmployeesComponent } from './employees/employees.component';
import { PayrollComponent } from './payroll/payroll.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { 
    path: '', 
    component: HrComponent,
    children: [
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
      { path: 'employees', component: EmployeesComponent },
      { path: 'payroll', component: PayrollComponent }
    ]
  }
];

@NgModule({
  declarations: [
    HrComponent,
    EmployeesComponent,
    PayrollComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HrModule { }
