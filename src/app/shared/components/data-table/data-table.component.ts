import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'currency' | 'date' | 'badge' | 'actions';
}

@Component({
  selector: 'app-data-table',
  template: `
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th *ngFor="let column of columns" 
                [class.sortable]="column.sortable"
                (click)="column.sortable && onSort(column.key)">
              {{ column.label | translate }}
              <i *ngIf="column.sortable" 
                 class="fas"
                 [class.fa-sort]="sortColumn !== column.key"
                 [class.fa-sort-up]="sortColumn === column.key && sortDirection === 'asc'"
                 [class.fa-sort-down]="sortColumn === column.key && sortDirection === 'desc'">
              </i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data" (click)="onRowClick(row)">
            <td *ngFor="let column of columns">
              <ng-container [ngSwitch]="column.type">
                <span *ngSwitchCase="'currency'">{{ row[column.key] | erpCurrency }}</span>
                <span *ngSwitchCase="'date'">{{ row[column.key] | erpDate }}</span>
                <span *ngSwitchCase="'badge'" 
                      class="badge"
                      [ngClass]="row[column.key] | statusBadge">
                  {{ row[column.key] | translate }}
                </span>
                <span *ngSwitchCase="'actions'">
                  <button *ngFor="let action of row.actions" 
                          class="btn btn-sm me-1"
                          [ngClass]="action.class"
                          (click)="$event.stopPropagation(); actionClick.emit({action: action.key, row: row})"
                          [appTooltip]="action.label | translate">
                    <i [class]="action.icon"></i>
                  </button>
                </span>
                <span *ngSwitchDefault>{{ row[column.key] }}</span>
              </ng-container>
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [attr.colspan]="columns.length" class="text-center py-4">
              <i class="fas fa-inbox fa-2x text-muted mb-2"></i>
              <p class="text-muted mb-0">{{ 'No data available' | translate }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table {
      margin-bottom: 0;
    }
    
    th {
      font-weight: 600;
      color: var(--text-dark);
      border-top: none;
      background-color: var(--background);
      white-space: nowrap;
    }
    
    th.sortable {
      cursor: pointer;
      user-select: none;
    }
    
    th.sortable:hover {
      background-color: var(--light-blue);
    }
    
    th .fas {
      margin-left: 0.5rem;
      color: var(--text-light);
      font-size: 0.75rem;
    }
    
    td {
      vertical-align: middle;
      color: var(--text-light);
    }
    
    tbody tr {
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    tbody tr:hover {
      background-color: var(--light-blue);
    }
    
    .badge {
      font-size: 0.75rem;
      padding: 0.4em 0.8em;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Output() sort = new EventEmitter<{column: string, direction: string}>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{action: string, row: any}>();

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sort.emit({ column, direction: this.sortDirection });
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }
}
