import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageARoutingModule } from './page-a-routing.module';
import { PageAComponent } from './page-a.component';
import { ChildPageAComponent } from './child-page-a/child-page-a.component';

@NgModule({
  declarations: [
    PageAComponent,
    ChildPageAComponent
  ],
  imports: [
    CommonModule,
    PageARoutingModule
  ]
})
export class PageAModule { }
