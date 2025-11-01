import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { User } from '../../core/model/user.model';
import { ApiBaseService } from 'app/shared/services/api-base.service';
import { AuthResponse } from '@app/models';
import { AuthService } from 'app/pages/auth/auth.service';
import { environment } from 'environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthAPIService {
  constructor(private api: ApiBaseService, private auth: AuthService, private router: Router) {}

  login(user: User): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', user).pipe(
      tap(res => this.auth.setSession(res))
    );
  }

  register(user: User): Observable<void> {
    return this.api.post<void>(environment.getUrl('register', 'accounts'), user);
  }

  // Cookie-session logout (see note below on withCredentials)
  logout(): Observable<void> {
    return this.api.post<void>(environment.getUrl('logout','accounts'), {}, /*options*/ { withCredentials: true }).pipe(
      tap(() => {
        this.auth.clear();
        this.router.navigate(['/']);
      })
    );
  }
}
