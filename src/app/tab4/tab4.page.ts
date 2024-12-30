import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../provider/post-provider';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  daftars: any = [];
  limit: number = 1;
  start: number = 0;

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.daftars = [];
    this.start = 0;
    this.loadDaftar();
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }

  loadData(event: any) {
    this.start += this.limit;
    setTimeout(() => {
    this.loadDaftar().then(() => {
    event.target.complete();
    });
    }, 500);
    }

  loadDaftar() {
    return new Promise(resolve => {
      let body = {
        aksi: 'getdata',
        limit: this.limit,
        start: this.start,
      };

      this.postPvdr.postData(body, 'action.php').subscribe(data => {
        for (let daftar of data.result) {
          this.daftars.push(daftar);
        }
        resolve(true);
      });
    });
  }
}
