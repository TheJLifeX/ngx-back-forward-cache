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
   * @todo a config for the define all route saved per default or not
   */
}
