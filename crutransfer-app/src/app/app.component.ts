import { Component, OnInit } from "@angular/core";
import { from, Observable } from "rxjs";
import { IpfsService } from "./core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crutransfer-app';

  loading = false;

  constructor(private ipfsService: IpfsService) {

  }

  ngOnInit() {
    const ipfsReady$ = from(this.ipfsService.init());
    ipfsReady$.subscribe(() => {
      console.log('IPFS and Crust Network is ready');
      this.loading = true;
    })

  }


}
