import { Component, Input, OnInit } from '@angular/core';
import { IOrder } from '@cru-transfer/core';

@Component({
  selector: 'cru-card-order',
  templateUrl: './card-order.component.html',
  styleUrls: ['./card-order.component.scss']
})
export class CardOrderComponent implements OnInit {

  @Input() order: IOrder;

  constructor() { }

  ngOnInit() {
  }

  onSelect(){

  }

}
