import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TabService, Tab } from '../../../services/tab.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs-container',
  template: `
    <div class="tabs-container" *ngIf="tabs.length > 0">
      <div class="tabs-scroll-wrapper">
        <div class="tabs-list">
          <app-tab
            *ngFor="let tab of tabs"
            [tab]="tab"
            [isActive]="activeTabId === tab.id"
            (tabClick)="onTabClick($event)"
            (tabClose)="onTabClose($event)"
            (tabPin)="onTabPin($event)"
            (tabRightClick)="onTabRightClick($event)">
          </app-tab>
        </div>
      </div>
      
      <div class="tabs-actions" *ngIf="tabs.length > 1">
        <button 
          class="tabs-action-btn"
          (click)="closeAll()"
          title="Close All Tabs">
          <i class="fas fa-times-circle"></i>
        </button>
      </div>
    </div>
    
    <!-- Context Menu -->
    <div 
      class="context-menu"
      *ngIf="showContextMenu"
      [style.left.px]="contextMenuX"
      [style.top.px]="contextMenuY">
      <div class="context-menu-item" (click)="closeTab(contextMenuTabId)">
        <i class="fas fa-times"></i>
        <span>Close</span>
      </div>
      <div class="context-menu-item" (click)="closeOtherTabs(contextMenuTabId)">
        <i class="fas fa-times-circle"></i>
        <span>Close Others</span>
      </div>
      <div class="context-menu-item" (click)="closeAllTabs()">
        <i class="fas fa-window-close"></i>
        <span>Close All</span>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" (click)="togglePin(contextMenuTabId)">
        <i [class]="getTab(contextMenuTabId)?.pinned ? 'fas fa-thumbtack' : 'far fa-thumbtack'"></i>
        <span>{{ getTab(contextMenuTabId)?.pinned ? 'Unpin' : 'Pin' }}</span>
      </div>
    </div>
    
    <div 
      class="context-menu-overlay"
      *ngIf="showContextMenu"
      (click)="hideContextMenu()">
    </div>
  `,
  styles: [`
    .tabs-container {
      display: flex;
      align-items: flex-end;
      background: var(--background);
      border-bottom: 1px solid var(--border);
      padding: 0.5rem 1rem 0 1rem;
      gap: 0.5rem;
      overflow-x: auto;
      overflow-y: hidden;
      
      &::-webkit-scrollbar {
        height: 4px;
      }
      
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      
      &::-webkit-scrollbar-thumb {
        background: var(--border);
        border-radius: 2px;
        
        &:hover {
          background: var(--text-light);
        }
      }
    }
    
    .tabs-scroll-wrapper {
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
    }
    
    .tabs-list {
      display: flex;
      align-items: flex-end;
      gap: 0.25rem;
      min-width: min-content;
    }
    
    .tabs-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
      padding-bottom: 0.5rem;
    }
    
    .tabs-action-btn {
      background: var(--light-blue);
      border: 1px solid var(--border);
      border-radius: 6px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-light);
      transition: all 0.2s;
      
      &:hover {
        background: var(--primary-blue);
        color: white;
        border-color: var(--primary-blue);
      }
    }
    
    .context-menu {
      position: fixed;
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      min-width: 180px;
      padding: 0.5rem;
      
      .context-menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 0.875rem;
        cursor: pointer;
        border-radius: 6px;
        color: var(--text-dark);
        font-size: 0.875rem;
        transition: background-color 0.2s;
        
        i {
          width: 16px;
          color: var(--text-light);
        }
        
        &:hover {
          background: var(--light-blue);
          
          i {
            color: var(--primary-blue);
          }
        }
      }
      
      .context-menu-divider {
        height: 1px;
        background: var(--border);
        margin: 0.5rem 0;
      }
    }
    
    .context-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
    }
  `]
})
export class TabsContainerComponent implements OnInit, OnDestroy {
  tabs: Tab[] = [];
  activeTabId: string | null = null;
  showContextMenu: boolean = false;
  contextMenuX: number = 0;
  contextMenuY: number = 0;
  contextMenuTabId: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private tabService: TabService,
    private router: Router
  ) {}

  ngOnInit() {
    this.tabService.tabState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.tabs = state.tabs;
        this.activeTabId = state.activeTabId;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabClick(tabId: string) {
    this.tabService.setActiveTab(tabId);
  }

  onTabClose(tabId: string) {
    this.tabService.closeTab(tabId);
  }

  onTabPin(tabId: string) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      if (tab.pinned) {
        this.tabService.unpinTab(tabId);
      } else {
        this.tabService.pinTab(tabId);
      }
    }
  }

  onTabRightClick(data: {event: MouseEvent, tabId: string}) {
    this.contextMenuX = data.event.clientX;
    this.contextMenuY = data.event.clientY;
    this.contextMenuTabId = data.tabId;
    this.showContextMenu = true;
  }

  hideContextMenu() {
    this.showContextMenu = false;
  }

  closeTab(tabId: string) {
    this.tabService.closeTab(tabId);
    this.hideContextMenu();
  }

  closeOtherTabs(tabId: string) {
    this.tabService.closeOtherTabs(tabId);
    this.hideContextMenu();
  }

  closeAllTabs() {
    this.tabService.closeAllTabs();
    this.hideContextMenu();
  }

  togglePin(tabId: string) {
    this.onTabPin(tabId);
    this.hideContextMenu();
  }

  closeAll() {
    this.tabService.closeAllTabs();
  }

  getTab(tabId: string): Tab | undefined {
    return this.tabs.find(t => t.id === tabId);
  }
}
