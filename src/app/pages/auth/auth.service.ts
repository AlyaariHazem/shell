import { Injectable, inject } from '@angular/core';
import { AuthResponse } from '@app/models';


@Injectable({ providedIn: 'root' })
export class AuthService {
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
}
