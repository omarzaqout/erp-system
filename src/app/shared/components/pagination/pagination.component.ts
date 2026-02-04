import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <nav *ngIf="totalPages > 1" aria-label="Page navigation">
      <ul class="pagination justify-content-center mb-0">
        <li class="page-item" [class.disabled]="currentPage === 1">
          <a class="page-link" (click)="onPageChange(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        
        <li class="page-item" 
            *ngFor="let page of visiblePages" 
            [class.active]="page === currentPage"
            [class.disabled]="page === -1">
          <a class="page-link" (click)="page !== -1 && onPageChange(page)">
            {{ page === -1 ? '...' : page }}
          </a>
        </li>
        
        <li class="page-item" [class.disabled]="currentPage === totalPages">
          <a class="page-link" (click)="onPageChange(currentPage + 1)" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    
    <div class="text-center mt-2 text-muted small" *ngIf="showInfo">
      {{ 'Showing' | translate }} {{ startItem }} {{ 'to' | translate }} {{ endItem }} {{ 'of' | translate }} {{ totalItems }} {{ 'entries' | translate }}
    </div>
  `,
  styles: [`
    .pagination {
      gap: 0.25rem;
    }
    
    .page-item {
      .page-link {
        border: none;
        border-radius: 8px;
        color: var(--text-dark);
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          background-color: var(--light-blue);
          color: var(--primary-blue);
        }
      }
      
      &.active .page-link {
        background-color: var(--primary-blue);
        color: white;
      }
      
      &.disabled .page-link {
        color: var(--text-light);
        cursor: not-allowed;
        background-color: transparent;
      }
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalItems: number = 0;
  @Input() showInfo: boolean = true;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, -1, total - 1, total);
      } else if (current >= total - 2) {
        pages.push(1, 2, -1, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }
    
    return pages;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
