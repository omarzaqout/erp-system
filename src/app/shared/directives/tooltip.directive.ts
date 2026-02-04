import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  
  private tooltipElement: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltipText) return;
    this.showTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hideTooltip();
  }

  private showTooltip() {
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.addClass(this.tooltipElement, `tooltip-${this.tooltipPosition}`);
    this.renderer.setProperty(this.tooltipElement, 'textContent', this.tooltipText);
    
    this.renderer.appendChild(document.body, this.tooltipElement);
    
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    if (!this.tooltipElement) return;
    const tooltipPos = this.tooltipElement.getBoundingClientRect();
    
    let top = 0;
    let left = 0;
    
    switch (this.tooltipPosition) {
      case 'top':
        top = hostPos.top - tooltipPos.height - 8;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'bottom':
        top = hostPos.bottom + 8;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'left':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.left - tooltipPos.width - 8;
        break;
      case 'right':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.right + 8;
        break;
    }
    
    this.renderer.setStyle(this.tooltipElement, 'top', `${top + window.scrollY}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left + window.scrollX}px`);
    this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
  }

  private hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
