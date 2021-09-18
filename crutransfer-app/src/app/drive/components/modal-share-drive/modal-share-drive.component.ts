import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ApiService,
  AuthService, IDrive, IOrder,
  IpfsService, IUser,
  SendActions
} from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-modal-share-drive',
  templateUrl: './modal-share-drive.component.html',
  styleUrls: ['./modal-share-drive.component.scss'],
})
export class ModalShareDriveComponent implements OnInit, OnDestroy {

  maxAvailableDays = 7;
  step = 1;

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
  drive: IDrive;

  loading = false;
  isOk = false;

  form: FormGroup = new FormGroup({});

  constructor(
    private ipfsService: IpfsService,
    public modalRef: BsModalRef,
    private clipboardService: ClipboardService,
    private notifications: NotificationsService,
    private cd: ChangeDetectorRef,
    private api: ApiService,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.user = this.authService.user;
    this.drive = this.data.drive;
    this.form = this.data.form;
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  shareDrive() {
    const data = this.form.getRawValue();
    this.step = 2;
    this.api.shareDrive(data).pipe(finalize(() => this.isFinalized = true)).subscribe((resp) => {
      this.notifications.success('Success', 'Your file was successfully uploaded');
      this.link = resp.payload.link;
      this.savedData = resp.payload;
    }, err => {
      this.notifications.error('Error', err);
    })
  }

  cancel() {
    this.close();
  }

  copyLink() {
    this.clipboardService.copy(this.link);
    this.isCopied = true;
    this.cd.detectChanges();
  }

  close(isOk?: boolean) {
    this.isOk = isOk;
    this.isFinalized = isOk;
    this.modalRef.hide();
  }

}
