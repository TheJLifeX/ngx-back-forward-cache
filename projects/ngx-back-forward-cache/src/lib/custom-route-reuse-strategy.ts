import { Component, Inject, Injectable, Type } from '@angular/core';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle, ɵEmptyOutletComponent } from '@angular/router';
import { MemoryCacheMap } from 'memory-cache-map';

/**
 * We use ngx-navigation-trigger (that uses the Angular Location service) because when you use the Angular Router service like this:
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          // Do something here
        }
      }
    });
 * 
 * You get the following error: "Circular dependency in DI detected for Router"
 * Reason for the error: The Router service depends on RouteReuseStrategy.
 */
import { NavigationTrigger, NavigationTriggerService } from 'ngx-navigation-trigger';

import { NgxBackForwardCacheConfig } from './ngx-back-forward-cache-config';
import { NGX_BACK_FORWARD_CACHE_INJECTION_TOKEN } from './ngx-back-forward-cache-injection-token';

/**
 * Ngx-back-forward-cache CustomRouteReuseStrategy
 * 
 * Simulate the [browser back-forward cache feature](https://web.dev/bfcache/) in angular using a custom [Angular RouteReuseStrategy](https://angular.io/api/router/RouteReuseStrategy).
 *
 */
@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  private readonly storedRouteHandles: MemoryCacheMap<string | Type<Component>, DetachedRouteHandle>;

  /**
   * Navigation trigger monitoring.
   */
  private navigationTrigger!: NavigationTrigger;

  constructor(
    @Inject(NGX_BACK_FORWARD_CACHE_INJECTION_TOKEN) private config: NgxBackForwardCacheConfig,
    private navigationTriggerService: NavigationTriggerService
  ) {
    this.storedRouteHandles = new MemoryCacheMap(
      {
        maxSize: this.config.maximumNumberOfCachedPages,
        beforeDeleted: ({ value }) => {
          this.destroyDetachedRouteHandle(value);
        }
      }
    );

    this.navigationTriggerService.eventUrlChanged.subscribe((navigationTrigger) => {
      this.navigationTrigger = navigationTrigger;
    });
  }

  /**
   * This method is called everytime we navigate between routes.
   * The previousRoute is the route we are leaving and currentRoute is the route we are landing.
   * If it returns `true` the routing will not happen (which means that routing has not changed).
   * If it returns `false` then the routing happens and the "rest of the methods" below are called.
   */
  shouldReuseRoute(previousRoute: ActivatedRouteSnapshot, currentRoute: ActivatedRouteSnapshot): boolean {
    const defaultReuse = (previousRoute.routeConfig === currentRoute.routeConfig);
    return defaultReuse;
  }

  /**
   * # shouldRetrieve
   * This method is called for the route just opened when we land on the component of this route.
   * Once component is loaded this method is called.
   * If this method returns `true` then `retrieve` method will be called, otherwise the component will be created from scratch.
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    /**
     * Can not retrieve route that has no component linked to it.
     * 
     * For example:
     * app-routing.module.ts
     * { path: 'page-a', loadChildren: () => import('./page-a/page-a.module').then(m => m.PageAModule) } // ***Here: This route can not be retrieved***
     * page-a-routing.module.ts
     * { path: '', component: PageAComponent }{ path: '', component: PageAComponent } // This route can be retrieved.
     */
    if (!route.component) {
      return false;
    }

    /**
     * The EmptyOutletComponent created by Angular is never stored (see shouldDetach method).
     */
    if (route.component === ɵEmptyOutletComponent) {
      return false;
    }

    // If imperative navigation then the component should be created from scratch.
    if (this.navigationTrigger === NavigationTrigger.IMPERATIVE) {

      const possibleRouteHandleStoredInThePast = this.storedRouteHandles.get(route.component);
      if (possibleRouteHandleStoredInThePast) {
        this.storedRouteHandles.delete(route.component);
      }

      return false;
    }

    const exists = this.storedRouteHandles.has(route.component);
    return exists;
  }

  /**
   * This method is called if `shouldAttach` method returns `true`, provides as parameter the current route
   * (we just land), and returns a stored RouteHandle. If it returns null has no effects. We can use this method
   * to get any stored RouteHandle manually. This is not managed by the framework automatically.
   * It is our responsibility to implement it.
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const handle = this.storedRouteHandles.get(route.component!)!;
    return handle;
  }

  /**
   * # shouldStore
   * It is invoked when we leave the current route. If it returns `true` then the `store` method will be invoked.
   * If it returns `false` the component (DetachedRouteHandle) is normally destroyed by Angular (ngOnDestroy).
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    /**
     * Can not store route that has no component linked to it.
     * 
     * For example:
     * app-routing.module.ts
     * { path: 'page-a', loadChildren: () => import('./page-a/page-a.module').then(m => m.PageAModule) } // ***Here: This route should/can not be stored***
     * page-a-routing.module.ts
     * { path: '', component: PageAComponent }{ path: '', component: PageAComponent } // This route will be stored.
     */
    if (!route.component) {
      return false;
    }

    /**
     * Never store the EmptyOutletComponent created by Angular. Else when user navigates to a secondary router outlet for example: /page-a(secondary:page-overlay-a) then back to /page-a the router-outlet component is never destroyed.
     * For example an empty blank sidenav stays on the page even the url has already changed.
     */
    if (route.component === ɵEmptyOutletComponent) {
      return false;
    }

    const shouldStore = (route?.data && route.data['disableNgxBackForwardCache']) ? false : !this.config.disableNgxBackForwardCache;
    return shouldStore;
  }

  /**
   * This method is invoked only if the shouldDetach returns true. We can manage here how to store the RouteHandle.
   * What we store here will be used in the retrieve method. It provides the route we are leaving and the RouteHandle
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (!handle) {
      return;
    }
    this.storedRouteHandles.set(route.component!, handle);
  }

  /**
   * Angular Bug: A way to destroy component is needed here. See: https://github.com/angular/angular/issues/15873
   */
  private destroyDetachedRouteHandle(handle: DetachedRouteHandle): void {
    // Workaround from here: https://github.com/angular/angular/issues/15873#issuecomment-375410962
    (handle as any).componentRef.destroy();
  }
}

/**
 * Source:
 * - https://angular.io/api/router/RouteReuseStrategy
 * - https://itnext.io/cache-components-with-angular-routereusestrategy-3e4c8b174d5f
 * - https://link.medium.com/iQ4nuyfvN5
 * - https://stackoverflow.com/questions/56700126/how-to-implement-routereusestrategy-only-when-user-goes-back-history
 * - https://stackoverflow.com/questions/47676400/recognize-back-forward-browser-buttons-in-angular2
 */
