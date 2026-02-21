import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tab } from '../../../services/tab.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
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
