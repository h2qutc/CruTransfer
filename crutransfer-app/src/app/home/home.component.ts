import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, IFileInfo, SendActions } from '@cru-transfer/core';
import { Subject } from '@polkadot/x-rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { takeUntil } from 'rxjs/operators';
import { ModalUploadFileComponent } from './components';

const listValidatorsEmail = [Validators.required, Validators.email];

const defaultEmail = 'hqho@gmail.com';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('dropzone') dropzoneRef: ElementRef<any>;

  fileInfos: IFileInfo;

  form: FormGroup = new FormGroup({});

  orderId: string;

  submitted = false;

  sendActionsEnums = SendActions;

  modalRef: BsModalRef;


  progress: number = 10;
  progressMessage: string = 'Sending';


  get fileList(): FileList {
    return (<any>this.dropzoneRef).directiveRef.dropzone().files;
  }

  private _destroyed: Subject<any> = new Subject<any>();

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder, private modalService: BsModalService,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      fileSrc: [null, Validators.required],
      sender: [defaultEmail, listValidatorsEmail],
      recipient: [defaultEmail, listValidatorsEmail],
      message: [null],
      action: [SendActions.SendEmail, Validators.required],
      password: [null],
    });

    this.form.controls.action.valueChanges.pipe(takeUntil(this._destroyed)).subscribe(action => {
      this.onActionChanged(action);
    })

  }

  onRemovedfile(event: any) {
    if (this.fileList.length == 0) {
      this.form.controls.fileSrc.setValue(null);
    }
  }

  onFileSelected(event) {
    if (event[0] != null) {
      this.form.patchValue({
        fileSrc: event[0]
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
    if (action === SendActions.CopyLink) {
      this.form.controls.sender.setErrors(null);
      this.form.controls.recipient.setErrors(null);

      this.form.controls.sender.clearValidators();
      this.form.controls.recipient.clearValidators();
    } else {
      this.form.controls.sender.setValidators(listValidatorsEmail);
      this.form.controls.recipient.setValidators(listValidatorsEmail);
    }
    this.form.controls.recipient.updateValueAndValidity({ onlySelf: false });
    this.form.controls.sender.updateValueAndValidity({ onlySelf: false });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  sendEmail(){
    this.api.sendEmail().subscribe(data =>{
      console.log('send email ok', data);
    });
  }


}
