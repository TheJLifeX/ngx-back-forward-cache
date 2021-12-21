import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { NgxNavigationTriggerModule } from 'ngx-navigation-trigger';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { defaultNgxBackForwardCacheConfig } from './default-ngx-back-forward-cache-config';
import { NgxBackForwardCacheConfig } from './ngx-back-forward-cache-config';
import { NGX_BACK_FORWARD_CACHE_INJECTION_TOKEN } from './ngx-back-forward-cache-injection-token';

@NgModule({
  imports: [
    NgxNavigationTriggerModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ]
})
export class NgxBackForwardCacheModule {

  /**
   * Use this method in your root module (e.g. `AppModule`).
   */
  static forRoot(config?: NgxBackForwardCacheConfig): ModuleWithProviders<NgxBackForwardCacheModule> {
    return {
      ngModule: NgxBackForwardCacheModule,
      providers: [
        {
          provide: NGX_BACK_FORWARD_CACHE_INJECTION_TOKEN,
          useValue: Object.assign(defaultNgxBackForwardCacheConfig, config)
        }
      ]
    };
  }
}
