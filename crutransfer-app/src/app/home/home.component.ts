import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, AuthService, IFileInfo, IOrder, IUser, SendActions } from '@cru-transfer/core';
import { Subject } from '@polkadot/x-rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TagInputComponent } from 'ngx-chips';
import { DropzoneComponent } from 'ngx-dropzone-wrapper';
import { takeUntil } from 'rxjs/operators';
import { ModalUploadFileComponent, ModalVerifySenderComponent } from './components';

const listValidatorsEmail = [Validators.required, Validators.email];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('dropzone') dropzoneCmp: DropzoneComponent;
  @ViewChild('tagInput') tagInputRef: ElementRef<TagInputComponent>;

  fileInfos: IFileInfo;

  form: FormGroup = new FormGroup({});

  orderId: string;

  submitted = false;

  sendActionsEnums = SendActions;

  modalRef: BsModalRef;


  progress: number = 10;
  progressMessage: string = 'Sending';

  focused = false;

  currentUser: IUser;

  savedData: IOrder[] = [];

  fileErrorMessage: string;

  get fileList(): FileList {
    return this.dropzoneCmp.directiveRef.dropzone().files;
  }

  get recipientsCtrl(): AbstractControl {
    return this.form.controls.recipients;
  }

  private _destroyed: Subject<any> = new Subject<any>();

  constructor(
    private api: ApiService, private authService: AuthService,
    private formBuilder: FormBuilder, private modalService: BsModalService,
    private cd: ChangeDetectorRef) {
    this.currentUser = this.authService.user;
  }

  ngOnInit() {

    const isAnonymous = this.currentUser == null;

    this.form = this.formBuilder.group({
      files: [null, [Validators.required]],
      sender: [{
        value: this.currentUser?.email || null,
        disabled: this.currentUser != null
      }, listValidatorsEmail],
      isAnonymous: [isAnonymous],
      recipients: [['h2qbkhn@gmail.com'], [Validators.required]],
      message: [null],
      action: [SendActions.SendEmail, Validators.required],
      password: [null],
    });

    this.form.controls.action.valueChanges.pipe(takeUntil(this._destroyed)).subscribe(action => {
      this.onActionChanged(action);
    });

  }

  onRemovedfile(event: any) {
    this.fileErrorMessage = '';
    if (this.fileList.length == 0) {
      this.form.controls.files.setValue(null);
    }
  }

  onFileSelected(event: FileList) {
    if (event[0] != null && (<any>event[0]).status != 'error') {
      this.fileErrorMessage = '';
      this.form.patchValue({files: event[0]});
    }
  }

  reset() {
    this.submitted = false;
    this.form.reset({
      sender: {
        value: this.currentUser?.email || null,
        disabled: this.currentUser != null
      },
      action: SendActions.SendEmail
    });
    this.dropzoneCmp.directiveRef.reset();
  }

  tryTransfer() {
    const data = this.form.getRawValue();
    const needVerifySender = data.isAnonymous && data.action == SendActions.SendEmail;
    if (needVerifySender) {
      this.openModalVerifySender();
    } else {
      this.openModalTransfer();
    }
  }

  openModalVerifySender() {
    const data = this.form.getRawValue();
    const modalRef = this.modalService.show(ModalVerifySenderComponent, <ModalOptions<any>>
      {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'home-modal-verify-sender',
        initialState: {
          data: data
        }

      }
    );

    modalRef.onHidden.subscribe((res) => {
      if (modalRef.content.isOk) {
        this.openModalTransfer();
      }
    })
  }

  openModalTransfer(): void {
    this.fileErrorMessage = '';
    this.submitted = true;

    const data = this.form.getRawValue();

    this.modalRef = this.modalService.show(ModalUploadFileComponent, <ModalOptions<any>>
      {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'home-modal-progress-upload-file',
        initialState: {
          data: data
        }

      }
    );

    this.modalRef.onHidden.subscribe((res) => {
      this.reset();
      this.cd.detectChanges();
    })

  }

  private onActionChanged(action: SendActions) {
    if (action === SendActions.CopyLink) {
      this.form.controls.sender.setErrors(null);
      this.form.controls.recipients.setErrors(null);

      this.form.controls.sender.clearValidators();
      this.form.controls.recipients.clearValidators();
    } else {
      this.form.controls.sender.setValidators(listValidatorsEmail);
      this.form.controls.recipients.setValidators([Validators.required]);
    }
    this.form.controls.recipients.updateValueAndValidity({ onlySelf: false });
    this.form.controls.sender.updateValueAndValidity({ onlySelf: false });
  }

  onFileError(event: any) {
    this.fileErrorMessage = event[1];
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

}
