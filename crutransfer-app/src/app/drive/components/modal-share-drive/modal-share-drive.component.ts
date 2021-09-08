import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApiService,
  AuthService, IDrive, IOrder,
  IpfsService, IUser,
  SendActions
} from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { Subject } from 'rxjs';

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
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private api: ApiService,
    private authService: AuthService
  ) {

  }

  ngOnInit() {
    this.user = this.authService.user;
    this.drive = this.data.drive;

    // this.tryPin();

    this.form = this.formBuilder.group({
      drive: [this.drive],
      sender: [{
        value: this.user.email,
      }],
      isAnonymous: [false],
      recipients: [['h2qbkhn@gmail.com'], [Validators.required]],
      message: [null],
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private shareDrive(drive: IDrive) {
    const data = this.form.getRawValue();
    console.log('share data', data);
    this.api.shareDrive(data).subscribe((data) => {
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
