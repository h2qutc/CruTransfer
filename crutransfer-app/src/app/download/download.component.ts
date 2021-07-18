import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    })
  }

  async download() {
    const fileInfo: IFileInfo = this.order.fileInfos;
    const cid = fileInfo.cid;

    console.log('download order', this.order);

    const content = await this.ipfsService.loadFile(cid);
    console.log('content', content)

    this.fileService.createAndDownloadBlobFile(content[0], 'testName');


  }

}
