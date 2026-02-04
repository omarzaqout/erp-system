import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './profile/profile.component';
import { CompanyComponent } from './company/company.component';
import { ModulesComponent } from './modules/modules.component';
import { GeneralSettingsComponent } from './general/general-settings.component';
import { CurrencyManagementComponent } from './currency-management/currency-management.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { 
    path: '', 
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: GeneralSettingsComponent },
      { path: 'currencies', component: CurrencyManagementComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'modules', component: ModulesComponent }
    ]
  }
];

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileComponent,
    CompanyComponent,
    ModulesComponent,
    GeneralSettingsComponent,
    CurrencyManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class SettingsModule { }
