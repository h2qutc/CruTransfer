import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userToken = localStorage.getItem('token');

    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `${userToken}`),
    });
    return next.handle(modifiedReq)
      .pipe(tap(evt => {
        if (evt instanceof HttpResponse) {
          if (evt.status == 401) {
            this.router.navigate(['/login']);
          }
        }
        return of(evt);
      }), catchError((error: any) => {
        if (error.status == 401) {
          this.router.navigate(['/login']);
        }
        return of(error);
      }))
  }
}