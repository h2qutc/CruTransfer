import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AuthService } from '@cru-transfer/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  buttonDisabled = false;
  buttonState = '';

  submitted = false;

  constructor(private apiService: ApiService,
    private router: Router,
    private notifications: NotificationsService,
    private authService: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {

      const { email } = this.form.value;

      if (!this.buttonDisabled) {

        this.buttonDisabled = true;
        this.buttonState = 'show-spinner';
        this.apiService.forgotPassword(email).subscribe((resp) => {
          this.notifications.create('Done', 'Password reset email is sent, you will be redirected to Reset Password page!',
            NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          this.buttonDisabled = false;
          this.buttonState = '';
          setTimeout(() => {
            this.authService.emailToResetPassword = email;
            this.router.navigate(['/reset-password']);
          }, 6000);
        }, (error) => {
          this.notifications.create('Error', error.error.message, NotificationType.Error,
            { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
          this.buttonDisabled = false;
          this.buttonState = '';
        });
      }
    }
  }



}
