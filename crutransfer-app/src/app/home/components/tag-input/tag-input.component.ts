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
  maxItems = 5;

  constructor() { }

  ngOnInit() {
  }

  onValidationError(event: any) {
    this.control.updateValueAndValidity();
  }


  onAdd(event: any) {
    this.control.updateValueAndValidity();
  }

  onRemove(event: any) {
    this.control.updateValueAndValidity();
  }


}
