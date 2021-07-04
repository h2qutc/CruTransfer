import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from '@polkadot/x-rxjs';
import { IUser } from '../models';

@Injectable()
export class AuthService {

  accessToken: string;

  private _userSubject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  user$: Observable<IUser>;

  constructor() {
    this.user$ = this._userSubject.asObservable();
  }

  get user(): IUser {
    return this._userSubject.value;
  }

  set user(val: IUser) {
    this._userSubject.next(val);
  }


  get isAuthenticated() {
    return this.accessToken != null;
  }


}
