import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AuthService } from '@cru-transfer/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

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
      email: [{
        value: this.authService.emailToResetPassword,
        disabled: true
      }],
      code: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {

      const { email, code, password } = this.form.getRawValue();

      if (!this.buttonDisabled) {
        this.buttonDisabled = true;
        this.buttonState = 'show-spinner';
        this.apiService.resetPassword(email, code, password).subscribe((resp) => {
          this.notifications.create(
            'Done',
            'Password reset completed, you will be redirected to Login page!',
            NotificationType.Bare,
            { theClass: 'outline primary', timeOut: 6000, showProgressBar: true }
          );
          this.buttonDisabled = false;
          this.buttonState = '';
          setTimeout(() => {
            this.authService.emailToResetPassword = null;
            this.router.navigate(['/login']);
          }, 6000);
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



}
