import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const headers: { [key: string]: string } = {
        Authorization: `Bearer ${token}`
      };
      if (!(req.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      req = req.clone({
        setHeaders: headers
      });
    }

    return next.handle(req);
  }
}
