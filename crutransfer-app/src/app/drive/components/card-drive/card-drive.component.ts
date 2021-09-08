import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileService, IDrive, IpfsService } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ClipboardService } from 'ngx-clipboard';
import { ModalShareDriveComponent } from '../modal-share-drive/modal-share-drive.component';

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
    private ipfsService: IpfsService) { }

  ngOnInit() {
  }

  onSelect() {
    this.select.emit(this.drive);
  }

  copyText(text: string) {
    console.log('text', text);
    this.clipboardService.copy(text);
    this.notifications.success('Success', 'The CID has been copied to your clipboard!');
  }

  async download() {
    const content = await this.ipfsService.loadFile(this.drive.fileInfos.cid);
    this.fileService.createAndDownloadBlobFile(content, this.drive.fileInfos);
  }

  openModalShare() {
    const modalRef = this.modalService.show(ModalShareDriveComponent, <ModalOptions<any>>
      {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'home-modal-verify-sender',
        initialState: {
          data: {
            drive: this.drive
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
