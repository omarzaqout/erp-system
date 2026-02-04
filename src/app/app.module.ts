import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Core Module
import { CoreModule } from './core/core.module';

// Shared Module
import { SharedModule } from './shared/shared.module';

// Layout Module
import { LayoutModule } from './layout/layout.module';

// Feature Modules
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CrmModule } from './modules/crm/crm.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SalesModule } from './modules/sales/sales.module';
import { PurchasingModule } from './modules/purchasing/purchasing.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { HrModule } from './modules/hr/hr.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    LayoutModule,
    DashboardModule,
    CrmModule,
    InventoryModule,
    SalesModule,
    PurchasingModule,
    AccountingModule,
    HrModule,
    ReportsModule,
    SettingsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
