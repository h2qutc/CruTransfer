import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AuthService } from '@cru-transfer/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  buttonDisabled = false;
  buttonState = '';

  emailModel = 'demo@vien.com';
  passwordModel = 'demovien1122';

  constructor(private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  signin() {
    const { email, password } = this.form.value;
    this.apiService.signIn(email, password).subscribe((resp) => {
      console.log('login', resp);
      this.authService.accessToken = resp.payload.accessToken;

      this.authService.user = resp.payload;;
      this.router.navigate(['home']);
    })
  }

  signup() {
    const { username, email, password } = this.form.value;
    this.apiService.signUp(username, email, password).subscribe((resp) => {
      console.log('signup', resp);
      this.router.navigate(['login']);
    })
  }

  onSubmit(): void {
    if (this.form.valid) {

      const { email, password } = this.form.value;

      if (this.buttonDisabled) {

        this.buttonDisabled = true;
        this.buttonState = 'show-spinner';
        this.apiService.signIn(email, password).subscribe((resp) => {
          this.authService.accessToken = resp.payload.accessToken;
          this.router.navigate(['home']);
        }, (error) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          // this.notifications.create('Error', error.message, NotificationType.Bare, {
          //   theClass: 'outline primary',
          //   timeOut: 6000,
          //   showProgressBar: false
          // });
        });
      }
    }
  }



}
