import {
  Directive,
  Inject,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface NgxFullscreenTransition {
  isFullscreen: boolean;
  element: Element | null;
}

@Directive({
  selector: '[ngxFullscreen]',
  exportAs: 'ngxFullscreen',
})
export class NgxFullscreenDirective {
  private element!: Element;

  @HostBinding('class.is-fullscreen')
  get isFullscreen(): boolean {
    return this.doc.fullscreenElement !== null;
  }

  @Input()
  set ngxFullscreen(element: Element | string) {
    if (element instanceof Element) {
      this.element = element;
    } else if (element === '') {
      this.element = this.doc.documentElement;
    } else {
      throw new Error(
        `Only type Element or string allowed, got "${typeof element}".`
      );
    }
  }

  @Output()
  transition = new EventEmitter<NgxFullscreenTransition>();

  @Output()
  errors = new EventEmitter<string>();

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  ngOnInit() {
    this.doc.addEventListener('fullscreenchange', () => {
      const isFullscreen = this.isFullscreen;
      const element = this.doc.fullscreenElement;
      this.transition.emit({ isFullscreen, element });
    });
  }

  toggle(element?: Element) {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.enter(element);
    }
  }

  async enter(element?: Element) {
    if (!this.isFullscreen) {
      try {
        await (element || this.element).requestFullscreen();
      } catch (e: any) {
        this.errors.emit(`${e.message} (${e.name})`);
      }
    }
  }

  async exit() {
    if (this.isFullscreen) {
      try {
        await this.doc.exitFullscreen();
      } catch (e: any) {
        this.errors.emit(`${e.message} (${e.name})`);
      }
    }
  }
}
