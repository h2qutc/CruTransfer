import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AuthService } from '@cru-transfer/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

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
      password: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted = true;

      const { email, password } = this.form.value;

      if (!this.buttonDisabled) {

        this.buttonDisabled = true;
        this.buttonState = 'show-spinner';
        this.apiService.signIn(email, password).subscribe((resp) => {
          this.authService.accessToken = resp.payload.accessToken;
          this.authService.user = resp.payload;

          this.router.navigate(['home']);
        }, (error) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.error('Error', error.error.message, NotificationType.Error, {
            theClass: 'primary',
            timeOut: 3000,
            showProgressBar: false
          });
        });
      }
    }
  }



}
