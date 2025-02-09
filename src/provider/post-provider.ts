import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostProvider {
  server: string = 'http://127.0.0.1/api/';

  constructor(private http: HttpClient) {}

  postData(body: any, file: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const options = {
      headers: headers
    };

    return this.http.post(this.server + file, JSON.stringify(body), options)
      .pipe(
        map((response: any) => {
          // Ensure we're getting a valid response
          if (typeof response === 'string') {
            try {
              return JSON.parse(response);
            } catch (e) {
              throw new Error('Invalid JSON response from server');
            }
          }
          return response;
        })
      );
  }
}