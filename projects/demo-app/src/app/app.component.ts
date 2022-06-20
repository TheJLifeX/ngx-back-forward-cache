import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  secondaryRouterOutletContainer: boolean = false;

  links: string[] = [
    '/page-a',
    '/page-b',
    '/page-b/second-b',
    '/page-c'
  ];

  constructor(
    private titleService: Title,
    private locationService: Location
  ) { }

  ngOnInit(): void {
    this.locationService.onUrlChange((url) => {
      this.titleService.setTitle(`${url} - Demo app`);
    });
  }

  onEventActivateSecondaryRouterOutlet(event: any): void {
    console.log('onEventActivateSecondaryRouterOutlet - event', event);
    this.secondaryRouterOutletContainer = true;
  }

  onEventDeactivateSecondaryRouterOutlet(event: any): void {
    console.log('onEventDeactivateSecondaryRouterOutlet - event', event);
    this.secondaryRouterOutletContainer = false;
  }
}
