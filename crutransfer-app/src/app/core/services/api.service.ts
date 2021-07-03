import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../models';


@Injectable()
export class ApiService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    const url = `${this.baseUrl}/users`;
    return this.http.get<IUser[]>(url).pipe(map(resp => resp));
  }

}
