import { Component, OnInit } from '@angular/core';
import { MockDataService, Lead } from '../../../core/services/mock-data.service';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-leads',
  template: `
    <div class="leads-page">
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="card">
        <div class="card-body p-0">
          <app-data-table
            [columns]="columns"
            [data]="filteredLeads"
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
  styles: [`
    .leads-page {
      .card {
        margin-bottom: 1rem;
      }
    }
  `]
})
export class LeadsComponent implements OnInit {
  leads: Lead[] = [];
  filteredLeads: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  columns: TableColumn[] = [
    { key: 'name', label: 'Lead Name', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'source', label: 'Source', sortable: true },
    { key: 'value', label: 'Value', type: 'currency', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'assignedTo', label: 'Assigned To', sortable: true },
    { key: 'actions', label: 'Actions', type: 'actions' }
  ];

  constructor(private mockDataService: MockDataService) { }

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.mockDataService.getLeads().subscribe(leads => {
      this.leads = leads;
      this.filteredLeads = leads.map(l => ({
        ...l,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
      this.totalItems = leads.length;
    });
  }

  onSearch(query: string) {
    if (!query) {
      this.loadLeads();
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    this.filteredLeads = this.leads
      .filter(l => 
        l.name.toLowerCase().includes(lowerQuery) ||
        l.company.toLowerCase().includes(lowerQuery) ||
        l.source.toLowerCase().includes(lowerQuery)
      )
      .map(l => ({
        ...l,
        actions: [
          { key: 'view', label: 'View', icon: 'fas fa-eye', class: 'btn-info' },
          { key: 'edit', label: 'Edit', icon: 'fas fa-edit', class: 'btn-primary' }
        ]
      }));
    this.totalItems = this.filteredLeads.length;
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    console.log('Add new lead');
  }

  onRowClick(lead: Lead) {
    console.log('Lead clicked:', lead);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
