import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  ApiService,
  IDappAccount,
  IDrive,
  IOrder,
  IpfsService,
  IResponse,
  IUser,
  SendActions
} from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-modal-upload-drive',
  templateUrl: './modal-upload-drive.component.html',
  styleUrls: ['./modal-upload-drive.component.scss'],
})
export class ModalUploadDriveComponent implements OnInit, OnDestroy {
  maxAvailableDays = 7;

  private _destroyed: Subject<any> = new Subject<any>();

  progress: number = 10;
  isFinalized = false;
  progressMessage: string = 'Uploading...';

  SendActionsEnum = SendActions;

  data: any;

  link: string = '';

  isCopied = false;

  savedData: IOrder;

  user: IUser;
  account: IDappAccount;
  fileToUpload: any;

  loading = false;
  isOk = false;

  constructor(
    private ipfsService: IpfsService,
    public modalRef: BsModalRef,
    private clipboardService: ClipboardService,
    private notifications: NotificationsService,
    private cd: ChangeDetectorRef,
    private api: ApiService
  ) {

  }

  ngOnInit() {
    this.user = this.data.user;
    this.fileToUpload = this.data.fileToUpload;
    this.account = this.data.account;
    this.tryPin();
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  async tryPin() {
    if (this.fileToUpload) {

      try {
        const fileInfos = await this.ipfsService.addFile(this.fileToUpload);

        const entry = <IDrive>{
          ownerEmail: this.user.email,
          ownerId: this.user.id,
          fileInfos: fileInfos
        }

        this.loading = true;

        if (fileInfos.cid) {
          console.log('place storage order viaDapp ', fileInfos.cid)
          this.ipfsService.placeStorageOrderViaDapp(this.account, fileInfos)
            .then((status: any) => {
              console.log('status', status);
              if (status.isInBlock) {
                const message = `Completed at block hash #${status.asInBlock.toString()}`;
                console.log('Success', message);

                this.saveDrive(entry);

              } else {
                console.log(`Current status: ${status.type}`);
              }
            }, err => {
              this.loading = false;
              this.isFinalized = true;
              this.notifications.error('Error', err?.message);
              console.error('error', err);
            })
        }

      } catch (err: any) {
        this.isFinalized = true;
        this.notifications.error('Error', 'An error has occurred');
      }

    }
  }
  private saveDrive(drive: IDrive) {
    this.api.saveDrive(drive).subscribe((data) => {
      this.notifications.success('Success', 'Your file was successfully uploaded');
      this.close(true);
    }, err => {
      this.notifications.error('Error', err);
      this.close(false);
    })
  }

  copyLink() {
    this.clipboardService.copy(this.link);
    this.isCopied = true;
    this.cd.detectChanges();
  }

  close(isOk: boolean) {
    this.isOk = isOk;
    this.isFinalized = isOk;
    this.modalRef.hide();
  }

}
