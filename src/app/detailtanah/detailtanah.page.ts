import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TanahService, TanahDetail } from '../services/tanah.service';

@Component({
  selector: 'app-detailtanah',
  templateUrl: './detailtanah.page.html',
  styleUrls: ['./detailtanah.page.scss'],
})
export class DetailtanahPage implements OnInit {
  tanahId: number =0;
  tanah: any = {
    title: '',
    latinName: '',
    karakteristik: '',
    tumbuhan: '',
    penyebaran: '',
    unsurph: ''
  };
  tanahDetail!: TanahDetail;

  // Latin names mapping for soil types
  latinNames: { [key: string]: string } = {
    'ALUVIAL': 'Alluvial Soil',
    'ANDOSOL': 'Andosols',
    'ENTISOL': 'Entisols',
    'GRUMUSOL': 'Grumosols',
    'HUMUS': 'Humic Soil',
    'INCEPTISOL': 'Inceptisols',
    'LATOSOL': 'Latosols',
    'LATERIT': 'Laterite Soil',
    'LITOSOL': 'Litosols',
    'MERGEL': 'Mergel Soil',
    'OXISOL': 'Oxisols',
    'ORGANOSOL': 'Organosols',
    'PODSOL': 'Podzols',
    'REGOSOL': 'Regosols',
    'VULKANIK': 'Volcanic Soil'
  };

  constructor(
    private route: ActivatedRoute,
    private tanahService: TanahService
  ) { }

  ngOnInit() {
    // Ambil ID dari parameter URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.tanahId = parseInt(idParam, 10);
      this.loadTanahDetail();
    } else {
      console.error('ID parameter is null');
    }
  }
   /* Mengambil detail tanah dari service */
  private loadTanahDetail() {
    console.log('Fetching details for ID:', this.tanahId);
    
    this.tanahService.getTanahDetail(this.tanahId).subscribe({
      next: (detail) => {
        this.tanahDetail = detail;
        // Set title dan latinName setelah mendapatkan data
        this.tanah.title = detail.tanah;
        const tanahTitle = detail.tanah.toUpperCase();
        this.tanah.latinName = this.latinNames[tanahTitle] || 'Tidak diketahui';
        console.log('Tanah Detail:', this.tanahDetail);
      },
      error: (error) => {
        console.error('Error fetching soil details:', error);
      }
    });
  }
}