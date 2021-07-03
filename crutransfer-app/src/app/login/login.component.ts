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
    this.apiService.signin(email, password).subscribe((resp) => {
      console.log('login', resp);
      this.authService.accessToken = resp.payload.accessToken;
      this.router.navigate(['home']);
    })
  }

  signup() {
    const { username, email, password } = this.form.value;
    this.apiService.signup(username, email, password).subscribe((resp) => {
      console.log('signup', resp);
      this.router.navigate(['login']);
    })
  }



}
