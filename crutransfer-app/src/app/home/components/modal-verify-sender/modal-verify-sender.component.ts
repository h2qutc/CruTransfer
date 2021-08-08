import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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

  isOk = false;

  constructor(public modalRef: BsModalRef,
    private cd: ChangeDetectorRef, private apiService: ApiService) {

  }

  ngOnInit() {
    this.sendCodeToSender();
  }


  onSubmit() {
    if (this.code) {
      this.apiService.verifySender(this.data.sender, this.code).subscribe((data) => {
        console.log('verifySender OK', data);
        this.messageError = '';
        this.isOk = true;
        this.close();
      }, error => {
        this.isOk = false;
        this.buttonDisabled = false;
        this.buttonState = '';
        this.messageError = error.error.message;
      })
    }
  }

  sendCodeToSender() {
    this.apiService.sendCodeToSender(this.data.sender).subscribe(() => {
    })
  }

  close() {
    this.modalRef.hide();
  }




}
