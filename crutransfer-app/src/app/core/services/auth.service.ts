import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from '@polkadot/x-rxjs';
import { IUser } from '../models';

@Injectable()
export class AuthService {

  set accessToken(tkn: string) {
    if (tkn != null) {
      localStorage.setItem('token', tkn);
    } else {
      localStorage.removeItem('token');
    }
    this._accessTokenSubject.next(tkn);
  }

  get accessToken(): string {
    let val = this._accessTokenSubject.value;
    if (val == null) {
      const stored = localStorage.getItem('token');
      if (stored != null) {
        this._accessTokenSubject.next(stored);
      }
      val = stored;
    }
    return val;
  }

  private _userSubject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);
  private _accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  user$: Observable<IUser>;
  accessToken$: Observable<string>;

  constructor() {
    this.user$ = this._userSubject.asObservable();
    this.accessToken$ = this._accessTokenSubject.asObservable();
  }

  get user(): IUser {
    let val = this._userSubject.value;
    if (val == null) {
      const stored = JSON.parse(localStorage.getItem('currentUser'));
      if (stored != null) {
        this._userSubject.next(stored);
      }
      val = stored;
    }
    return val;
  }

  set user(val: IUser) {
    if (val != null) {
      localStorage.setItem('currentUser', JSON.stringify(val));
    } else {
      localStorage.removeItem('currentUser');
    }
    this._userSubject.next(val);
  }


  get isAuthenticated() {
    return this.accessToken != null;
  }


  signOut() {
    this.user = null;
    this.accessToken = null;
  }


}
