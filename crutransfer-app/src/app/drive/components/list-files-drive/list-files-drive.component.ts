import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService, AuthService, IDappAccount, IDrive, IPagedResponse, IpfsService, IUser } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DropzoneComponent } from 'ngx-dropzone-wrapper';
import { finalize } from 'rxjs/operators';
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
  page = 1;
  limit = 10;
  search = '';
  orderBy = '';
  isLoading: boolean;
  endOfTheList = false;
  totalDocs = 0;
  totalPages = 0;

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
    this.loadData(this.limit, this.page, this.search, this.orderBy);
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
      this.loadData();
      this.reset()
      this.cd.detectChanges();
    }, err => {
      this.reset();
    })
  }

  private loadData(limit: number = 10, page: number = 1, search: string = '', orderBy: string = '') {

    this.limit = limit;
    this.page = page;
    this.search = search;
    this.orderBy = orderBy;

    this.api.getDriveByUser(this.user.email, limit, page, search, orderBy).subscribe((resp: IPagedResponse) => {
      this.drives = resp.docs;
      this.totalDocs = resp.totalDocs;
      this.totalPages = resp.totalPages;
    });
  }

  private reset() {
    this.dropzoneCmp.directiveRef.reset();
    this.fileToUpload = null;
  }

  pageChanged(event: any): void {
    this.loadData(this.limit, event.page, this.search, this.orderBy);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadData(perPage, 1, this.search, this.orderBy);
  }

  changeOrderBy(item: any): void {
    this.loadData(this.limit, 1, this.search, item.value);
  }

}
