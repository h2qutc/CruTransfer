import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, IFileInfo, IOrder, IpfsService } from '@cru-transfer/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('inputFile') inputFileRef: ElementRef<any>;

  fileInfos: IFileInfo;

  form: FormGroup = new FormGroup({});


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

  async transfer() {
    if (this.form.valid) {
      const selectedFile = this.form.controls['fileSrc'].value;
      console.log('selected file', selectedFile);
      const fileInfos = await this.ipfsService.addFileToIpfsAndSendTx(selectedFile);

      const order = <IOrder>{
        ...this.form.value,
        fileInfos: fileInfos
      };

      this.saveOrder(order);
    }
  }


  saveOrder(order: IOrder) {
    console.log('save order', order);
  }


}
