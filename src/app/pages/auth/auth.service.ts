import { Injectable, inject } from '@angular/core';
import { AuthResponse } from '@app/models';
import { Role } from '@app/types';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private ACCESS_KEY = 'access';
  private REFRESH_KEY = 'refresh';
  private ROLE_KEY = 'role';

  // Swap to NgRx/Signals later if you like
  private _token: string | null = null;

  get token(): string | null { return this._token ?? localStorage.getItem('token'); }
  setSession(res: AuthResponse) {
    this._token = res.token;
    localStorage.setItem('token', res.token);
    localStorage.setItem('managerName', res.managerName?.trim() || 'Admin');
    if (res.yearId) localStorage.setItem('yearId', String(res.yearId));
    if (res.schoolName) localStorage.setItem('schoolName', res.schoolName);
    if (res.userName) localStorage.setItem('userName', res.userName);
    if (res.schoolId) localStorage.setItem('schoolId', String(res.schoolId));
  }

  clear() {
    this._token = null;
    ['token','managerName','yearId','schoolName','userName','schoolId']
      .forEach(k => localStorage.removeItem(k));
  }

  setTokens(access: string, refresh: string | undefined) {
    localStorage.setItem(this.ACCESS_KEY, access);
    if (refresh) localStorage.setItem(this.REFRESH_KEY, refresh);
  }

  setRole(role: Role) {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  get role(): Role | null {
    const r = localStorage.getItem(this.ROLE_KEY);
    return r === 'employer' || r === 'jobseeker' ? r : null;
  }

  isLoggedIn(): boolean {
    // If you have JWTs and want expiry checks, decode & validate here.
    return !!this.accessToken;
  }

}
