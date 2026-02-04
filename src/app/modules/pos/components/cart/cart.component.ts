import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { PosService, CartItem, Product } from '../../services/pos.service';
import { AccountingService, JournalEntry } from '../../../../modules/accounting/services/accounting.service';
import { InventoryService } from '../../../../modules/inventory/services/inventory.service';
import { PosSessionService } from '../../services/pos-session.service';
import { CurrencyService } from '../../../../core/services/currency.service';
import { CustomerService } from '../../../../modules/crm/services/customer.service';
import { Customer } from '../../../../core/services/mock-data.service';
import { TaxService } from '../../../../core/services/tax.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart$: Observable<CartItem[]>;
  subtotal$: Observable<number>;
  taxAmount$: Observable<number>;
  total$: Observable<number>;
  
  // Tax & Discount States
  discountPercentage: number = 0;
  isWholesale: boolean = false;
  
  lastOrder: { items: CartItem[], total: number, date: Date, id: string, paymentMethod: string, currency: string, customer?: Customer, taxAmount: number, discountAmount: number } | null = null;
  qrCodeData: string = '';
  
  showPaymentScreen = false;
  selectedPaymentMethod: 'cash' | 'card' = 'cash';

  // Customer Selection
  selectedCustomer: Customer | null = null;
  customerSearchQuery: string = '';
  showCustomerDropdown: boolean = false;
  filteredCustomers: Customer[] = [];

  constructor(
    private posService: PosService,
    private accountingService: AccountingService,
    private inventoryService: InventoryService,
    private sessionService: PosSessionService,
    private currencyService: CurrencyService,
    private customerService: CustomerService,
    private taxService: TaxService
  ) {
    this.cart$ = this.posService.cart$;
    
    // Subtotal with wholesale logic
    this.subtotal$ = this.cart$.pipe(
        map(items => items.reduce((acc, item) => {
            let price = item.product.price;
            if (this.isWholesale) price = price * 0.8; // 20% cheaper for wholesale
            return acc + (price * item.quantity);
        }, 0))
    );
    
    // Complex calculation for tax and total
    this.taxAmount$ = combineLatest([this.subtotal$]).pipe(
        map(([subtotal]) => {
            const afterDiscount = subtotal * (1 - this.discountPercentage / 100);
            return this.taxService.calculateTax(afterDiscount);
        })
    );

    this.total$ = combineLatest([this.subtotal$, this.taxAmount$]).pipe(
        map(([subtotal, tax]) => {
            const afterDiscount = subtotal * (1 - this.discountPercentage / 100);
            return afterDiscount + tax;
        })
    );
  }

  ngOnInit(): void { }

  applyDiscount(percent: number) {
    this.discountPercentage = percent;
    this.posService.refreshCart();
  }

  toggleWholesale() {
    this.isWholesale = !this.isWholesale;
    this.posService.refreshCart();
  }

  onCustomerSearch() {
    if (this.customerSearchQuery.length > 0) {
      this.filteredCustomers = this.customerService.searchCustomers(this.customerSearchQuery);
      this.showCustomerDropdown = true;
    } else {
      this.showCustomerDropdown = false;
    }
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.customerSearchQuery = customer.name;
    this.showCustomerDropdown = false;
    
    // Auto wholesale for companies
    if (customer.company && customer.company.length > 0) {
        this.isWholesale = true;
        this.posService.refreshCart();
    }
  }

  clearCustomer() {
    this.selectedCustomer = null;
    this.customerSearchQuery = '';
    this.isWholesale = false;
    this.posService.refreshCart();
  }

  updateQty(item: CartItem, change: number) {
    this.posService.updateQuantity(item.product.id, item.quantity + change);
  }

  removeItem(item: CartItem) {
    this.posService.removeFromCart(item.product.id);
  }

  clear() {
    this.posService.clearCart();
    this.lastOrder = null;
    this.showPaymentScreen = false;
    this.clearCustomer();
    this.discountPercentage = 0;
  }

  goToPayment() {
    let totalValue = 0;
    this.total$.subscribe(val => totalValue = val).unsubscribe();
    if (totalValue > 0) {
      this.showPaymentScreen = true;
    }
  }

  cancelPayment() {
    this.showPaymentScreen = false;
  }

  selectPaymentMethod(method: 'cash' | 'card') {
    this.selectedPaymentMethod = method;
  }

  // Refund logic
  refundItem(item: CartItem) {
      if (confirm(`Do you want to refund ${item.product.name}? Product will be returned to inventory.`)) {
          const price = this.isWholesale ? item.product.price * 0.8 : item.product.price;
          const tax = this.taxService.calculateTax(price);
          
          this.inventoryService.updateStock(item.product.id, 1);
          this.sessionService.recordReturn(price + tax, tax);
          
          // Add accounting entry for refund
          const entry: JournalEntry = {
              id: 'REF-' + Math.random().toString(36).substr(2, 5),
              date: new Date(),
              reference: 'POS Refund',
              memo: `Refund: ${item.product.name}`,
              status: 'Posted',
              totalAmount: price + tax,
              lines: [
                  { accountId: '2', debit: 0, credit: price + tax, description: 'Cash Refund' },
                  { accountId: '8', debit: price, credit: 0, description: 'Sales Reversal' },
                  { accountId: '7', debit: tax, credit: 0, description: 'Tax Reversal' }
              ]
          };
          this.accountingService.addJournalEntry(entry);
          this.removeItem(item);
          alert('Item refunded and stock updated.');
      }
  }

  checkout() {
    let subtotalBase = 0;
    let taxAmountBase = 0;
    let totalValueBase = 0;
    let currentCart: CartItem[] = [];
    
    this.subtotal$.subscribe(val => subtotalBase = val).unsubscribe();
    this.taxAmount$.subscribe(val => taxAmountBase = val).unsubscribe();
    this.total$.subscribe(val => totalValueBase = val).unsubscribe();
    this.cart$.subscribe(items => currentCart = items).unsubscribe();

    if (totalValueBase <= 0 || currentCart.length === 0) {
      return;
    }

    const orderId = 'POS-' + Math.random().toString(36).substr(2, 9);
    const orderDate = new Date();
    const currencyCode = this.currencyService.selectedCurrency;
    const rate = this.currencyService.getRate(currencyCode);
    const discountAmountBase = subtotalBase * (this.discountPercentage / 100);
    const totalLocal = totalValueBase * rate;

    // 1. Update Inventory
    currentCart.forEach(item => {
      this.inventoryService.updateStock(item.product.id, -item.quantity);
    });

    // 2. Journal Entry
    const paymentAccountId = this.selectedPaymentMethod === 'cash' ? '2' : '3';
    const netSalesBase = subtotalBase - discountAmountBase;
    const entry: JournalEntry = {
      id: orderId, date: orderDate, reference: 'POS Sale',
      memo: `Sale to ${this.selectedCustomer?.name || 'Walk-in'} (Disc: ${this.discountPercentage}%)`,
      status: 'Posted', totalAmount: totalValueBase,
      lines: [
        { accountId: paymentAccountId, debit: totalValueBase, credit: 0, description: 'Payment' },
        { accountId: '8', debit: 0, credit: netSalesBase, description: 'Sales Revenue' },
        { accountId: '7', debit: 0, credit: taxAmountBase, description: 'Tax collected' }
      ]
    };
    this.accountingService.addJournalEntry(entry);
    
    // 3. Session Stats Update
    this.sessionService.updateSessionStats(totalValueBase, this.selectedPaymentMethod, taxAmountBase, discountAmountBase, currentCart);
    
    // 4. Receipt Data
    this.lastOrder = {
      items: currentCart.map(i => ({...i, product: {...i.product, price: this.isWholesale ? i.product.price * 0.8 : i.product.price}})),
      total: totalValueBase, date: orderDate, id: orderId,
      paymentMethod: this.selectedPaymentMethod, currency: currencyCode,
      customer: this.selectedCustomer || undefined, taxAmount: taxAmountBase, discountAmount: discountAmountBase
    };

    const seller = 'Antigravity ERP';
    const vatNo = 'VAT-123456';
    const symbol = this.currencyService.getSymbol(currencyCode);
    const qrRawData = `Seller: ${seller}\nVAT: ${vatNo}\nTime: ${orderDate.toISOString()}\nTotal: ${symbol}${totalLocal.toFixed(2)}`;
    this.qrCodeData = encodeURIComponent(qrRawData);

    this.showPaymentScreen = false;
    this.posService.clearCart();
    this.clearCustomer();
    this.discountPercentage = 0;
    
    setTimeout(() => {
        if (confirm(`Payment successful: ${symbol}${totalLocal.toFixed(2)}. Print receipt?`)) this.print();
    }, 100);
  }

  print() {
    if (!this.lastOrder) return;
    setTimeout(() => { window.print(); }, 100);
  }
}
