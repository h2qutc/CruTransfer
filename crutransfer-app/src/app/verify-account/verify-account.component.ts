import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, AuthService } from '@cru-transfer/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  buttonDisabled = false;
  buttonState = '';

  submitted = false;

  userId: string;
  code: string;

  hasError = false;

  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notifications: NotificationsService,
    private authService: AuthService,
    private api: ApiService) {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.code = this.route.snapshot.paramMap.get('code');
  }

  ngOnInit() {

    this.apiService.activateAccount(this.userId, this.code).subscribe((data) => {
      this.hasError = false;
    }, _ => {
      this.hasError = true;
    })

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
