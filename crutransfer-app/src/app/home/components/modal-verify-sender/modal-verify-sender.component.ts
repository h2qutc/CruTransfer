import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-verify-sender',
  templateUrl: './modal-verify-sender.component.html',
  styleUrls: ['./modal-verify-sender.component.scss']
})
export class ModalVerifySenderComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  buttonDisabled = false;
  buttonState = '';

  submitted = false;

  data: any;

  code: string;
  messageError: string;

  constructor(public modalRef: BsModalRef,
    private api: ApiService,
    private notifications: NotificationsService,
    private cd: ChangeDetectorRef, private apiService: ApiService) {

  }

  ngOnInit() {

    this.sendCodeToSender();

  }


  onSubmit() {
    if (this.code) {
      this.api.verifySender(this.data.sender, this.code).subscribe((data) => {
        console.log('verifySender OK', data);
        this.messageError = '';
      }, error => {
        this.buttonDisabled = false;
        this.buttonState = '';
        this.messageError = error.error.message;
        // this.notifications.error('Error', error.error.message);
      })
    }
  }

  sendCodeToSender() {
    this.api.sendCodeToSender(this.data.sender).subscribe(() => {

    })
  }

  close() {
    this.modalRef.hide();
  }




}
