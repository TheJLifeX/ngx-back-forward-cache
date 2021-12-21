import { Component, Inject, Injectable, Type } from '@angular/core';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { MemoryCacheMap } from 'memory-cache-map';
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

  private readonly storedRouteHandles: MemoryCacheMap<Type<Component>, DetachedRouteHandle>;

  private readonly whenShouldStoredRouteHandlesBeRestored: Set<NavigationTrigger> = new Set();

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
        timeToLive: config.timeToLive!
      }
    );

    if (config.backward) {
      this.whenShouldStoredRouteHandlesBeRestored.add(NavigationTrigger.BACKWARD);
    }
    if (config.forward) {
      this.whenShouldStoredRouteHandlesBeRestored.add(NavigationTrigger.FORWARD);
    }

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
    if (route.routeConfig?.loadChildren) {
      return false;
    }

    if (this.navigationTrigger && !this.whenShouldStoredRouteHandlesBeRestored.has(this.navigationTrigger)) {
      const previousStoredRouteHandle = this.storedRouteHandles.get(route.component as Type<Component>);
      if (previousStoredRouteHandle) {
        this.destroyDetachedRouteHandle(previousStoredRouteHandle);
        this.storedRouteHandles.delete(route.component as Type<Component>);
      }
      return false;
    }

    const exists = this.storedRouteHandles.has(route.component as Type<Component>);
    return exists;
  }

  /**
   * This method is called if `shouldAttach` method returns `true`, provides as parameter the current route
   * (we just land), and returns a stored RouteHandle. If it returns null has no effects. We can use this method
   * to get any stored RouteHandle manually. This is not managed by the framework automatically.
   * It is our responsibility to implement it.
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const handle = this.storedRouteHandles.get(route.component as Type<Component>)!;
    return handle;
  }

  /**
   * # shouldStore
   * It is invoked when we leave the current route. If it returns `true` then the `store` method will be invoked.
   * If it returns `false` the component (DetachedRouteHandle) is normally destroyed by Angular (ngOnDestroy).
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (this.config.backward === false && this.config.forward === false) {
      return false;
    }

    // This is to avoid to store unnecessary DetachedRouteHandle.
    if ((this.config.forward === false && this.navigationTrigger === NavigationTrigger.BACKWARD)
      || (this.config.backward === false && this.navigationTrigger === NavigationTrigger.FORWARD)) {
      // Delete stored DetachedRouteHandle when it exists (since it will be normally destroyed by Angular).
      // Else you can get sometimes the following error: "Cannot insert a destroyed View in a ViewContainer!"
      this.storedRouteHandles.delete(route.component as Type<Component>);
      return false;
    }

    // Maybe in future update:
    // const shouldStore = (route?.routeConfig?.data && route.routeConfig.data['ngxBackForwardCache']) ? true : false;
    // return shouldStore;

    return true;
  }

  /**
   * This method is invoked only if the shouldDetach returns true. We can manage here how to store the RouteHandle.
   * What we store here will be used in the retrieve method. It provides the route we are leaving and the RouteHandle
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (handle) {
      this.storedRouteHandles.set(route.component as Type<Component>, handle);
    }
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
