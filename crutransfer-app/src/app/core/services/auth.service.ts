import { Injectable } from '@angular/core';
import { IUser } from '../models';

@Injectable()
export class AuthService {

  accessToken: string;

  user: IUser;

  get isAuthenticated() {
    return this.accessToken != null;
  }

  constructor() { }

  getUser(): IUser {
    return this.user;
  }



}
