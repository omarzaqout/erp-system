import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tab } from '../../../services/tab.service';

@Component({
  selector: 'app-tab',
  template: `
    <div 
      class="tab-item"
      [class.active]="isActive"
      [class.pinned]="tab.pinned"
      (click)="onClick()"
      (contextmenu)="onRightClick($event)">
      <i *ngIf="tab.icon" [class]="tab.icon" class="tab-icon"></i>
      <span class="tab-title">{{ tab.title }}</span>
      <div class="tab-actions">
        <button 
          *ngIf="tab.closable"
          class="tab-action-btn"
          (click)="onClose($event)"
          [title]="tab.pinned ? 'Unpin and Close' : 'Close'">
          <i class="fas fa-times"></i>
        </button>
        <button 
          class="tab-action-btn"
          (click)="onPin($event)"
          [title]="tab.pinned ? 'Unpin' : 'Pin'">
          <i [class]="tab.pinned ? 'fas fa-thumbtack' : 'far fa-thumbtack'"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .tab-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: var(--background);
      border: 1px solid var(--border);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      min-width: 120px;
      max-width: 200px;
      user-select: none;
      
      &:hover {
        background: var(--light-blue);
        
        .tab-actions {
          opacity: 1;
        }
      }
      
      &.active {
        background: white;
        border-color: var(--primary-blue);
        border-bottom: 2px solid white;
        z-index: 10;
        margin-bottom: -1px;
        
        .tab-title {
          color: var(--primary-blue);
          font-weight: 600;
        }
      }
      
      &.pinned {
        border-left: 3px solid var(--warning-yellow);
        
        .tab-icon {
          color: var(--warning-yellow);
        }
      }
      
      .tab-icon {
        font-size: 0.875rem;
        color: var(--text-light);
        flex-shrink: 0;
      }
      
      .tab-title {
        flex: 1;
        font-size: 0.875rem;
        color: var(--text-dark);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .tab-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        opacity: 0;
        transition: opacity 0.2s;
        flex-shrink: 0;
      }
      
      .tab-action-btn {
        background: none;
        border: none;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-light);
        font-size: 0.75rem;
        transition: all 0.2s;
        padding: 0;
        
        &:hover {
          background: rgba(0, 0, 0, 0.1);
          color: var(--text-dark);
        }
      }
    }
  `]
})
export class TabComponent {
  @Input() tab!: Tab;
  @Input() isActive: boolean = false;
  
  @Output() tabClick = new EventEmitter<string>();
  @Output() tabClose = new EventEmitter<string>();
  @Output() tabPin = new EventEmitter<string>();
  @Output() tabRightClick = new EventEmitter<{event: MouseEvent, tabId: string}>();

  onClick() {
    this.tabClick.emit(this.tab.id);
  }

  onClose(event: MouseEvent) {
    event.stopPropagation();
    this.tabClose.emit(this.tab.id);
  }

  onPin(event: MouseEvent) {
    event.stopPropagation();
    this.tabPin.emit(this.tab.id);
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.tabRightClick.emit({ event, tabId: this.tab.id });
  }
}
