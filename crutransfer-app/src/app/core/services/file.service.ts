import { Injectable } from '@angular/core';
import { IFileInfo } from '../models';

@Injectable()
export class FileService {

  constructor() { }

  createAndDownloadBlobFile(body: any, fileInfos: IFileInfo) {
    const blob = new Blob([body], {type: fileInfos.type});
    const fileName = fileInfos.name;
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}
