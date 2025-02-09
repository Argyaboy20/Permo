import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-halamanutama',
  templateUrl: './halamanutama.page.html',
  styleUrls: ['./halamanutama.page.scss'],
})
export class HalamanutamaPage implements OnInit {
  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
  }

  async navigateToDaftar() {
    await this.router.navigateByUrl('/daftar');
  }
}