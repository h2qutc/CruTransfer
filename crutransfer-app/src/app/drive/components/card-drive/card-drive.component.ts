import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService, FileService, IDrive, IpfsService, SendActions } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { ModalShareDriveComponent } from '../modal-share-drive/modal-share-drive.component';
import { ModalUploadDriveComponent } from '../modal-upload-drive/modal-upload-drive.component';

@Component({
  selector: 'cru-card-drive',
  templateUrl: './card-drive.component.html',
  styleUrls: ['./card-drive.component.scss']
})
export class CardDriveComponent implements OnInit {

  @Input() drive: IDrive;

  @Output() select: EventEmitter<IDrive> = new EventEmitter<IDrive>();

  constructor(private clipboardService: ClipboardService,
    private notifications: NotificationsService,
    private fileService: FileService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ipfsService: IpfsService) { }

  ngOnInit() {
  }

  onSelect() {
    this.select.emit(this.drive);
  }

  copyText(text: string) {
    this.clipboardService.copy(text);
    this.notifications.success('Success', 'The CID has been copied to your clipboard!');
  }

  async download() {
    const content = await this.ipfsService.loadFile(this.drive.fileInfos.cid);
    this.fileService.createAndDownloadBlobFile(content, this.drive.fileInfos);
  }

  openModalShare() {

    const form = this.formBuilder.group({
      drive: [this.drive],
      sender: [{
        value: this.authService.user.email,
        disabled: true
      }],
      isAnonymous: [false],
      recipients: [[], [Validators.required]],
      message: [null],
      action: [SendActions.SendEmail, Validators.required]
    });

    const modalRef = this.modalService.show(ModalShareDriveComponent, <ModalOptions<any>>
      {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'home-modal-verify-sender',
        initialState: {
          data: {
            drive: this.drive,
            form: form
          }
        }

      }
    );

    modalRef.onHidden.subscribe((res) => {
      // this.getDriveByUser();
      // this.cd.detectChanges();
    })
  }

}
