import { Component, OnInit } from '@angular/core';
import { Warehouse } from '../../../core/services/mock-data.service';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-warehouses',
  template: `
    <div class="warehouses-page">
      <app-search-filter
        (search)="onSearch($event)"
        (filter)="onFilter($event)"
        (addNew)="onAddNew()">
      </app-search-filter>
      
      <div class="row g-4">
        <div class="col-md-6 col-lg-4" *ngFor="let warehouse of warehouses">
          <div class="card warehouse-card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="card-title mb-1">{{ warehouse.name | translate }}</h5>
                  <span class="badge" [ngClass]="warehouse.status | statusBadge">
                    {{ warehouse.status | translate }}
                  </span>
                </div>
                <div class="warehouse-code">{{ warehouse.code }}</div>
              </div>
              
              <div class="warehouse-info mb-3">
                <p><i class="fas fa-map-marker-alt"></i> {{ warehouse.address | translate }}</p>
                <p><i class="fas fa-user"></i> {{ warehouse.manager | translate }}</p>
                <p><i class="fas fa-phone"></i> {{ warehouse.phone }}</p>
              </div>
              
              <div class="capacity-bar">
                <div class="d-flex justify-content-between mb-1">
                  <span>{{ 'Capacity' | translate }}</span>
                  <span>{{ getCapacityPercentage(warehouse) }}%</span>
                </div>
                <div class="progress">
                  <div class="progress-bar" 
                       [style.width.%]="getCapacityPercentage(warehouse)"
                       [ngClass]="getCapacityClass(warehouse)">
                  </div>
                </div>
                <small class="text-muted">
                  {{ warehouse.usedCapacity | number }} / {{ warehouse.capacity | number }} {{ 'units' | translate }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .warehouses-page {
      .warehouse-card {
        height: 100%;
        transition: transform 0.2s;
        &:hover {
          transform: translateY(-5px);
        }
        
        .warehouse-code {
          background: var(--light-blue);
          color: var(--primary-blue);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .warehouse-info {
          p {
            margin-bottom: 0.5rem;
            color: var(--text-light);
            font-size: 0.875rem;
            
            i {
              width: 20px;
              color: var(--primary-blue);
            }
          }
        }
        
        .capacity-bar {
          .progress {
            height: 8px;
            border-radius: 4px;
            background-color: #f0f2f5;
          }
        }
      }
    }
  `]
})
export class WarehousesComponent implements OnInit {
  warehouses: Warehouse[] = [];

  constructor(private inventoryService: InventoryService) { }

  ngOnInit() {
    this.loadWarehouses();
  }

  loadWarehouses() {
    this.inventoryService.warehouses$.subscribe(warehouses => {
      this.warehouses = warehouses;
    });
  }

  getCapacityPercentage(warehouse: Warehouse): number {
    return Math.round((warehouse.usedCapacity / warehouse.capacity) * 100);
  }

  getCapacityClass(warehouse: Warehouse): string {
    const percentage = this.getCapacityPercentage(warehouse);
    if (percentage >= 90) return 'bg-danger';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  }

  onSearch(query: string) {
    console.log('Search:', query);
    if (!query) {
        this.loadWarehouses();
        return;
    }
    const lowerQuery = query.toLowerCase();
    this.inventoryService.warehouses$.subscribe(all => {
        this.warehouses = all.filter(w => 
            w.name.toLowerCase().includes(lowerQuery) || 
            w.code.toLowerCase().includes(lowerQuery) ||
            w.address.toLowerCase().includes(lowerQuery)
        );
    }).unsubscribe();
  }

  onFilter(filters: any) {
    console.log('Filters:', filters);
  }

  onAddNew() {
    console.log('Add new warehouse');
  }
}
