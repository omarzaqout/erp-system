import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-widget',
  template: `
    <div class="card chart-widget">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">{{ title }}</h5>
        <div class="chart-actions" *ngIf="showActions">
          <button class="btn btn-sm btn-outline-secondary" (click)="refresh()">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="chart-container">
          <canvas [id]="chartId"></canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-widget {
      height: 100%;
      
      .card-header {
        background: transparent;
        border-bottom: 1px solid var(--border);
        padding: 1rem 1.25rem;
        
        h5 {
          font-size: 1rem;
          font-weight: 600;
        }
      }
      
      .card-body {
        padding: 1.25rem;
      }
      
      .chart-container {
        position: relative;
        height: 300px;
        width: 100%;
      }
    }
  `]
})
export class ChartWidgetComponent implements OnInit {
  @Input() title: string = '';
  @Input() chartId: string = 'chart-' + Math.random().toString(36).substr(2, 9);
  @Input() showActions: boolean = true;

  ngOnInit() {
    // Chart initialization would go here with Chart.js
    // For now, this is a placeholder component
  }

  refresh() {
    // Refresh chart data
  }
}
