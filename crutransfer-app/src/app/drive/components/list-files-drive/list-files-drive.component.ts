import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService, AuthService, IDappAccount, IDrive, IpfsService, IUser } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { DropzoneComponent } from 'ngx-dropzone-wrapper';

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

  async tryPin() {
    if (this.fileToUpload) {
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
            this.notifications.error('Error', err?.message);
            console.error('error', err);
          })
      }

    }
  }

  private saveDrive(drive: IDrive) {
    this.api.saveDrive(drive).subscribe((data) => {
      this.notifications.success('Success', 'Your file was successfully uploaded');
      this.getDriveByUser();
    }, err => {
      this.notifications.error('Error', err);
    })
  }

  private getDriveByUser() {
    this.api.getDriveByUser(this.user.email).subscribe(data => {
      this.drives = data;
    });
  }

}
