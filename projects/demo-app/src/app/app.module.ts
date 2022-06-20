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
      disableNgxBackForwardCache: false
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }