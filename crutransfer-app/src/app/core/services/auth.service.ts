import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  accessToken: string;

  get isAuthenticated() {
    return this.accessToken != null;
  }

  constructor() { }

}
