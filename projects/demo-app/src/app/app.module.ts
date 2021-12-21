import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxBackForwardCacheModule } from 'ngx-back-forward-cache';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBackForwardCacheModule.forRoot({
      backward: true,
      forward: false,
      timeToLive: 10 * 60 * 1000 // 10 minutes
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
