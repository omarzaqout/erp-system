import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer, MockDataService } from '../../../core/services/mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private _customers = new BehaviorSubject<Customer[]>([]);
  public customers$ = this._customers.asObservable();

  constructor(private mockDataService: MockDataService) {
    this.loadCustomers();
  }

  private loadCustomers() {
    this.mockDataService.getCustomers().subscribe(customers => {
      this._customers.next(customers);
    });
  }

  addCustomer(customer: Customer) {
    const current = this._customers.value;
    this._customers.next([customer, ...current]);
  }

  searchCustomers(query: string): Customer[] {
    const q = query.toLowerCase();
    return this._customers.value.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.phone.includes(q) || 
      c.email.toLowerCase().includes(q)
    );
  }
}
