import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'crm',
        loadChildren: () => import('./modules/crm/crm.module').then(m => m.CrmModule)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./modules/inventory/inventory.module').then(m => m.InventoryModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('./modules/sales/sales.module').then(m => m.SalesModule)
      },
      {
        path: 'purchasing',
        loadChildren: () => import('./modules/purchasing/purchasing.module').then(m => m.PurchasingModule)
      },
      {
        path: 'accounting',
        loadChildren: () => import('./modules/accounting/accounting.module').then(m => m.AccountingModule)
      },
      {
        path: 'hr',
        loadChildren: () => import('./modules/hr/hr.module').then(m => m.HrModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'pos',
        loadChildren: () => import('./modules/pos/pos.module').then(m => m.PosModule)
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
