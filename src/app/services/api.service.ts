import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  postData(): Observable<any> {
    const url = 'http://wikimed.selfip.com:64384/';

    // إعداد البيانات
    const body = new HttpParams()
      .set('Mtype', 'A15')
      .set('HCode', '2827045');

    // إعداد الرؤوس (Headers)
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    // إرسال الطلب
    return this.http.post(url, body.toString(), { headers });
  }
}
