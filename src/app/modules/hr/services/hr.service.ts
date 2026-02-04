import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, MockDataService } from '../../../core/services/mock-data.service';

export interface PayrollRun {
  id: string;
  month: string;
  year: number;
  status: 'Draft' | 'Approved' | 'Paid';
  totalAmount: number;
  employeesCount: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HrService {
  private _employees = new BehaviorSubject<Employee[]>([]);
  public employees$ = this._employees.asObservable();

  private _payrollRuns = new BehaviorSubject<PayrollRun[]>([
    {
        id: 'PAY-2024-01',
        month: 'January',
        year: 2024,
        status: 'Paid',
        totalAmount: 45000,
        employeesCount: 15,
        date: new Date(2024, 0, 31)
    }
  ]);
  public payrollRuns$ = this._payrollRuns.asObservable();

  constructor(private mockDataService: MockDataService) {
    this.loadEmployees();
  }

  private loadEmployees() {
    this.mockDataService.getEmployees().subscribe(employees => {
      this._employees.next(employees);
    });
  }

  addPayrollRun(run: PayrollRun) {
      const current = this._payrollRuns.value;
      this._payrollRuns.next([run, ...current]);
  }

  updatePayrollStatus(id: string, status: 'Draft' | 'Approved' | 'Paid') {
      const current = this._payrollRuns.value;
      const index = current.findIndex(r => r.id === id);
      if (index !== -1) {
          current[index].status = status;
          this._payrollRuns.next([...current]);
      }
  }
}
