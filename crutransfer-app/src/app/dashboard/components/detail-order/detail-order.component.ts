import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, FileService, IFileInfo, IOrder, IpfsService, OrderStatus } from '@cru-transfer/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent implements OnInit {

  @ViewChild('templateConfirm') tmpConfirm: TemplateRef<any>;

  modalRef: BsModalRef;
  order: IOrder;
  isCopied = false;
  public OrderStatusEnum = OrderStatus;

  constructor(private route: ActivatedRoute, private api: ApiService,
    private cd: ChangeDetectorRef, private ipfsService: IpfsService,
    private modalService: BsModalService,
    private fileService: FileService, private notifications: NotificationsService,
    private router: Router, private _clipboardService: ClipboardService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getOrder(id).subscribe(data => {
      this.order = data;
    }, err => {
      this.router.navigate(['/dashboard']);
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
    this.fileService.createAndDownloadBlobFile(content, this.order.fileInfos);

  }

  delete() {
    const modalRef = this.modalService.show(this.tmpConfirm, { class: 'modal-sm' });
    this.goToDashboard();
  }

  back() {
    this.router.navigate(['/dashboard']);
  }

  private goToDashboard() {
    this.api.deleteOrder(this.order._id).subscribe(data => {
      this.router.navigate(['/dashboard']);
    })
  }

  openModalConfirmation(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.delete();
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }

}
