import { Component, OnInit } from "@angular/core";
import { IpfsService } from "./core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crutransfer-app';

  constructor(private ipfsService: IpfsService) {

  }

  async ngOnInit() {
    await this.ipfsService.init();
  }


}
