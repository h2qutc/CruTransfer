import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IOrder, IResponse, IUser } from '../models';


@Injectable()
export class ApiService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    const url = `${this.baseUrl}/users`;
    return this.http.get<IUser[]>(url).pipe(map(resp => resp));
  }

  addUser(payload: IUser): Observable<IUser> {
    const url = `${this.baseUrl}/users`;
    return this.http.post<IUser>(url, payload).pipe(map(resp => resp));
  }


  updateUser(userId: string, payload: IUser): Observable<IUser> {
    const url = `${this.baseUrl}/users/${userId}`;
    return this.http.put<IUser>(url, payload).pipe(map(resp => resp));
  }


  deleteUser(userId: string): Observable<IUser[]> {
    const url = `${this.baseUrl}/users/${userId}`;
    return this.http.delete<any>(url).pipe(map(resp => resp));
  }

  // ORDERS

  getOrders(): Observable<IResponse> {
    const url = `${this.baseUrl}/orders`;
    return this.http.get<IResponse>(url).pipe(resp => resp);
  }


  getOrder(id: string): Observable<IResponse> {
    const url = `${this.baseUrl}/orders/${id}`;
    return this.http.get<IResponse>(url).pipe(map(resp => resp));
  }

  addOrder(payload: IOrder): Observable<IResponse> {
    const url = `${this.baseUrl}/orders`;
    return this.http.post<IResponse>(url, payload).pipe(map(resp => resp));
  }


  updateOrder(userId: string, payload: IOrder): Observable<IResponse> {
    const url = `${this.baseUrl}/orders/${userId}`;
    return this.http.put<IResponse>(url, payload).pipe(map(resp => resp));
  }


  deleteOrder(userId: string): Observable<IResponse> {
    const url = `${this.baseUrl}/orders/${userId}`;
    return this.http.delete<IResponse>(url).pipe(map(resp => resp));
  }

  login(email: string, password: string): Observable<IResponse> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<IResponse>(url, {
      email: email,
      password: password
    }).pipe(map(resp => resp));
  }


}
