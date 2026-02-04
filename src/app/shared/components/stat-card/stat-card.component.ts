import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() icon: string = '';
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() change?: number;
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';

  Math = Math;
}
