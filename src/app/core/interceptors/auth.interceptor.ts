import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, finalize } from 'rxjs';

import { LoaderService } from '../services/loader.service';
import { AuthService } from 'app/pages/auth/auth.service';
import { AuthAPIService } from '../../pages/auth/auth-api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private auth: AuthService,
    private authAPIService: AuthAPIService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.accessToken;

    // Only attach header if we have a token
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Token ${token}` } });
    }

    this.loaderService.start();

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // If the token is invalid/expired, clear and go to login
        if (err.status === 401 || err.status === 403) {
          this.authAPIService.logout();
          this.router.navigateByUrl('');
        }
        return throwError(() => err);
      }),
      finalize(() => this.loaderService.stop())
    );
  }
}
