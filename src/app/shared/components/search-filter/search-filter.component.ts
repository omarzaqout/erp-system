import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
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
