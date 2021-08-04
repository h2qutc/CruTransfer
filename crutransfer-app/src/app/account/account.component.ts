import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AuthService, IUser } from '@cru-transfer/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';

export function SamePasswordValidator() {
  return (group: FormGroup): { [key: string]: any } | null => {

    if (group.controls['newPassword'].valid) {

      let newPassword = group.controls['newPassword'].value;
      let confirmPassword = group.controls['confirmPassword'].value;

      if (newPassword !== confirmPassword) {
        return { SamePasswordValidation: true };
      } else {
        return null;
      }

    } else {
      return null;
    }
  };
}

const Password_Placeholder = "passwordpasswordpasswordpasswordpassword";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  buttonDisabled = false;
  buttonState = '';

  submitted = false;

  user: IUser;
  isEdit = false;

  constructor(private apiService: ApiService,
    private router: Router,
    private notifications: NotificationsService,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    this.user = this.authService.user;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [{ value: this.user.username, disabled: true }, [Validators.required]],
      email: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email]],
      password: [{ value: Password_Placeholder, disabled: true }, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    }, <AbstractControlOptions>{
      validator: [
        SamePasswordValidator()
      ]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {

      const { newPassword, confirmPassword } = this.form.value;

      if (!this.buttonDisabled) {

        this.buttonDisabled = true;
        this.buttonState = 'show-spinner';
        this.apiService.changePassword(this.user.email, newPassword, confirmPassword).subscribe((resp) => {
          this.notifications.success('Success', 'Your password was successfully changed!');
          this.buttonDisabled = false;
          this.buttonState = '';
          this.reset();
        }, (error) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create(
            'Error',
            error.error.message,
            NotificationType.Error,
            { theClass: 'outline primary', timeOut: 6000, showProgressBar: false }
          );
        });
      }
    }
  }


  reset() {
    this.isEdit = false;
    this.submitted = false;
    this.form.controls.newPassword.reset();
    this.form.controls.confirmPassword.reset();
  }



}
