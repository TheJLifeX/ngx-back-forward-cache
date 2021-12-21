import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DemoApiService } from '../demo-api.service';

@Component({
  selector: 'app-page-a',
  templateUrl: './page-a.component.html',
  styleUrls: ['./page-a.component.scss']
})
export class PageAComponent implements OnInit {

  loading!: boolean;
  items!: string[];

  private componentDestroyed$ = new Subject<void>();

  constructor(private demoApiService: DemoApiService) { }

  ngOnInit(): void {
    console.log('ngOnInit - PageAComponent');
    this.loading = true;
    this.demoApiService.getData('Page A').pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe(items => {
      this.items = items;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy - PageAComponent');
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
