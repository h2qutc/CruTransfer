import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService, IOrder, IpfsService, IResponse, SendActions } from '@cru-transfer/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard'

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

  constructor(private ipfsService: IpfsService, public modalRef: BsModalRef,
    private _clipboardService: ClipboardService,
    private cd: ChangeDetectorRef, private apiService: ApiService) {

  }

  ngOnInit() {

    this.ipfsService.progress$.pipe(takeUntil(this._destroyed)).subscribe((info) => {
      console.log('progress', info);
      this.progressMessage = info.message;
      this.progress += 25;
      if (info.isFinalized || this.progress > 100) {
        this.progress = 100;
        this.isFinalized = true;
      }
      this.cd.detectChanges();
    });

    this.addFileToIpfsAndSaveOrder();

  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  async addFileToIpfsAndSaveOrder() {

    console.log('selected file', this.data.fileSrc);
    const fileInfos = await this.ipfsService.addFileToIpfsAndSendTx(this.data.fileSrc);

    fileInfos.name = this.data.fileSrc.name;
    fileInfos.type = this.data.fileSrc.type;

    const order = <IOrder>{
      ...this.data,
      fileInfos: fileInfos
    };
    delete (<any>order).fileSrc;
    this.saveOrder(order);
  }


  saveOrder(order: IOrder) {
    this.apiService.addOrder(order).subscribe((resp: IResponse) => {
      this.link = resp.payload.link;
      console.log('payload', resp.payload);
      this.cd.detectChanges();
    }, err => {
      console.error('error', err);
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




}
