import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Module {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  route: string;
  enabled: boolean;
  category: 'sales' | 'purchasing' | 'inventory' | 'accounting' | 'hr' | 'crm' | 'pos' | 'reports' | 'settings';
  order: number;
  features?: string[];
  dependencies?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private modules = new BehaviorSubject<Module[]>(this.getDefaultModules());
  public modules$: Observable<Module[]> = this.modules.asObservable();

  constructor() {
    this.loadModulesFromStorage();
  }

  private getDefaultModules(): Module[] {
    return [
      {
        id: 'dashboard',
        name: 'dashboard',
        displayName: 'Dashboard',
        description: 'Main dashboard with overview',
        icon: 'fas fa-tachometer-alt',
        route: '/dashboard',
        enabled: true,
        category: 'settings',
        order: 0,
        dependencies: []
      },
      {
        id: 'crm',
        name: 'crm',
        displayName: 'CRM',
        description: 'Customer Relationship Management',
        icon: 'fas fa-users',
        route: '/crm',
        enabled: true,
        category: 'crm',
        order: 1,
        features: ['customers', 'leads', 'opportunities']
      },
      {
        id: 'inventory',
        name: 'inventory',
        displayName: 'Inventory',
        description: 'Product and stock management',
        icon: 'fas fa-boxes',
        route: '/inventory',
        enabled: true,
        category: 'inventory',
        order: 2,
        features: ['products', 'warehouses', 'stock']
      },
      {
        id: 'sales',
        name: 'sales',
        displayName: 'Sales',
        description: 'Sales orders and invoices',
        icon: 'fas fa-shopping-cart',
        route: '/sales',
        enabled: true,
        category: 'sales',
        order: 3,
        features: ['orders', 'invoices', 'quotations']
      },
      {
        id: 'purchasing',
        name: 'purchasing',
        displayName: 'Purchasing',
        description: 'Purchase orders and vendors',
        icon: 'fas fa-truck',
        route: '/purchasing',
        enabled: true,
        category: 'purchasing',
        order: 4,
        features: ['purchase_orders', 'vendors', 'receipts']
      },
      {
        id: 'accounting',
        name: 'accounting',
        displayName: 'Accounting',
        description: 'Financial management and accounting',
        icon: 'fas fa-calculator',
        route: '/accounting',
        enabled: true,
        category: 'accounting',
        order: 5,
        features: ['transactions', 'chart_of_accounts', 'financial_reports']
      },
      {
        id: 'hr',
        name: 'hr',
        displayName: 'HR',
        description: 'Human Resources management',
        icon: 'fas fa-user-tie',
        route: '/hr',
        enabled: true,
        category: 'hr',
        order: 6,
        features: ['employees', 'attendance', 'payroll']
      },
      {
        id: 'pos',
        name: 'pos',
        displayName: 'Point of Sale',
        description: 'Point of Sale system for retail',
        icon: 'fas fa-cash-register',
        route: '/pos',
        enabled: true,
        category: 'pos',
        order: 7,
        features: ['sales', 'payments', 'receipts', 'inventory']
      },
      {
        id: 'reports',
        name: 'reports',
        displayName: 'Reports',
        description: 'Analytics and reports',
        icon: 'fas fa-chart-bar',
        route: '/reports',
        enabled: true,
        category: 'reports',
        order: 8,
        features: ['analytics', 'exports', 'schedules']
      },
      {
        id: 'financial',
        name: 'financial',
        displayName: 'Financial',
        description: 'Currency and financial management',
        icon: 'fas fa-coins',
        route: '/financial',
        enabled: true,
        category: 'accounting',
        order: 5.5,
        features: ['currencies', 'exchange_rates']
      },
      {
        id: 'settings',
        name: 'settings',
        displayName: 'Settings',
        description: 'System settings and configuration',
        icon: 'fas fa-cog',
        route: '/settings',
        enabled: true,
        category: 'settings',
        order: 9,
        features: ['general', 'modules', 'users']
      }
    ];
  }

  getModules(): Module[] {
    return this.modules.value;
  }

  getEnabledModules(): Module[] {
    return this.modules.value.filter(m => m.enabled);
  }

  getModuleById(id: string): Module | undefined {
    return this.modules.value.find(m => m.id === id);
  }

  enableModule(id: string): boolean {
    const module = this.getModuleById(id);
    if (!module) return false;

    // Check dependencies
    if (module.dependencies && module.dependencies.length > 0) {
      const missingDeps = module.dependencies.filter(dep => {
        const depModule = this.getModuleById(dep);
        return !depModule || !depModule.enabled;
      });

      if (missingDeps.length > 0) {
        console.warn(`Cannot enable ${module.displayName}. Missing dependencies: ${missingDeps.join(', ')}`);
        return false;
      }
    }

    const updatedModules = this.modules.value.map(m =>
      m.id === id ? { ...m, enabled: true } : m
    );

    this.modules.next(updatedModules);
    this.saveModulesToStorage();
    return true;
  }

  disableModule(id: string): boolean {
    const module = this.getModuleById(id);
    if (!module) return false;

    // Check if other modules depend on this one
    const dependentModules = this.modules.value.filter(m =>
      m.dependencies && m.dependencies.includes(id) && m.enabled
    );

    if (dependentModules.length > 0) {
      console.warn(`Cannot disable ${module.displayName}. Other modules depend on it: ${dependentModules.map(m => m.displayName).join(', ')}`);
      return false;
    }

    // Don't allow disabling essential modules
    if (['dashboard', 'settings'].includes(id)) {
      console.warn(`Cannot disable essential module: ${module.displayName}`);
      return false;
    }

    const updatedModules = this.modules.value.map(m =>
      m.id === id ? { ...m, enabled: false } : m
    );

    this.modules.next(updatedModules);
    this.saveModulesToStorage();
    return true;
  }

  isModuleEnabled(id: string): boolean {
    const module = this.getModuleById(id);
    return module ? module.enabled : false;
  }

  private loadModulesFromStorage(): void {
    const stored = localStorage.getItem('erp_modules_config');
    if (stored) {
      try {
        const storedModules = JSON.parse(stored);
        const defaultModules = this.getDefaultModules();
        
        // Merge stored config with defaults
        const mergedModules = defaultModules.map(defaultModule => {
          const storedModule = storedModules.find((m: Module) => m.id === defaultModule.id);
          return storedModule ? { ...defaultModule, enabled: storedModule.enabled } : defaultModule;
        });

        this.modules.next(mergedModules);
      } catch (e) {
        console.error('Error loading modules from storage:', e);
      }
    }
  }

  private saveModulesToStorage(): void {
    const modulesToSave = this.modules.value.map(m => ({
      id: m.id,
      enabled: m.enabled
    }));
    localStorage.setItem('erp_modules_config', JSON.stringify(modulesToSave));
  }
}
