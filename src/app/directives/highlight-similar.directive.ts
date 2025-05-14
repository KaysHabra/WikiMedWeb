import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightSimilar]',
  standalone: false
})
export class HighlightSimilarDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.toggleHighlight(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.toggleHighlight(false);
  }

  private toggleHighlight(add: boolean) {
    const element = this.el.nativeElement;
    const classList:any = Array.from(element.classList);
    const groupClass = classList.find(cls => cls.startsWith('appt-'));

    if (groupClass) {
      const elements = document.querySelectorAll(`.event-container.${groupClass}`);
      elements.forEach(el => {
        this.renderer.setStyle(
          el,
          'boxShadow',
          add ? '0px 0px 7px 1px rgba(100, 100, 100, 0.75)' : 'none'
        );
      });
    }
  }
}