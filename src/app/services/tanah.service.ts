import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TanahDetail {
  id: number;
  tanah: string;
  karakteristik: string;
  tumbuhan: string;
  penyebaran: string;
  unsurph: string;
}

@Injectable({
  providedIn: 'root'
})
export class TanahService {
  private apiUrl = 'http://127.0.0.1/api/action.php';

  constructor(private http: HttpClient) { }

  getTanahDetail(id: number): Observable<TanahDetail> {
    const data = {
      aksi: 'get_tanah_detail',
      id: id
    };
    
    return this.http.post<any>(this.apiUrl, data).pipe(
      map(response => {
        if (response.success) {
          return response.result;
        } else {
          throw new Error(response.message);
        }
      })
    );
  }
}