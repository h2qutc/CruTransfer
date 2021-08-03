import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOrder, OrderStatus } from '@cru-transfer/core';

@Component({
  selector: 'cru-card-order',
  templateUrl: './card-order.component.html',
  styleUrls: ['./card-order.component.scss']
})
export class CardOrderComponent implements OnInit {

  public OrderStatusEnum = OrderStatus;

  @Input() order: IOrder;

  @Output() select: EventEmitter<IOrder> = new EventEmitter<IOrder>();

  constructor() { }

  ngOnInit() {
  }

  onSelect(){
    this.select.emit(this.order);
  }

}
