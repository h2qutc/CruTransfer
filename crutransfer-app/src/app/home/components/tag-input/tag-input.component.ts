import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'cru-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss'],
  host: {
    class: 'cru-tag-input'
  }
})
export class CruTagInputComponent implements OnInit {

  listValidatorsEmail = [Validators.required, Validators.email];

  @Input() control: FormControl;

  focused = false;

  constructor() { }

  ngOnInit() {
  }

  onValidationError(event: any) {
    console.log('onEmailToValidationError', event);
  }


  onAdd(event: any) {
    console.log('onAdd', event, this.control.value);

  }

  onRemove(event: any) {
    console.log('onRemove', event);
  }

  onFocus(event: any) {
    console.log('onFocus', event);
    this.focused = true;
  }

  onBlur(event: any) {
    console.log('onBlur', event);
    this.focused = false;
  }

}
