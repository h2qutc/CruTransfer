import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  accessToken: string;

  get isAuthenticated() {
    return this.accessToken != null;
  }

  constructor() { }

}
