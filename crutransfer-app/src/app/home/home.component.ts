import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, IFileInfo, IOrder, IpfsService, IResponse } from '@cru-transfer/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('inputFile') inputFileRef: ElementRef<any>;

  fileInfos: IFileInfo;

  form: FormGroup = new FormGroup({});

  orderId: string;

  buttonDisabled = false;
  buttonState = '';

  config = {
    url: 'https://httpbin.org/post',
    thumbnailWidth: 160,
    // tslint:disable-next-line: max-line-length
    previewTemplate: '<div class="dz-preview dz-file-preview mb-3"><div class="d-flex flex-row "><div class="p-0 w-30 position-relative"><div class="dz-error-mark"><span><i></i></span></div><div class="dz-success-mark"><span><i></i></span></div><div class="preview-container"><img data-dz-thumbnail class="img-thumbnail border-0" /><i class="simple-icon-doc preview-icon" ></i></div></div><div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"><div><span data-dz-name></span></div><div class="text-primary text-extra-small" data-dz-size /><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div><a href="#/" class="remove" data-dz-remove><i class="glyph-icon simple-icon-trash"></i></a></div>'
  };


  constructor(private ipfsService: IpfsService, private apiService: ApiService,
    private formBuilder: FormBuilder) { }


  ngOnInit() {

    this.form = this.formBuilder.group({
      fileSrc: [null, Validators.required],
      sender: [null, Validators.required],
      message: [null],
      option: [0, Validators.required],
      password: [null, Validators.required],
    });

    this.ipfsService.progress$.subscribe((data) => {
      console.log('progress', data);
    })
  }

  async onFileSelected(event) {

    if (event.target.files.length > 0) {
      const selectedFile: File = event.target.files[0];
      this.form.patchValue({
        fileSrc: selectedFile
      })
    }
    this.inputFileRef.nativeElement.value = '';
  }

  async onSubmit() {
    if (this.form.valid) {
      const selectedFile = this.form.controls['fileSrc'].value;
      console.log('selected file', selectedFile);
      const fileInfos = await this.ipfsService.addFileToIpfsAndSendTx(selectedFile);

      const order = <IOrder>{
        ...this.form.value,
        fileInfos: fileInfos
      };
      delete (<any>order).fileSrc;
      this.saveOrder(order);
    }
  }


  saveOrder(order: IOrder) {
    console.log('save order', order);
    this.apiService.addOrder(order).subscribe((resp: IResponse) => {
      console.log('add user ok', resp);
      this.orderId = resp.payload._id;
    }, err => {
      console.error('error', err);
    })
  }


}
