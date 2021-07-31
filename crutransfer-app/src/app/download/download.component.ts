import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FileService, IFileInfo, IOrder, IpfsService } from '@cru-transfer/core';
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
    private router: Router,
    private ipfsService: IpfsService,
    private fileService: FileService,
    private apiService: ApiService) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.getOrder(this.orderId);
  }

  getOrder(orderId: string) {
    this.apiService.getOrder(orderId).subscribe(resp => {
      console.log('get order', resp);
      this.order = resp.payload;
      this.order.expiredDate = new Date(resp.payload.expiredDate);
    }, err => {
      this.order = null;
    })
  }

  async download() {
    const fileInfo: IFileInfo = this.order.fileInfos;
    const cid = fileInfo.cid;

    const content = await this.ipfsService.loadFile(cid);
    this.fileService.createAndDownloadBlobFile(content[0], this.order.fileInfos);

  }


  private goHome(){
    this.router.navigate(['home']);
  }

}
