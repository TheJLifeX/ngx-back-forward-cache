export interface NgxBackForwardCacheConfig {
  /**
   * Restore cached components on backward navigation (e.g. user clicks on browser back-button).
   * 
   * @default
   * true
   */
  backward?: boolean;

  /**
   * Restore cached components on forward navigation (e.g. user clicks on browser forward-button).
   * 
   * @default
   * false
   */
  forward?: boolean;

  /**
   * Time to live of the cached components. Value in milliseconds.
   * 
   * @default
   * Infinity // Which means cached components are never cleaned from the memory until the browser tab is closed.
   * 
   * @example
   * 10 * 60 * 1000 // 10 minutes
   */
  timeToLive?: number;
}
