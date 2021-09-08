import { Component, OnInit, ViewChild } from '@angular/core';
import { DropzoneComponent } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-list-files-drive',
  templateUrl: './list-files-drive.component.html',
  styleUrls: ['./list-files-drive.component.scss']
})
export class ListFilesDriveComponent implements OnInit {

  @ViewChild('dropzone') dropzoneCmp: DropzoneComponent;

  fileToUpload: any;
  fileErrorMessage: string;

  get fileList(): FileList {
    return this.dropzoneCmp.directiveRef.dropzone().files;
  }

  constructor() { }

  ngOnInit() {

  }

  onRemovedfile(event: any) {
    this.fileErrorMessage = '';
    if (this.fileList.length == 0) {
      this.fileToUpload = null;
    }
  }

  onFileSelected(event: FileList) {
    if (event[0] != null && (<any>event[0]).status != 'error') {
      this.fileErrorMessage = '';
      this.fileToUpload = event[0];
    }
  }

  onFileError(event: any) {
    this.fileErrorMessage = event[1];
  }

  tryPin(){
    
  }

}
