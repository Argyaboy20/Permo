import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KamusService } from '../services/kamus.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  tumbuhanId: number;
  tumbuhan: any = {
    title: '',
    description: '',
    latinName: '', 
    suhu: '',
    tanah: '',
    sinarmatahari: '',
    air: ''
  };

  // Latin names mapping (berdasarkan data di kamus.page.ts)
  latinNames: { [key: string]: string } = {
    'ALPUKAT': 'Persea Americana',
    'BAWANG MERAH': 'Allium Ascalonicum',
    'BAWANG PUTIH': 'Allium Sativum',
    'CABAI': 'Capsicum Annuum',
    'DURIAN': 'Durio Zibethinus',
    'GANDUM': 'Triticum Aestivum',
    'JAGUNG': 'Zea Mays',
    'KEDELAI': 'Glycine Max',
    'KENTANG': 'Solanum Tuberosum',
    'LADA': 'Piper Nigrum',
    'MELINJO': 'Gnetum Gnemon',
    'NANGKA': 'Artocarpus Heterophyllus',
    'PADI': 'Oryza Sativa',
    'RAMBUTAN': 'Nephelium Lappaceum',
    'SALAK': 'Salacca Zalacca',
    'TERONG': 'Solanum Melongena',
    'UBI JALAR': 'Ipomoea Batatas',
    'WORTEL': 'Daucus Carota'
  };

  constructor(
    private route: ActivatedRoute,
    private kamusService: KamusService
  ) { 
     /* Mengambil dan menvalidasi parameter ID */
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam !== null) {
      this.tumbuhanId = parseInt(idParam, 10);
    } else {
      this.tumbuhanId = 0;
      console.error('ID parameter is null');
    }
  }

  ngOnInit() {
    if (this.tumbuhanId) {
      this.fetchTumbuhanDetails();
    } else {
      console.error('No valid ID found');
    }
  }
   /* Mengambil detail tumbuhan dari service */
  fetchTumbuhanDetails() {
    console.log('Fetching details for ID:', this.tumbuhanId);
    
    this.kamusService.getTumbuhanDetails(this.tumbuhanId).subscribe(
      (response) => {
        if (response.success && response.result) {
          const tumbuhanTitle = response.result.tumbuhan.toUpperCase();
          
          this.tumbuhan = {
            title: response.result.tumbuhan,
            latinName: this.latinNames[tumbuhanTitle] || '', // Get Latin name from mapping
            description: `Nama latin: ${this.latinNames[tumbuhanTitle] || 'Tidak diketahui'}`,
            suhu: response.result.suhu,
            tanah: response.result.tanah,
            sinarmatahari: response.result.sinarmatahari,
            air: response.result.air
          };
          
          console.log('Tumbuhan Object:', this.tumbuhan);
        } else {
          console.error('No data found or success is false');
        }
      },
      (error) => {
        console.error('Error fetching tumbuhan details', error);
      }
    );
  }
}