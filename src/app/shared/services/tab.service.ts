import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

export interface Tab {
  id: string;
  title: string;
  route: string;
  icon?: string;
  pinned: boolean;
  closable: boolean;
  component?: any;
  data?: any;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabState = new BehaviorSubject<TabState>({
    tabs: [],
    activeTabId: null
  });

  public tabState$: Observable<TabState> = this.tabState.asObservable();

  constructor(private router: Router) {
    // Listen to route changes to update active tab
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveTab(event.url);
      }
    });
  }

  openTab(tab: Omit<Tab, 'id' | 'pinned' | 'closable'> & { pinned?: boolean; closable?: boolean }): string {
    const tabId = this.generateTabId();
    const newTab: Tab = {
      id: tabId,
      pinned: tab.pinned || false,
      closable: tab.closable !== false,
      ...tab
    };

    const currentState = this.tabState.value;
    const existingTab = currentState.tabs.find(t => t.route === tab.route && !t.pinned);

    if (existingTab && !existingTab.pinned) {
      // If tab with same route exists and not pinned, activate it
      this.setActiveTab(existingTab.id);
      return existingTab.id;
    }

    const newState: TabState = {
      tabs: [...currentState.tabs, newTab],
      activeTabId: tabId
    };

    this.tabState.next(newState);
    this.router.navigate([tab.route]);
    
    return tabId;
  }

  closeTab(tabId: string): void {
    const currentState = this.tabState.value;
    const tabIndex = currentState.tabs.findIndex(t => t.id === tabId);
    
    if (tabIndex === -1) return;

    const tab = currentState.tabs[tabIndex];
    
    // Don't close pinned tabs
    if (tab.pinned) return;

    const newTabs = currentState.tabs.filter(t => t.id !== tabId);
    
    // If closing active tab, activate another tab
    let newActiveTabId = currentState.activeTabId;
    if (currentState.activeTabId === tabId) {
      if (newTabs.length > 0) {
        // Activate the next tab, or previous if closing last tab
        const nextIndex = tabIndex < newTabs.length ? tabIndex : tabIndex - 1;
        newActiveTabId = newTabs[nextIndex]?.id || null;
      } else {
        newActiveTabId = null;
      }
    }

    const newState: TabState = {
      tabs: newTabs,
      activeTabId: newActiveTabId
    };

    this.tabState.next(newState);

    // Navigate to active tab or home
    if (newActiveTabId) {
      const activeTab = newTabs.find(t => t.id === newActiveTabId);
      if (activeTab) {
        this.router.navigate([activeTab.route]);
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  pinTab(tabId: string): void {
    const currentState = this.tabState.value;
    const newTabs = currentState.tabs.map(tab => 
      tab.id === tabId ? { ...tab, pinned: true } : tab
    );

    this.tabState.next({
      ...currentState,
      tabs: newTabs
    });
  }

  unpinTab(tabId: string): void {
    const currentState = this.tabState.value;
    const newTabs = currentState.tabs.map(tab => 
      tab.id === tabId ? { ...tab, pinned: false } : tab
    );

    this.tabState.next({
      ...currentState,
      tabs: newTabs
    });
  }

  setActiveTab(tabId: string): void {
    const currentState = this.tabState.value;
    const tab = currentState.tabs.find(t => t.id === tabId);
    
    if (tab) {
      this.tabState.next({
        ...currentState,
        activeTabId: tabId
      });
      this.router.navigate([tab.route]);
    }
  }

  closeAllTabs(): void {
    const currentState = this.tabState.value;
    const pinnedTabs = currentState.tabs.filter(t => t.pinned);
    
    this.tabState.next({
      tabs: pinnedTabs,
      activeTabId: pinnedTabs.length > 0 ? pinnedTabs[0].id : null
    });

    if (pinnedTabs.length > 0) {
      this.router.navigate([pinnedTabs[0].route]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  closeOtherTabs(tabId: string): void {
    const currentState = this.tabState.value;
    const tab = currentState.tabs.find(t => t.id === tabId);
    
    if (!tab) return;

    const newTabs = currentState.tabs.filter(t => t.id === tabId || t.pinned);
    
    this.tabState.next({
      tabs: newTabs,
      activeTabId: tabId
    });

    this.router.navigate([tab.route]);
  }

  private updateActiveTab(url: string): void {
    const currentState = this.tabState.value;
    const activeTab = currentState.tabs.find(t => url.startsWith(t.route));
    
    if (activeTab && activeTab.id !== currentState.activeTabId) {
      this.tabState.next({
        ...currentState,
        activeTabId: activeTab.id
      });
    }
  }

  private generateTabId(): string {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getTabs(): Tab[] {
    return this.tabState.value.tabs;
  }

  getActiveTabId(): string | null {
    return this.tabState.value.activeTabId;
  }
}
