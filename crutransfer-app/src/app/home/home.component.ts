import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IFileInfo, IpfsService } from '@cru-transfer/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('inputFile') inputFileRef: ElementRef<any>;

  cid: string;
  infos: IFileInfo;

  constructor(private ipfsService: IpfsService) { }


  ngOnInit() {

  }

  async onFileSelected(event) {

    const fileContent: File = event.target.files[0];

    if (fileContent) {
      console.log('selected file', fileContent);
      this.infos = await this.ipfsService.addFileToIpfsAndSendTx(fileContent);
    }
    this.inputFileRef.nativeElement.value = '';
  }


  async loadFile() {
    console.log('load file');
  }


}
