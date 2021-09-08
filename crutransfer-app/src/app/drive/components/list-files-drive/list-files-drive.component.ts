import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService, AuthService, IDappAccount, IDrive, IpfsService, IUser } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DropzoneComponent } from 'ngx-dropzone-wrapper';
import { ModalUploadDriveComponent } from '../modal-upload-drive/modal-upload-drive.component';

@Component({
  selector: 'app-list-files-drive',
  templateUrl: './list-files-drive.component.html',
  styleUrls: ['./list-files-drive.component.scss']
})
export class ListFilesDriveComponent implements OnInit {

  @ViewChild('dropzone') dropzoneCmp: DropzoneComponent;

  @Input() account: IDappAccount;

  fileToUpload: any;
  fileErrorMessage: string;

  private user: IUser;

  drives: IDrive[] = [];

  loading = false;

  get fileList(): FileList {
    return this.dropzoneCmp.directiveRef.dropzone().files;
  }

  constructor(private ipfsService: IpfsService,
    private authService: AuthService,
    private notifications: NotificationsService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private api: ApiService) {
    this.user = this.authService.user;
  }

  ngOnInit() {
    this.getDriveByUser();
  }

  onRemovedfile(event: any) {
    this.fileErrorMessage = '';
    if (this.fileList.length == 0) {
      this.fileToUpload = null;
    }
  }

  onFileSelected(event: FileList) {
    if (event[0] != null && (<any>event[0]).status != 'error') {
      this.fileErrorMessage = '';
      this.fileToUpload = event[0];
    }
  }

  onFileError(event: any) {
    this.fileErrorMessage = event[1];
  }

  openModal() {
    const modalRef = this.modalService.show(ModalUploadDriveComponent, <ModalOptions<any>>
      {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'home-modal-verify-sender',
        initialState: {
          data: {
            fileToUpload: this.fileToUpload,
            account: this.account,
            user: this.user
          }
        }

      }
    );

    modalRef.onHidden.subscribe((res) => {
      this.getDriveByUser();
      this.cd.detectChanges();
    })
  }

  private getDriveByUser() {
    this.api.getDriveByUser(this.user.email).subscribe(data => {
      this.drives = data;
    });
  }

}
