import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment.development';
import { ApiResponse } from '@app/models';


@Injectable({ providedIn: 'root' })
export class ApiBaseService {
  router = inject(Router);
  http = inject(HttpClient);
  constructor() {}
  private baseUrl = environment.baseUrl;

  private unwrap<T>() {
    return (source: Observable<ApiResponse<T>>) => source.pipe(
      // validate envelope and return result
      tap(res => {
        if (!res?.isSuccess) {
          throw new Error(res?.errorMasseges?.[0] ?? 'Request failed');
        }
      }),
      map(res => res.result)
    );
  }

  get<T>(path: string, params?: Record<string, any>) {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}/${path}`, { params })
      .pipe(this.unwrap<T>(), catchError(err => throwError(() => err)));
  }

  post<T>(path: string, body: unknown, options?: object) {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}/${path}`, body, options)
      .pipe(this.unwrap<T>(), catchError(err => throwError(() => err)));
  }

  put<T>(path: string, body: unknown) {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}/${path}`, body)
      .pipe(this.unwrap<T>(), catchError(err => throwError(() => err)));
  }

  patch<T>(path: string, body: unknown) {
    return this.http
      .patch<ApiResponse<T>>(`${this.baseUrl}/${path}`, body)
      .pipe(this.unwrap<T>(), catchError(err => throwError(() => err)));
  }

  delete<T>(path: string) {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}/${path}`)
      .pipe(this.unwrap<T>(), catchError(err => throwError(() => err)));
  }
}
