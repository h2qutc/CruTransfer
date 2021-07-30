import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, IOrder } from '@cru-transfer/core';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent implements OnInit {

  order: IOrder;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getOrder(id).subscribe(data => {
      console.log('data', data);
      this.order = data.payload;
    })
  }

}
