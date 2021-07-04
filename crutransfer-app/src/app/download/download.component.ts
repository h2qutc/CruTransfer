import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, IOrder } from '@cru-transfer/core';
import { repeat } from 'rxjs/operators';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  orderId: string;

  order: IOrder;

  constructor(private route: ActivatedRoute,
    private apiService: ApiService) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    console.log('download id', this.orderId);
    this.getOrder(this.orderId);
  }

  getOrder(orderId: string) {
    this.apiService.getOrder(orderId).subscribe(resp => {
      console.log('get order', resp);
      this.order = resp.payload;
    })
  }

  download() {
    console.log('download')
  }

}
