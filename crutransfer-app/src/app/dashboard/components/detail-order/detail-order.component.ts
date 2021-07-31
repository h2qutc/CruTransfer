import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FileService, IFileInfo, IOrder, IpfsService, OrderStatus } from '@cru-transfer/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent implements OnInit {

  order: IOrder;
  isCopied = false;
  public OrderStatusEnum = OrderStatus;

  constructor(private route: ActivatedRoute, private api: ApiService,
    private cd: ChangeDetectorRef, private ipfsService: IpfsService,
    private fileService: FileService,private notifications: NotificationsService,
    private router: Router, private _clipboardService: ClipboardService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getOrder(id).subscribe(data => {
      console.log('data', data);
      this.order = data;
    })
  }

  copyLink() {
    this._clipboardService.copy(this.order.link);
    this.isCopied = true;
    this.notifications.success('Success', 'This link has been copied to your clipboard!');
  }

  preview() {
    this.router.navigate([`/download/${this.order._id}`]);
  }

  async download() {
    const fileInfo: IFileInfo = this.order.fileInfos;
    const cid = fileInfo.cid;

    const content = await this.ipfsService.loadFile(cid);
    this.fileService.createAndDownloadBlobFile(content[0], this.order.fileInfos);

  }

  delete() {
    this.goToDashboard();
  }

  private goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
