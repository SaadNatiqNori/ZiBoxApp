import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Platform } from "@ionic/angular";

import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private platform: Platform,
  ) { }

  // Zi Marketplace
  headers(): any {
    return new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`);
  }

  get(url: string) {
    return this.http.get(`${environment.apiURL}${url}`, { headers: this.headers() });
  }

  post(url: string, body: object) {
    return this.http.post(`${environment.apiURL}${url}`, body, { headers: this.headers() });
  }

  patch(url: string, body: object) {
    return this.http.patch(`${environment.apiURL}${url}`, body, { headers: this.headers() });
  }

  put(url: string, body: object) {
    return this.http.put(`${environment.apiURL}${url}`, body, { headers: this.headers() });
  }

  delete(url: string) {
    return this.http.delete(`${environment.apiURL}${url}`, { headers: this.headers() });
  }

  // Zi Chat
  chatHeaders(): any {
    return new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`)
      .set('X-ZiApplication', '4')
  }
  getChat(url: string) {
    return this.http.get(`${environment.chatUrl}${url}`, { headers: this.chatHeaders() });
  }
  postChat(url: string, body: object) {
    return this.http.post(`${environment.chatUrl}${url}`, body, { headers: this.chatHeaders() });
  }
  patchChat(url: string, body: object) {
    return this.http.patch(`${environment.chatUrl}${url}`, body, { headers: this.chatHeaders() });
  }
  putChat(url: string, body: object) {
    return this.http.put(`${environment.chatUrl}${url}`, body, { headers: this.chatHeaders() });
  }
  deleteChat(url: string) {
    return this.http.delete(`${environment.chatUrl}${url}`, { headers: this.chatHeaders() });
  }

  // Zi Core - Using Zi Chat Header
  getCore(url: string) {
    return this.http.get(`${environment.coreURL}${url}`, { headers: this.chatHeaders() });
  }
  postCore(url: string, body: object) {
    return this.http.post(`${environment.coreURL}${url}`, body, { headers: this.chatHeaders() });
  }
}