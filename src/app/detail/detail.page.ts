import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  tumbuhanId;

  tumbuhan: any = {};

  constructor(
    private route: ActivatedRoute
  ) { 
    this.tumbuhanId = this.route.snapshot.paramMap.get('id');

    this.route.queryParams.subscribe( res => {
      console.log(res);
      this.tumbuhan = res;
    })
  }

  ngOnInit() {
  }

}
