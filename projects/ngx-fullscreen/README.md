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

## Document or Elements

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

## Enter Fullscreen Mode

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

## Exit Fullscreen Mode

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

## Toggle Fullscreen Mode

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

## isFullscreen property

Use the `fullscreen.isFullscreen` property to determine if fullscreen mode is active. Returns `true` or `false`.

## Active Class

The element you bind `ngxFullscreen` to will receive a class `is-fullscreen` when the element is fullscreen.

## Transition Events

Fires when entering and exiting fullscreen mode. Uses the browser `fullscreenchange` event.

Subscribe in the component via a `@ViewChild` decorator:

```ts
import {
  NgxFullscreenDirective, 
  NgxFullscreenTransition
} from '@ultimate/ngx-fullscreen';

@Component({...})
export class AppComponent implements AfterViewInit {
  @ViewChild('fullscreen') fullscreen!: NgxFullscreenDirective;

  ngAfterViewInit() {
    this.fullscreen.transition.subscribe((change: NgxFullscreenTransition) => {
      console.log(change); // { isFullscreen: boolean, element: Element }
    });
  }
}
```

## Errors

Any [Fullscreen errors](https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenerror_event) are caught when entering and exiting and are passed from the directive via an `errors` event:

```ts
@Component({...})
export class AppComponent implements AfterViewInit {
  @ViewChild('fullscreen') fullscreen!: NgxFullscreenDirective;

  ngAfterViewInit() {
    this.fullscreen.errors.subscribe((err: string) => {
      // Failed to execute 'requestFullscreen' on 'Element':
      // API can only be initiated by a user gesture.
      console.log(err);
    });
  }
}
```

## Browser Permissions

Due to browser permissions and user experience, you cannot invoke Fullscreen mode unless it is from a user action, such as a click event.
