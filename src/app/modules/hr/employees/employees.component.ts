import { Component, OnInit } from '@angular/core';
import { MockDataService, Employee } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-employees',
  template: `
    <div class="employees-page">
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="card">
        <div class="card-body p-0">
          <app-data-table
            [columns]="columns"
            [data]="filteredEmployees"
            (rowClick)="onRowClick($event)">
          </app-data-table>
        </div>
      </div>
      
      <app-pagination
        [currentPage]="currentPage"
        [pageSize]="pageSize"
        [totalItems]="totalItems"
        (pageChange)="onPageChange($event)">
      </app-pagination>
    </div>
  `,
  styles: [``]
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  columns: TableColumn[] = [
    { key: 'employeeId', label: 'Employee ID', sortable: true },
    { key: 'firstName', label: 'First Name', sortable: true },
    { key: 'lastName', label: 'Last Name', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'position', label: 'Position', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.mockDataService.getEmployees().subscribe(employees => {
      this.employees = employees;
      this.filteredEmployees = employees.map(e => ({
        ...e,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
      this.totalItems = employees.length;
    });
  }

  onSearch(query: string) {
    if (!query) {
      this.loadEmployees();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this.filteredEmployees = this.employees
      .filter(e => 
        e.firstName.toLowerCase().includes(lowerQuery) ||
        e.lastName.toLowerCase().includes(lowerQuery) ||
        e.email.toLowerCase().includes(lowerQuery) ||
        e.department.toLowerCase().includes(lowerQuery) ||
        e.position.toLowerCase().includes(lowerQuery)
      )
      .map(e => ({
        ...e,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
    this.totalItems = this.filteredEmployees.length;
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    console.log('Add new employee');
  }

  onRowClick(employee: Employee) {
    console.log('Employee clicked:', employee);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
