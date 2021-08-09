import { Injectable } from '@angular/core';
import { IOrder } from '@cru-transfer/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeViewService {

  private _ordersSubject: BehaviorSubject<IOrder[]> = new BehaviorSubject<IOrder[]>([]);

  orders$: Observable<IOrder[]> = this._ordersSubject.asObservable();

  constructor() { }

  addOrder(o: IOrder) {
    const list: IOrder[] = this._ordersSubject.value;
    const found = list.find(x => x._id === o._id);
    if (!found) {
      list.push(o);
      this._ordersSubject.next(list);
    }
  }

}
