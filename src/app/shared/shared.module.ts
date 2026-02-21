import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pipes
import { CurrencyPipe } from './pipes/currency.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { StatusBadgePipe } from './pipes/status-badge.pipe';
import { TranslatePipe } from '../core/pipes/translate.pipe';

// Directives
import { TooltipDirective } from './directives/tooltip.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';

// Components
import { DataTableComponent } from './components/data-table/data-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { ChartWidgetComponent } from './components/chart-widget/chart-widget.component';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';
import { ModalComponent } from './components/modal/modal.component';
import { OrderFormComponent } from './components/modal/order-form.component';
import { SharedFormComponent } from './components/shared-form/shared-form.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { FormPageComponent } from './components/form-page/form-page.component';
import { TabComponent } from './components/tabs/tab/tab.component';
import { TabsContainerComponent } from './components/tabs/tabs-container/tabs-container.component';

import { PageWrapperComponent } from './components/page-wrapper/page-wrapper.component';

@NgModule({
  declarations: [
    // Pipes
    CurrencyPipe,
    DateFormatPipe,
    StatusBadgePipe,
    TranslatePipe,
    // Directives
    TooltipDirective,
    ClickOutsideDirective,
    // Components
    DataTableComponent,
    PaginationComponent,
    SearchFilterComponent,
    StatCardComponent,
    ChartWidgetComponent,
    RecentActivityComponent,
    ModalComponent,
    OrderFormComponent,
    SharedFormComponent,
    ModalFormComponent,
    FormPageComponent,
    TabComponent,
    TabsContainerComponent,
    PageWrapperComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    // Pipes
    CurrencyPipe,
    DateFormatPipe,
    StatusBadgePipe,
    TranslatePipe,
    // Directives
    TooltipDirective,
    ClickOutsideDirective,
    // Components
    DataTableComponent,
    PaginationComponent,
    SearchFilterComponent,
    StatCardComponent,
    ChartWidgetComponent,
    RecentActivityComponent,
    ModalComponent,
    OrderFormComponent,
    SharedFormComponent,
    ModalFormComponent,
    FormPageComponent,
    TabComponent,
    TabsContainerComponent,
    PageWrapperComponent,
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
