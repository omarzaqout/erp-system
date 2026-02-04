import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  template: `
    <div class="search-filter">
      <div class="input-group">
        <span class="input-group-text bg-white border-end-0">
          <i class="fas fa-search text-muted"></i>
        </span>
        <input 
          type="text" 
          class="form-control border-start-0" 
          [placeholder]="'Search' | translate"
          [(ngModel)]="searchTerm"
          (input)="onSearch()"
        >
      </div>
      
      <button 
        class="btn btn-outline-secondary filter-btn" 
        type="button"
        (click)="toggleFilters()"
        [class.active]="showFilters">
        <i class="fas fa-filter"></i>
        {{ 'Filters' | translate }}
      </button>
      
      <button 
        class="btn btn-primary" 
        type="button"
        (click)="onAddNew()">
        <i class="fas fa-plus"></i>
        {{ 'Add New' | translate }}
      </button>
    </div>
    
    <div class="filter-panel" *ngIf="showFilters" @slideDown>
      <div class="card">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">{{ 'Status' | translate }}</label>
              <select class="form-select" [(ngModel)]="filters.status" (change)="onFilterChange()">
                <option value="">{{ 'All Status' | translate }}</option>
                <option value="active">{{ 'Active' | translate }}</option>
                <option value="inactive">{{ 'Inactive' | translate }}</option>
                <option value="pending">{{ 'Pending' | translate }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">{{ 'Date From' | translate }}</label>
              <input type="date" class="form-control" [(ngModel)]="filters.dateFrom" (change)="onFilterChange()">
            </div>
            <div class="col-md-3">
              <label class="form-label">{{ 'Date To' | translate }}</label>
              <input type="date" class="form-control" [(ngModel)]="filters.dateTo" (change)="onFilterChange()">
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button class="btn btn-outline-secondary w-100" (click)="clearFilters()">
                <i class="fas fa-times"></i>
                {{ 'Clear Filters' | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-filter {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
      
      .input-group {
        flex: 1;
        max-width: 400px;
      }
      
      .form-control:focus {
        box-shadow: none;
      }
      
      .filter-btn {
        &.active {
          background-color: var(--primary-blue);
          color: white;
          border-color: var(--primary-blue);
        }
      }
    }
    
    .filter-panel {
      margin-bottom: 1rem;
      
      .card {
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  `]
})
export class SearchFilterComponent {
  @Output() search = new EventEmitter<string>();
  @Output() filter = new EventEmitter<any>();
  @Output() addNew = new EventEmitter<void>();

  searchTerm: string = '';
  showFilters: boolean = false;
  filters = {
    status: '',
    dateFrom: '',
    dateTo: ''
  };

  onSearch() {
    this.search.emit(this.searchTerm);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  onFilterChange() {
    this.filter.emit({ ...this.filters });
  }

  clearFilters() {
    this.filters = {
      status: '',
      dateFrom: '',
      dateTo: ''
    };
    this.onFilterChange();
  }

  onAddNew() {
    this.addNew.emit();
  }
}
