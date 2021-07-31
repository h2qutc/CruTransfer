import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from '@polkadot/x-rxjs';
import { IUser } from '../models';

@Injectable()
export class AuthService {

  set accessToken(tkn: string) {
    this._accessToken = tkn;
    if (tkn != null) {
      localStorage.setItem('Token', tkn);
    } else {
      localStorage.removeItem('Token');
    }
  }

  get accessToken(): string {
    return this._accessToken;
  }

  private _accessToken: string;

  private _userSubject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  user$: Observable<IUser>;

  constructor() {
    this.user$ = this._userSubject.asObservable();
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
