import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-child-page-a',
  templateUrl: './child-page-a.component.html',
  styleUrls: ['./child-page-a.component.scss']
})
export class ChildPageAComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
    console.log('ngOnInit - ChildPageAComponent');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy - ChildPageAComponent');
  }
}
