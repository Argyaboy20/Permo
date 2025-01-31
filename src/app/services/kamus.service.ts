import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KamusService {
  private apiUrl = 'http://127.0.0.1/api/action.php'; // Replace with your actual backend URL

  constructor(private http: HttpClient) { }

  getTumbuhanDetails(id: number): Observable<any> {
    const payload = {
      aksi: 'get_tumbuhan_detail',
      id: id
    };

    return this.http.post(this.apiUrl, payload);
  }
}