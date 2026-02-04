import { Component, OnInit } from '@angular/core';
import { AccountingService, Account } from '../services/accounting.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalService } from '../../../shared/services/modal.service';
import { FormConfig } from '../../../shared/components/shared-form/shared-form.component';
import { CurrencyService } from '../../../core/services/currency.service';

export interface AccountNode extends Account {
  children: AccountNode[];
}

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss']
})
export class ChartOfAccountsComponent implements OnInit {
  accounts$: Observable<Account[]>;
  treeAccounts$: Observable<AccountNode[]>;
  totalAssets$: Observable<number>;
  allAccounts: Account[] = [];
  
  // SAP Group Masks: 1=Assets, 2=Liabilities, 3=Equity, 4=Revenue, 5=Cost of Sales (Purchasing), 6=Expenses, 0=All
  drawers = [
    { id: 1, name: 'Assets', icon: 'fas fa-wallet' },
    { id: 2, name: 'Liabilities', icon: 'fas fa-file-invoice-dollar' },
    { id: 3, name: 'Equity', icon: 'fas fa-users' },
    { id: 4, name: 'Revenue', icon: 'fas fa-chart-line' },
    { id: 5, name: 'Purchasing', icon: 'fas fa-shopping-cart' },
    { id: 6, name: 'Expenses', icon: 'fas fa-file-invoice' },
    { id: 0, name: 'All', icon: 'fas fa-list-ul' }
  ];
  activeGroupMask = 1;
  expandedNodes: Set<string> = new Set(['10000000', '11000000', '11100000', '20000000', '40000000', '50000000', '60000000']);
  searchTerm: string = '';

  constructor(
    private accountingService: AccountingService,
    private modalService: ModalService,
    private currencyService: CurrencyService
  ) {
    this.accounts$ = this.accountingService.accounts$;
    
    this.accounts$.subscribe(accs => this.allAccounts = accs);
    
    this.treeAccounts$ = this.accounts$.pipe(
      map(accounts => {
        let filtered = accounts;
        
        // 1. Drawer Filter
        if (this.activeGroupMask !== 0) {
          filtered = filtered.filter(a => a.GroupMask === this.activeGroupMask);
        }

        // 2. Build Tree
        let tree = this.buildTree(filtered);

        // 3. Search Filter (Preserve branches)
        if (this.searchTerm) {
          tree = this.filterTree(tree, this.searchTerm.toLowerCase());
          // Expand all matching results
          this.expandAll(tree);
        }

        return tree;
      })
    );

    this.totalAssets$ = this.accounts$.pipe(
      map(accounts => accounts
        .filter(a => a.GroupMask === 1 && a.Postable === 'Y')
        .reduce((sum, account) => sum + account.CurrTotal, 0)
      )
    );
  }

  ngOnInit(): void {
  }

  private buildTree(accounts: Account[], fatherNum?: string): AccountNode[] {
    return accounts
      .filter(a => a.FatherNum === fatherNum)
      .map(account => ({
        ...account,
        children: this.buildTree(accounts, account.AcctCode)
      }))
      .sort((a, b) => a.AcctCode.localeCompare(b.AcctCode));
  }

  private filterTree(nodes: AccountNode[], query: string): AccountNode[] {
    return nodes
      .map(node => ({
        ...node,
        children: this.filterTree(node.children, query)
      }))
      .filter(node => 
        node.AcctCode.toLowerCase().includes(query) || 
        node.AcctName.toLowerCase().includes(query) || 
        node.children.length > 0
      );
  }

