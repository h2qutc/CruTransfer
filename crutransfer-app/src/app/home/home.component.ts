import { Component, OnInit } from '@angular/core';
import { IFileInfo, IpfsService } from '@cru-transfer/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
  }


  async loadFile() {
    console.log('load file')
  }


}
