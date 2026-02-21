import { Injectable } from '@angular/core';
import { EventBusService } from '../events/event-bus.service';
import { JournalEntry } from '../models/accounting.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AccountingEngineService {

  // In memory store for mock automated entries
  private automatedEntries: JournalEntry[] = [];

  constructor(
    private eventBus: EventBusService,
    private notificationService: NotificationService
  ) {}

  public init() {
    console.log('🏢 ERP Accounting Engine Initialized: Checking Event Bus...');
    
    // Subscribe to POS transactions
    this.eventBus.on<any>('POS_ORDER_COMPLETED').subscribe(order => {
      console.log('🔄 Accounting Engine caught POS_ORDER_COMPLETED. Creating automated Journal Entry...');
      this.handlePosOrderCompleted(order);
    });
  }

  private handlePosOrderCompleted(orderPayload: any) {
    // Advanced ERP G/L Determination Mapping
    const GL_ACCOUNTS = {
      CASH: { id: '1010', name: 'Cash on Hand (Petty Cash)' },
      SALES_REVENUE: { id: '4010', name: 'Sales Revenue' },
      TAX_PAYABLE: { id: '2010', name: 'VAT/Tax Payable' },
      COGS: { id: '5010', name: 'Cost of Goods Sold' },
      INVENTORY: { id: '1050', name: 'Inventory Asset' }
    };

    const jv: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      entryNumber: 'JE-POS-' + new Date().getTime().toString().substr(-6),
      date: new Date(),
      reference: orderPayload.orderNumber || 'POS Checkout',
      memo: `Automated POS Sales Receipt #${orderPayload.orderNumber || ''}`,
      status: 'posted',
      lines: [],
      totalDebit: 0,
      totalCredit: 0
    };

    // 1. Debit Cash (total amount received)
    jv.lines.push({
      accountId: GL_ACCOUNTS.CASH.id,
      accountName: GL_ACCOUNTS.CASH.name,
      debit: orderPayload.total,
      credit: 0,
      memo: 'Cash Receipt from POS'
    });

    // 2. Credit Sales Revenue (subtotal)
    jv.lines.push({
      accountId: GL_ACCOUNTS.SALES_REVENUE.id,
      accountName: GL_ACCOUNTS.SALES_REVENUE.name,
      debit: 0,
      credit: orderPayload.subtotal,
      memo: 'Sales Revenue Recognition'
    });

    // 3. Credit Tax (tax amount)
    if (orderPayload.tax > 0) {
      jv.lines.push({
        accountId: GL_ACCOUNTS.TAX_PAYABLE.id,
        accountName: GL_ACCOUNTS.TAX_PAYABLE.name,
        debit: 0,
        credit: orderPayload.tax,
        memo: 'Output Tax Liability'
      });
    }

    // 4. Advanced: Cost of Goods Sold & Inventory deduction
    let totalCogs = 0;
    if (orderPayload.items && Array.isArray(orderPayload.items)) {
       // Using a mock calculation if exact COGS is unknown. In a real system, the product master provides the cost
       totalCogs = orderPayload.items.reduce((sum: number, item: any) => {
         const avgCost = item.cost || (item.price * 0.6); // 60% of price as mock cost
         return sum + (avgCost * item.quantity);
       }, 0);
    }

    if (totalCogs > 0) {
      // Debit COGS
      jv.lines.push({
        accountId: GL_ACCOUNTS.COGS.id,
        accountName: GL_ACCOUNTS.COGS.name,
        debit: totalCogs,
        credit: 0,
        memo: 'Cost of Sales Recognition'
      });
      // Credit Inventory
      jv.lines.push({
        accountId: GL_ACCOUNTS.INVENTORY.id,
        accountName: GL_ACCOUNTS.INVENTORY.name,
        debit: 0,
        credit: totalCogs,
        memo: 'Inventory Stock Relief'
      });
    }

    // Calculate Totals to balance Journal Entry
    jv.totalDebit = jv.lines.reduce((sum, line) => sum + line.debit, 0);
    jv.totalCredit = jv.lines.reduce((sum, line) => sum + line.credit, 0);

    // Make sure debit strictly equals credit (Validation rule)
    if (Math.abs(jv.totalDebit - jv.totalCredit) > 0.01) {
       console.error('Accounting Error: Journal Entry is unbalanced!', jv);
       return;
    }

    // Post to persistent store
    this.automatedEntries.push(jv);
    console.log('✅ ERP Accounting Engine: Automated Journal Entry created successfully!', jv);
    
    this.notificationService.addNotification({ type: 'success', message: `System automatically posted Journal Entry (${jv.entryNumber}) for the POS transaction!`, title: '⚙️ Accounting Engine', read: false });
  }

  getAutomatedEntries(): JournalEntry[] {
    return this.automatedEntries;
  }
}
