import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lupaakun',
  templateUrl: './lupaakun.page.html',
  styleUrls: ['./lupaakun.page.scss'],
})
export class LupaakunPage implements OnInit {
  public email: string = '';

  alertButtons = ["OK"];
  constructor() { }

  ngOnInit() {
  }

}