  private expandAll(nodes: AccountNode[]) {
    nodes.forEach(node => {
      this.expandedNodes.add(node.AcctCode);
      if (node.children.length > 0) this.expandAll(node.children);
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.setActiveDrawer(this.activeGroupMask); // Re-trigger pipe
  }

  exportToCSV() {
    const headers = ['Account Code', 'Account Name', 'Drawer', 'Currency', 'Balance', 'Postable'];
    const rows = this.allAccounts.map(a => [
      a.AcctCode,
      a.AcctName,
      this.drawers.find(d => d.id === a.GroupMask)?.name || '',
      a.ActCurr,
      a.CurrTotal,
      a.Postable === 'Y' ? 'Yes' : 'No'
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Chart_of_Accounts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  setActiveDrawer(groupMask: number) {
    this.activeGroupMask = groupMask;
    this.treeAccounts$ = this.accounts$.pipe(
      map(accounts => {
        let filtered = accounts;
        if (this.activeGroupMask !== 0) {
          filtered = filtered.filter(a => a.GroupMask === this.activeGroupMask);
        }
        let tree = this.buildTree(filtered);
        if (this.searchTerm) {
          tree = this.filterTree(tree, this.searchTerm.toLowerCase());
          this.expandAll(tree);
        }
        return tree;
      })
    );
  }

  getActiveDrawerName(): string {
    const drawer = this.drawers.find(d => d.id === this.activeGroupMask);
    return drawer ? drawer.name : '';
  }

  toggleNode(id: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.expandedNodes.has(id)) {
      this.expandedNodes.delete(id);
    } else {
      this.expandedNodes.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedNodes.has(id);
  }

  private getAccountFormConfig(isEdit: boolean = false): FormConfig {
    return {
      fields: [
        {
          key: 'AcctCode',
          label: 'Account Code',
          type: 'text',
          required: true,
          disabled: isEdit, // Don't allow changing code on edit
          placeholder: 'e.g. 11103000'
        },
        {
          key: 'AcctName',
          label: 'Account Name',
          type: 'text',
          required: true,
          placeholder: 'e.g. Petty Cash'
        },
        {
          key: 'FatherNum',
          label: 'Parent Account',
          type: 'select',
          options: this.allAccounts
            .filter(a => a.Postable === 'N') // Only titles can be parents
            .map(a => ({ value: a.AcctCode, label: `${a.AcctCode} - ${a.AcctName}` }))
        },
        {
          key: 'Postable',
          label: 'Postable Account',
          type: 'select',
          required: true,
          options: [
            { value: 'Y', label: 'Yes (Active/Postable)' },
            { value: 'N', label: 'No (Title/Header)' }
          ],
          defaultValue: 'Y'
        },
        {
          key: 'GroupMask',
          label: 'Drawer (Category)',
          type: 'select',
          required: true,
          options: this.drawers.map(d => ({ value: d.id, label: d.name })),
          defaultValue: this.activeGroupMask
        },
        {
          key: 'ActCurr',
          label: 'Currency',
          type: 'select',
          required: true,
          options: this.currencyService.config.currencies.map(c => ({ 
            value: c.code, 
            label: `${c.code} - ${c.symbol}` 
          })),
          defaultValue: this.currencyService.config.baseCurrency
        }
      ],
      submitLabel: isEdit ? 'Update Account' : 'Create Account',
      layout: 'two-column'
    };
  }

  addAccount() {
    this.modalService.openForm({
      title: 'Add New G/L Account',
      icon: 'fas fa-plus-circle',
      size: 'lg',
      formConfig: this.getAccountFormConfig(false),
      initialData: { GroupMask: this.activeGroupMask, Postable: 'Y', ActCurr: 'USD' },
      onSubmit: (data) => {
        const newAccount: Account = {
          ...data,
          Levels: 1, // Logic would calculate this based on FatherNum in real app
          Finanse: data.Postable,
          DebCred: [1, 5, 6].includes(data.GroupMask) ? 'D' : 'C',
          Active: 'Y',
          CurrTotal: 0,
          FormatCode: data.AcctCode,
          ActType: data.GroupMask === 4 ? 'I' : ([5, 6].includes(data.GroupMask) ? 'E' : 'N'),
          CashAccount: 'N',
          CreateDate: new Date()
        };
        this.accountingService.addAccount(newAccount);
        this.modalService.close();
      }
    });
  }

  editAccount(account: Account, event?: Event) {
    if (event) event.stopPropagation();
    
    this.modalService.openForm({
      title: `Edit Account: ${account.AcctName}`,
      icon: 'fas fa-edit',
      size: 'lg',
      formConfig: this.getAccountFormConfig(true),
      initialData: account,
      onSubmit: (data) => {
        this.accountingService.updateAccount({ ...account, ...data });
        this.modalService.close();
      }
    });
  }

  deleteAccount(acctCode: string, event?: Event) {
    if (event) event.stopPropagation();

    this.modalService.open({
        title: 'Confirm Delete',
        size: 'sm',
        body: `<div class="text-center">
                <i class="fas fa-exclamation-triangle text-warning mb-3" style="font-size: 3rem;"></i>
                <p>Are you sure you want to delete account <strong>${acctCode}</strong>?</p>
                <p class="text-muted small">This action cannot be undone if there are no transactions.</p>
               </div>`,
        buttons: [
            {
                label: 'Cancel',
                class: 'btn-secondary',
                action: () => {}
            },
            {
                label: 'Delete Account',
                class: 'btn-danger',
                action: () => {
                    this.accountingService.deleteAccount(acctCode);
                }
            }
        ]
    });
  }
}
