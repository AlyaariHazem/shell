import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';

import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class User {
  readonly user$;

  constructor(private http: HttpClient) {
  this.user$ = this.http
    .get(environment.getUrl('profile', 'accounts'))
    .pipe(shareReplay(1));
}
}
