import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@cru-transfer/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  orderId: string;

  constructor(private route: ActivatedRoute,
    private apiService: ApiService) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    console.log('download id', this.orderId);
  }

  download() {
    this.apiService.getOrder(this.orderId).subscribe(resp => {
      console.log('get order', resp)
    })
  }

}
