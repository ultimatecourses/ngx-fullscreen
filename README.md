<h1 align="center">
📺 @ultimate/ngx-fullscreen
</h1>
<h4 align="center">
  <img width="25" valign="middle" src="https://angular.io/assets/images/logos/angular/angular.svg">
  Angular Directive that implements the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API">Fullscreen API</a>.
</h4>

---

<a href="https://ultimatecourses.com/courses/angular" target="_blank">
  <img src="https://ultimatecourses.com/static/banners/ultimate-angular-leader.svg">
</a>

---

## Installation

Install via `npm i @ultimate/ngx-fullscreen` and register the `NgxFullscreenModule` into an `@NgModule`.

## Live Demo

Check the [StackBlitz demo](https://ultimate-ngx-fullscreen.stackblitz.io) and the [example code](https://stackblitz.com/edit/ultimate-ngx-fullscreen?file=src%2Fapp%2Fapp.component.ts).

## Template API

`NgxFullscreenDirective` can be used in both template and component (when queried with `@ViewChild`).

### ✨ Document or Elements

*Entire Document:* To fullscreen the `document` just add `ngxFullscreen` into a component template. Internally this uses the `document.documentElement` to enter fullscreen:

```html
<!-- Registers the whole Document -->
<div ngxFullscreen></div>
```

*Elements:* Create a Template Ref, e.g. `#video` for the element you wish to fullscreen and pass it into `[ngxFullscreen]`:

```html
<!-- Registers just this Element -->
<video 
  src="trailer.mp4" 
  #video
  [ngxFullscreen]="video"
></video>
```

### ✨ Enter Fullscreen Mode

Export the `ngxFullscreen` directive to a Template Ref, e.g. `#fullscreen` and call `enter()`:

```html
<video 
  src="trailer.mp4" 
  #video
  [ngxFullscreen]="video"
  #fullscreen="ngxFullscreen"
></video>

<button (click)="fullscreen.enter()">
  Enter Fullscreen
</button>
```

The `enter()` method also accepts an optional `Element` to pass a dynamic element.

### ✨ Exit Fullscreen Mode

Use the `exit()` method to exit fullscreen mode:

```html
<video 
  src="trailer.mp4" 
  #video
  [ngxFullscreen]="video"
  #fullscreen="ngxFullscreen"
></video>

<button (click)="fullscreen.exit()">
  Exit Fullscreen
</button>
```

### ✨ Toggle Fullscreen Mode

Use the `toggle()` method to toggle fullscreen mode:

```html
<video 
  src="trailer.mp4" 
  #video
  [ngxFullscreen]="video"
  #fullscreen="ngxFullscreen"
></video>

<button (click)="fullscreen.toggle()">
  Toggle Fullscreen
</button>
```

The `toggle()` method also accepts an optional `Element` to pass a dynamic element.

### ✨ Transition Event

Fires entering and exiting fullscreen mode, using the `fullscreenchange` event behind-the-scenes:

```html
<video 
  src="trailer.mp4" 
  #video
  [ngxFullscreen]="video"
  #fullscreen="ngxFullscreen"
  (transition)="onTransition($event)"
></video>
```

The `$event` is of type `NgxFullscreenTransition`, contains the fullscreen status and element that is/was fullscreened.

### ✨ isFullscreen property

Check if fullscreen mode is active via `fullscreen.isFullscreen`. Returns `true` or `false`.

```html
<video 
  src="trailer.mp4" 
  #video
  [ngxFullscreen]="video"
  #fullscreen="ngxFullscreen"
></video>

Fullscreen Mode: {{ fullscreen.isFullscreen ? 'Active' : 'Inactive' }}
```

### ✨ Active Class

The fullscreen element will receive an active class `is-fullscreen` via a `@HostBinding`.

## @ViewChild and Component API

The `NgxFullscreenDirective` is exposed when queried with `@ViewChild`, any public methods and properties are also accessible.

### ✨ Query with @ViewChild

Use a `@ViewChild` query and call any property as you would inside the template.

```ts
import {
  NgxFullscreenDirective, 
  NgxFullscreenTransition
} from '@ultimate/ngx-fullscreen';

@Component({...})
export class AppComponent implements AfterViewInit {
  @ViewChild('fullscreen') fullscreen!: NgxFullscreenDirective;

  onClick() {
    this.fullscreen.toggle();
  }

  enterFullscreen() {
    this.fullscreen.enter();
  }

  exitFullscreen() {
    this.fullscreen.exit();
  }

  ngAfterViewInit() {
    this.fullscreen.transition
      .subscribe((change: NgxFullscreenTransition) => {
        console.log(change); // { isFullscreen: boolean, element: Element }
      });
  }
}
```

### ✨ Errors

[Fullscreen errors](https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenerror_event) are caught when entering and exiting and are passed from the directive via an `errors` event:

```ts
@Component({...})
export class AppComponent implements AfterViewInit {
  @ViewChild('fullscreen') fullscreen!: NgxFullscreenDirective;

  ngAfterViewInit() {
    this.fullscreen.errors.subscribe((err: string) => {
      // e.g. "Failed to execute 'requestFullscreen' on 'Element'"
      console.log(err);
    });
  }
}
```

### ⚠ Browser Permissions

Due to the [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API), you cannot invoke Fullscreen mode unless it is from a user action, such as a click event.

This means you cannot load a page and behind the scenes invoke a successful Fullscreen request. This is a common source of errors so keep that in mind.

