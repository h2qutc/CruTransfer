import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@cru-transfer/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  login() {
    const { email, password } = this.form.value;
    this.apiService.login(email, password).subscribe((resp) => {
      console.log('login', resp);
    })
  }


}
