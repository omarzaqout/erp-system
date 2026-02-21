import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModuleService, Module } from '../../core/services/module.service';
import { TranslationService } from '../../core/services/translation.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  queryParams?: any;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed: boolean = false;
  userName: string = 'John Doe';
  userRole: string = 'Administrator';
  userAvatar: string = 'https://ui-avatars.com/api/?name=John+Doe&background=0070C0&color=fff';

  menuItems: MenuItem[] = [];
  expandedItems: Set<string> = new Set();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private moduleService: ModuleService,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    // Load menu items from enabled modules
    this.moduleService.modules$
      .pipe(takeUntil(this.destroy$))
      .subscribe(modules => {
        this.menuItems = modules
          .filter(m => m.enabled && m.id !== 'settings')
          .map(m => {
            const item: MenuItem = {
              label: m.displayName,
              icon: m.icon,
              route: m.route
            };

            // Add sub-menus for all modules
            if (m.id === 'crm') {
              item.children = [
                { label: 'Customers', icon: 'fas fa-user-friends', route: '/crm/customers' },
                { label: 'Leads', icon: 'fas fa-user-plus', route: '/crm/leads' }
              ];
            } else if (m.id === 'inventory') {
              item.children = [
                { label: 'Products', icon: 'fas fa-box', route: '/inventory/products' },
                { label: 'Warehouses', icon: 'fas fa-warehouse', route: '/inventory/warehouses' }
              ];
            } else if (m.id === 'sales') {
              item.children = [
                { label: 'Orders', icon: 'fas fa-file-invoice', route: '/sales/orders' },
                { label: 'Invoices', icon: 'fas fa-receipt', route: '/sales/invoices' }
              ];
            } else if (m.id === 'purchasing') {
              item.children = [
                { label: 'Vendors', icon: 'fas fa-shuttle-van', route: '/purchasing/vendors' },
                { label: 'Purchase Orders', icon: 'fas fa-file-contract', route: '/purchasing/purchase-orders' }
              ];
            } else if (m.id === 'accounting') {
              item.children = [
                { label: 'Chart of Accounts', icon: 'fas fa-sitemap', route: '/accounting/chart-of-accounts' },
                { label: 'Journal Entry', icon: 'fas fa-book', route: '/accounting/journal-entry' },
                { label: 'Transactions', icon: 'fas fa-exchange-alt', route: '/accounting/transactions' },
                { label: 'Balance Sheet', icon: 'fas fa-file-invoice-dollar', route: '/accounting/balance-sheet' },
                { label: 'Profit & Loss', icon: 'fas fa-chart-pie', route: '/accounting/profit-loss' }
              ];
            } else if (m.id === 'hr') {
              item.children = [
                { label: 'Employees', icon: 'fas fa-users-cog', route: '/hr/employees' }
              ];
            } else if (m.id === 'financial') {
              item.children = [
                { label: 'Currencies (OCRN)', icon: 'fas fa-money-bill-wave', route: '/financial/currencies', queryParams: { tab: 'currencies' } },
                { label: 'Exchange Rates (ORTT)', icon: 'fas fa-chart-line', route: '/financial/currencies', queryParams: { tab: 'rates' } }
              ];
            }

            return item;
          })
          .sort((a, b) => {
            const orderA = modules.find(m => m.route === a.route)?.order || 0;
            const orderB = modules.find(m => m.route === b.route)?.order || 0;
            return orderA - orderB;
          });
        
        // Always add Settings at the end with its own sub-menu
        this.menuItems.push({
          label: 'Settings',
          icon: 'fas fa-cog',
          route: '/settings',
          children: [
            { label: 'General', icon: 'fas fa-sliders-h', route: '/settings/general' },
            { label: 'Modules', icon: 'fas fa-th-large', route: '/settings/modules' },
            { label: 'Users', icon: 'fas fa-user-shield', route: '/settings/users' }
          ]
        });
      });

    // Check screen size on init
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  toggleSubMenu(item: MenuItem, event: Event) {
    if (item.children) {
      event.preventDefault();
      event.stopPropagation();
      if (this.expandedItems.has(item.label)) {
        this.expandedItems.delete(item.label);
      } else {
        this.expandedItems.add(item.label);
      }
    }
  }

  onLinkClick() {
    if (window.innerWidth <= 768) {
      document.querySelector('.main-wrapper')?.classList.remove('sidebar-open');
    }
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems.has(item.label);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkScreenSize() {
    if (window.innerWidth <= 991) {
      this.isCollapsed = true;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    
    // Sync with wrapper for layout adjustment
    if (window.innerWidth > 768) {
      const wrapper = document.querySelector('.main-wrapper');
      if (this.isCollapsed) {
        wrapper?.classList.add('sidebar-collapsed');
      } else {
        wrapper?.classList.remove('sidebar-collapsed');
      }
    }
  }

  logout() {
    // Clear auth and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }
}
