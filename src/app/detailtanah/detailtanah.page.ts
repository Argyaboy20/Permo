import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detailtanah',
  templateUrl: './detailtanah.page.html',
  styleUrls: ['./detailtanah.page.scss'],
})
export class DetailtanahPage implements OnInit {

  tanahId;

  tanah: any = {};

  constructor(
    private route: ActivatedRoute
  ) { 
    this.tanahId = this.route.snapshot.paramMap.get('id');

    this.route.queryParams.subscribe( res => {
      console.log(res);
      this.tanah = res;
  })

}

  ngOnInit() {
  }

}
