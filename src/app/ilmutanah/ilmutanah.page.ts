import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ilmutanah',
  templateUrl: './ilmutanah.page.html',
  styleUrls: ['./ilmutanah.page.scss'],
})
export class IlmutanahPage implements OnInit {
  searchIsi!: string;
  tanah: any = [
    { id: 1, title: 'ALUVIAL', description: 'Nama latin: Alluvial Soil'},
    { id: 2, title: 'ANDOSOL', description: 'Nama latin:  Andosols'},
    { id: 3, title: 'ENTISOL', description: 'Nama latin: Entisols'},
    { id: 4, title: 'GRUMUSOL', description: 'Nama latin: Grumosols'},
    { id: 5, title: 'HUMUS', description: 'Nama latin: Humic Soil'},
    { id: 6, title: 'INCEPTISOL', description: 'Nama latin: Inceptisols'},
    { id: 7, title: 'LATOSOL', description: 'Nama latin: Latosols'},
    { id: 8, title: 'LATERIT', description: 'Nama latin: Laterite Soil'},
    { id: 9, title: 'LITOSOL', description: 'Nama latin: Litosols'},
    { id: 10, title: 'MERGEL', description: 'Nama latin: Mergel Soil'},
    { id: 11, title: 'OXISOL', description: 'Nama latin: Oxisols'},
    { id: 12, title: 'ORGANOSOL', description: 'Nama latin: Organosols'},
    { id: 13, title: 'PODSOL', description: 'Nama latin: Podzols'},
    { id: 14, title: 'REGOSOL', description: 'Nama latin: Regosols'},
    { id: 15, title: 'VULKANIK', description: 'Nama latin: Volcanic Soil'},
  ];


  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  
   /* Routing method */
  goToIsi(tanah: any){
  this.router.navigate(['/detailtanah', tanah.id]);
}

}
