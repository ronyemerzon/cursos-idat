import { Directive, ElementRef, HostListener, Renderer2, inject, Input } from '@angular/core';

@Directive({
  selector: '[appHoverCard]',
  standalone: true
})
export class HoverCardDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input() translateY: string = '-4px';
  @Input() shadowClass: string = 'hover-shadow';

  constructor() {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', `translateY(${this.translateY})`);
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 12px 24px -6px rgba(0, 0, 0, 0.12), 0 4px 8px -4px rgba(0, 0, 0, 0.06)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
  }
}
