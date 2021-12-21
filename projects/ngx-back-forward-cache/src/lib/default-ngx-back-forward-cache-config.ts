import { NgxBackForwardCacheConfig } from './ngx-back-forward-cache-config';

export const defaultNgxBackForwardCacheConfig: NgxBackForwardCacheConfig = {
  backward: true,
  forward: false,
  timeToLive: Infinity
};
