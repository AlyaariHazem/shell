import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { User } from '../../core/model/user.model';
import { ApiBaseService } from 'app/shared/services/api-base.service';
import { AuthResponse } from '@app/models';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class AuthAPIService {
  public router = inject(Router);
  constructor(private api: ApiBaseService, private auth: AuthService) {}

  login(user: User): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', user).pipe(
      tap(res => this.auth.setSession(res))
    );
  }

  register(user: User): Observable<void> {
    return this.api.post<void>('auth/register', user);
  }

  // Cookie-session logout (see note below on withCredentials)
  logout(): Observable<void> {
    return this.api.post<void>('auth/logout', {}, /*options*/ { withCredentials: true }).pipe(
      tap(() => {
        this.auth.clear();
        this.router.navigate(['/']);
      })
    );
  }
}
