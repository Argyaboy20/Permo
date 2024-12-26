import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daftar',
  templateUrl: './daftar.page.html',
  styleUrls: ['./daftar.page.scss'],
})
export class DaftarPage implements OnInit {
  alertButtons = ["OK"]; //constructor fitur alert
  constructor() { }

  ngOnInit() {
  }

}
