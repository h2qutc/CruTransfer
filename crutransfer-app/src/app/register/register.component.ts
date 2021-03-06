import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, AuthService } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  buttonDisabled = false;
  buttonState = '';

  submitted = false;
  success = false;

  constructor(private apiService: ApiService,
    private router: Router,
    private notifications: NotificationsService,
    private authService: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }


  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {

      const { username, email, password } = this.form.value;

      if (!this.buttonDisabled) {

        this.buttonDisabled = true;
        this.buttonState = 'show-spinner';
        this.apiService.signUp(username, email, password).subscribe((resp) => {
          this.success = true;
          // this.router.navigate(['login']);
        }, (error) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.error('Error', error.error.message);
        });
      }
    }
  }



}
