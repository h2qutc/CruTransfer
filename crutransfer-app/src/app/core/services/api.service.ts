import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IOrder, IResponse, IUser, OrderStatus } from '../models';
import { calcDiffDate } from './utils';


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

  getOrdersByUser(email: string): Observable<IOrder[]> {
    const url = `${this.baseUrl}/orders/getOrdersByUser`;
    return this.http.post<IOrder[]>(url, {
      email: email
    }).pipe(map(resp => resp.map(this.mapOrder)));
  }

  getOrder(id: string): Observable<IOrder> {
    const url = `${this.baseUrl}/orders/${id}`;
    return this.http.get<IOrder>(url).pipe(map(resp => this.mapOrder(resp)));
  }

  addOrder(payload: IOrder): Observable<IResponse> {
    const url = `${this.baseUrl}/orders`;
    return this.http.post<IResponse>(url, payload).pipe(map(resp => resp));
  }


  updateOrder(id: string, payload: IOrder): Observable<IResponse> {
    const url = `${this.baseUrl}/orders/${id}`;
    return this.http.put<IResponse>(url, payload).pipe(map(resp => resp));
  }

  updateTotalDownloadForOrder(orderId: string): Observable<any> {
    const url = `${this.baseUrl}/orders/updateTotalDownloadForOrder/${orderId}`;
    return this.http.put<any>(url, {}).pipe(map(resp => resp));
  }


  deleteOrder(id: string): Observable<IResponse> {
    const url = `${this.baseUrl}/orders/${id}`;
    return this.http.delete<IResponse>(url).pipe(map(resp => resp));
  }

  forgotPassword(email: string): Observable<IResponse> {
    const url = `${this.baseUrl}/forgotPassword`;
    return this.http.post<IResponse>(url, {
      email: email,
    }).pipe(map(resp => resp));
  }

  resetPassword(email: string, code: string, password: string): Observable<IResponse> {
    const url = `${this.baseUrl}/resetPassword`;
    return this.http.post<IResponse>(url, {
      code: code,
      password: password,
      email: email
    }).pipe(map(resp => resp));
  }

  signUp(username: string, email: string, password: string): Observable<IResponse> {
    const url = `${this.baseUrl}/signup`;
    return this.http.post<IResponse>(url, {
      email: email,
      password: password,
      username: username
    }).pipe(map(resp => resp));
  }

  signIn(email: string, password: string): Observable<IResponse> {
    const url = `${this.baseUrl}/signin`;
    return this.http.post<IResponse>(url, {
      email: email,
      password: password
    }).pipe(map(resp => resp));
  }

  signOut(): Observable<any> {
    return of({});
  }

  sendEmail(): Observable<IResponse> {
    const url = `${this.baseUrl}/email`;
    return this.http.get<IResponse>(url);
  }


  private mapOrder(dto: any): IOrder {
    dto.expiredDate = new Date(dto.expiredDate);
    dto.createdDate = new Date(dto.createdDate);
    const diff = calcDiffDate(new Date(), dto.expiredDate);
    dto.status = diff != null ? diff.status : OrderStatus.Expired;
    dto.timeRemainStr = diff ? `Expires in ${diff.toString()}` : 'Expired';
    return dto;
  }



}
