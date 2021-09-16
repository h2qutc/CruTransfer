import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  ApiService,
  IOrder,
  IpfsService,
  IResponse,
  SendActions
} from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HomeViewService } from '../../home-view.service';

@Component({
  selector: 'app-modal-upload-file',
  templateUrl: './modal-upload-file.component.html',
  styleUrls: ['./modal-upload-file.component.scss'],
})
export class ModalUploadFileComponent implements OnInit, OnDestroy {
  maxAvailableDays = 7;

  private _destroyed: Subject<any> = new Subject<any>();

  progress: number = 10;
  isFinalized = false;
  progressMessage: string = 'Transferring...';

  SendActionsEnum = SendActions;

  data: any;

  link: string = '';

  isCopied = false;

  savedData: IOrder;

  statusMessage: string;
  hasError = false;

  constructor(
    private ipfsService: IpfsService,
    public modalRef: BsModalRef,
    private clipboardService: ClipboardService,
    private homeViewService: HomeViewService,
    private notifications: NotificationsService,
    private cd: ChangeDetectorRef,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.addFileToIpfsAndSaveOrder();
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  async addFileToIpfsAndSaveOrder() {
    this.cleanDataBeforeSending();
    this.hasError = false;
    try {
      const order = <IOrder>{
        ...this.data,
      };
      this.saveOrder(order);
    } catch (err) {
      this.isFinalized = true;
      this.notifications.error('Error', 'An error has occurred');
      this.statusMessage = `${err.message}`;
      this.hasError = true;
    }
  }

  saveOrder(order: IOrder) {
    this.apiService
      .saveOrder(order)
      .pipe(finalize(() => (this.isFinalized = true)))
      .subscribe(
        (resp: IResponse) => {
          this.link = resp.payload.link;
          this.savedData = resp.payload;
          this.homeViewService.addOrder(resp.payload);
          this.cd.detectChanges();
        },
        (err) => {
          console.error('ERROR', err);
          this.notifications.error('Error', 'An error has occurred');
          this.hasError = true;
        }
      );
  }

  copyLink() {
    this.clipboardService.copy(this.link);
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
