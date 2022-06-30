# NgxBackForwardCache

[![NPM](https://img.shields.io/npm/v/ngx-back-forward-cache?label=NPM&color=blue)](https://www.npmjs.com/package/ngx-back-forward-cache "View this project on NPM.") [![NPM downloads](https://img.shields.io/npm/dt/ngx-back-forward-cache?label=NPM%20downloads)](https://www.npmjs.com/package/ngx-back-forward-cache "View this project on NPM.")

Simulate the [browser back-forward cache feature](https://web.dev/bfcache/) in Angular using a custom [Angular RouteReuseStrategy](https://angular.io/api/router/RouteReuseStrategy).

### Browser back-forward cache feature - Demo
[![back-forward cache feature on mobile](https://img.youtube.com/vi/cuPsdRckkF0/0.jpg)](https://www.youtube.com/watch?v=cuPsdRckkF0 "Browser back-forward cache feature - Demo")

## Installation
```sh
npm install ngx-back-forward-cache --save
```

## Usage
### Import the `NgxBackForwardCacheModule` to your root module.
**app.module.ts**
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import NgxBackForwardCacheModule
import { NgxBackForwardCacheModule } from 'ngx-back-forward-cache';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBackForwardCacheModule.forRoot() // Import NgxBackForwardCacheModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Optional. You can specify for each route individually if ngx-back-forward-cache is disabled or not.
**app-routing.module.ts**
```ts
const routes: Routes = [
  ...
  {
    path: 'some-route',
    component: SomeComponent,
    data: {
      disableNgxBackForwardCache: false
    },
  },
  ...
];
```
PS: You can define globally if ngx-back-forward-cache is disabled or not for all routes per default using the NgxBackForwardCacheConfig (e.g. `NgxBackForwardCacheModule.forRoot({ disableNgxBackForwardCache: false })`).

## Documentation
### NgxBackForwardCacheModule class
```ts
class NgxBackForwardCacheModule {
    static forRoot(config?: NgxBackForwardCacheConfig);
}
```

### NgxBackForwardCacheConfig interface
```ts
interface NgxBackForwardCacheConfig {
  /**
   * Maximum number of cached pages.
   * When the maximum number of cached pages is reached the oldest cached page is removed.
   * 
   * @default
   * undefined // Meaning no limit.
   */
  maximumNumberOfCachedPages?: number;

  /**
   * Define globally if ngx-back-forward-cache is disabled or not for all routes per default.
   * 
   * 
   * PS: You can specify for each route individually if ngx-back-forward-cache is disabled or not.
   * 
   * @example
   * const routes: Routes = [
   * ...
   * {
   *  path: 'some-route',
   *  component: SomeComponent,
   *  data: {
   *    disableNgxBackForwardCache: true
   *  }
   * }
   * ...
   * ];
   * 
   * @default
   * false
   */
  disableNgxBackForwardCache?: boolean;
}
```

## Pro tip!
Use [ngx-scroll-position-restoration](https://www.npmjs.com/package/ngx-scroll-position-restoration "View this project on NPM.") to restore the scroll-position of any scrollable elements after the page has been restored using NgxBackForwardCache (user clicked on the back- or forward button).

## License
MIT
