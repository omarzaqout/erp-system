import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PosSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  openingBalance: number;
  closingBalance?: number;
  status: 'open' | 'closed';
  cashierName: string;
  totalSales: number;
  ordersCount: number;
  
  // Detailed Stats for Z-Report
  cashSales: number;
  cardSales: number;
  totalTax: number;
  totalDiscount: number;
  returnsCount: number;
  returnsAmount: number;
  salesByCategory: { [category: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class PosSessionService {
  private _currentSession = new BehaviorSubject<PosSession | null>(null);
  public currentSession$ = this._currentSession.asObservable();

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    const saved = localStorage.getItem('erp_pos_session');
    if (saved) {
      const session = JSON.parse(saved);
      if (session.status === 'open') {
        this._currentSession.next({
            ...session,
            startTime: new Date(session.startTime)
        });
      }
    }
  }

  startSession(openingBalance: number, cashierName: string): PosSession {
    const session: PosSession = {
      id: 'SESS-' + Date.now().toString().slice(-6),
      startTime: new Date(),
      openingBalance: openingBalance,
      status: 'open',
      cashierName: cashierName,
      totalSales: 0,
      ordersCount: 0,
      cashSales: 0,
      cardSales: 0,
      totalTax: 0,
      totalDiscount: 0,
      returnsCount: 0,
      returnsAmount: 0,
      salesByCategory: {}
    };
    
    this.saveSession(session);
    this._currentSession.next(session);
    return session;
  }

  updateSessionStats(amount: number, paymentMethod: string, tax: number, discount: number, items: any[]) {
    const session = this._currentSession.value;
    if (session && session.status === 'open') {
      session.totalSales += amount;
      session.ordersCount += 1;
      session.totalTax += tax;
      session.totalDiscount += discount;
      
      if (paymentMethod === 'cash') session.cashSales += amount;
      else if (paymentMethod === 'card') session.cardSales += amount;

      // Category Analytics
      items.forEach(item => {
          const cat = item.product.category || 'Uncategorized';
          session.salesByCategory[cat] = (session.salesByCategory[cat] || 0) + (item.product.price * item.quantity);
      });

      this.saveSession(session);
      this._currentSession.next({ ...session });
    }
  }

  recordReturn(amount: number, tax: number) {
      const session = this._currentSession.value;
      if (session && session.status === 'open') {
          session.returnsCount += 1;
          session.returnsAmount += amount;
          session.totalSales -= amount;
          session.totalTax -= tax;
          this.saveSession(session);
          this._currentSession.next({ ...session });
      }
  }

  closeSession(actualClosingBalance: number): PosSession | null {
    const session = this._currentSession.value;
    if (session) {
      session.status = 'closed';
      session.endTime = new Date();
      session.closingBalance = actualClosingBalance;
      
      localStorage.removeItem('erp_pos_session');
      this._currentSession.next(null);
      return session;
    }
    return null;
  }

  private saveSession(session: PosSession) {
    localStorage.setItem('erp_pos_session', JSON.stringify(session));
  }

  isSessionActive(): boolean {
    return this._currentSession.value !== null && this._currentSession.value.status === 'open';
  }
}
