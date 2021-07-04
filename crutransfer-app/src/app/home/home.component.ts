import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFileInfo, SendActions } from '@cru-transfer/core';
import { Subject } from '@polkadot/x-rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { ModalUploadFileComponent } from './components';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('inputFile') inputFileRef: ElementRef<any>;

  fileInfos: IFileInfo;

  form: FormGroup = new FormGroup({});

  orderId: string;

  buttonDisabled = false;
  buttonState = '';

  config = {
    url: 'https://httpbin.org/post',
    thumbnailWidth: 160,
    // tslint:disable-next-line: max-line-length
    previewTemplate: '<div class="dz-preview dz-file-preview mb-3"><div class="d-flex flex-row "><div class="p-0 w-30 position-relative"><div class="dz-error-mark"><span><i></i></span></div><div class="dz-success-mark"><span><i></i></span></div><div class="preview-container"><img data-dz-thumbnail class="img-thumbnail border-0" /><i class="simple-icon-doc preview-icon" ></i></div></div><div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"><div><span data-dz-name></span></div><div class="text-primary text-extra-small" data-dz-size /><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div><a href="#/" class="remove" data-dz-remove><i class="glyph-icon simple-icon-trash"></i></a></div>'
  };

  submitted = false;

  sendActionsEnums = SendActions;

  modalRef: BsModalRef;


  progress: number = 10;
  progressMessage: string = 'Sending';

  private _destroyed: Subject<any> = new Subject<any>();

  constructor(
    private formBuilder: FormBuilder, private modalService: BsModalService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      fileSrc: [null, Validators.required],
      sender: [null, Validators.required],
      recipient: [null, Validators.required],
      message: [null],
      action: [SendActions.SendEmail, Validators.required],
      password: [null],
    });

    this.form.controls.action.valueChanges.pipe(takeUntil(this._destroyed)).subscribe(action => {
      this.onActionChanged(action);
    })

  }

  async onFileSelected(event) {

    console.log('onFileSelected', event[0]);

    if (event[0] != null) {
      const selectedFile: File = event[0];
      this.form.patchValue({
        fileSrc: selectedFile
      })
    }
  }

  reset() {
    this.submitted = false;
    this.form.reset();
    this.form.controls.action.setValue(SendActions.SendEmail);
  }

  openModal(): void {

    this.submitted = true;

    const data = this.form.value;

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
    })

  }

  private onActionChanged(action: SendActions) {
    const validatorsEmail = [Validators.required];
    if (action === SendActions.CopyLink) {
      this.form.controls.sender.setErrors(null);
      this.form.controls.recipient.setErrors(null);

      this.form.controls.sender.clearValidators();
      this.form.controls.recipient.clearValidators();
    } else {
      this.form.controls.sender.setValidators(validatorsEmail);
      this.form.controls.recipient.setValidators(validatorsEmail);
    }

    this.form.controls.recipient.updateValueAndValidity({ onlySelf: false });
    this.form.controls.sender.updateValueAndValidity({ onlySelf: false });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }


}
