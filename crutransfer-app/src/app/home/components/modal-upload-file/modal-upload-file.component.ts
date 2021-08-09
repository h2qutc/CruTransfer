import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService, IOrder, IpfsService, IResponse, SendActions } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HomeViewService } from '../../home-view.service';

@Component({
  selector: 'app-modal-upload-file',
  templateUrl: './modal-upload-file.component.html',
  styleUrls: ['./modal-upload-file.component.scss']
})
export class ModalUploadFileComponent implements OnInit, OnDestroy {

  maxAvailableDays = 7;

  private _destroyed: Subject<any> = new Subject<any>();

  progress: number = 10;
  isFinalized = false;
  progressMessage: string = 'Transferring...';

  SendActionsEnum = SendActions;

  data: any;

  link: string = "";

  isCopied = false;

  savedData: IOrder;

  constructor(private ipfsService: IpfsService, public modalRef: BsModalRef,
    private _clipboardService: ClipboardService,
    private homeViewService: HomeViewService,
    private notifications: NotificationsService,
    private cd: ChangeDetectorRef, private apiService: ApiService) {

  }

  ngOnInit() {
    this.addFileToIpfsAndSaveOrder();
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  async addFileToIpfsAndSaveOrder() {

    this.cleanDataBeforeSending();

    try {
      const fileInfos = await this.ipfsService.addFileToIpfsAndSendTx(this.data.fileSrc);

      fileInfos.name = this.data.fileSrc.name;
      fileInfos.type = this.data.fileSrc.type;

      const order = <IOrder>{
        ...this.data,
        fileInfos: fileInfos
      };
      delete (<any>order).fileSrc;
      this.saveOrder(order);
    } catch (err) {
      this.isFinalized = true;
      this.notifications.error('Error', 'An error has occurred');
    }
  }


  saveOrder(order: IOrder) {
    this.apiService.addOrder(order).subscribe((resp: IResponse) => {
      this.link = resp.payload.link;
      this.savedData = resp.payload;
      this.isFinalized = true;
      this.homeViewService.addOrder(resp.payload);
      this.cd.detectChanges();
    }, err => {
      this.isFinalized = true;
      this.notifications.error('Error', 'An error has occurred');
    })
  }

  copyLink() {
    this._clipboardService.copy(this.link);
    this.isCopied = true;
    this.cd.detectChanges();
  }

  transferAnother() {
    this.modalRef.hide();
  }

  cleanDataBeforeSending() {
    if (this.data.action == SendActions.CopyLink) {
      this.data.sender = null;
      this.data.recipients = [];
    }
  }




}
