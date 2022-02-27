import {
  Directive,
  Inject,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * The shape of the Event passed to the parent component
 * upon each fullscreen enter/exit transition
 */
export interface NgxFullscreenTransition {
  isFullscreen: boolean;
  element: Element | null;
}

@Directive({
  selector: '[ngxFullscreen]',
  exportAs: 'ngxFullscreen',
})
export class NgxFullscreenDirective {
  /**
   * The Element to go fullscreen
   */
  private element!: Element;

  /**
   * Returns whether an Element is currently fullscreen
   * Also add a HostBinding to the Element
   */
  @HostBinding('class.is-fullscreen')
  get isFullscreen(): boolean {
    return this.doc.fullscreenElement !== null;
  }

  /**
   * Register the event listener for `fullscreenchange`
   * and emit the fullscreen state and element up
   */
  @HostListener('document:fullscreenchange')
  private onTransition() {
    const isFullscreen = this.isFullscreen;
    const element = this.doc.fullscreenElement;
    this.transition.emit({ isFullscreen, element });
  }

  /**
   * Accepts an Element or string type
   *
   * Element:
   * <video [ngxFullscreen]="ref"></video>
   *
   * String (as it is implicitly passed by just declaring
   * an empty attribute):
   * <div ngxFullscreen></div>
   */
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

  /**
   * Each transition is captured and emitted as NgxFullscreenTransition
   * You can import this type inside your component
   */
  @Output()
  transition = new EventEmitter<NgxFullscreenTransition>();

  /**
   * Pass each error up to the parent as a string
   * Instead of using the `fullscreenerror` event we're
   * using a try/catch and emitting on error
   */
  @Output()
  errors = new EventEmitter<string>();

  /**
   * Pass the Document object so we can default to this if needed
   * Either way, we'll use this for our `fullscreenchange` event
   */
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  /**
   * Accept an optional Element to enter fullscreen mode
   * Either use this element or the registered `this.element`
   */
  async enter(element?: Element) {
    if (!this.isFullscreen) {
      try {
        await (element || this.element).requestFullscreen();
      } catch (e: any) {
        this.errors.emit(`${e.message} (${e.name})`);
      }
    }
  }

  /**
   * Exit via the document.exitFullscreen() method, it doesn't
   * matter what Element we have chosen to be fullscreen, the
   * way to exit is the same
   */
  async exit() {
    if (this.isFullscreen) {
      try {
        await this.doc.exitFullscreen();
      } catch (e: any) {
        this.errors.emit(`${e.message} (${e.name})`);
      }
    }
  }

  /**
   * Simple toggle method to switch between fullscreen mode"
   */
  toggle(element?: Element) {
    if (this.isFullscreen) {
      this.exit();
    } else {
      this.enter(element);
    }
  }
}
