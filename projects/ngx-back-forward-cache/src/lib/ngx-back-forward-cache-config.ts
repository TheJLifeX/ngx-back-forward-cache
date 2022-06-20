export interface NgxBackForwardCacheConfig {
  /**
   * Maximum number of cached pages.
   * When the maximum number of cached pages is reached the oldest cached page is removed.
   * 
   * @default
   * undefined // Meaning no limit.
   */
  maximumNumberOfCachedPages?: number;

  /**
   * Define if ngx-back-forward-cache is disabled or not for all routes per default.
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

  /**
   * `timeToLive` has been Removed because there is no way to check if the DetachedRouteHandle is reattached or not, in the beforeDeleted callback.
   * This means a reattached DetachedRouteHandle can be destroyed after the `timeToLive`.
   */
  // timeToLive?: number;
}
