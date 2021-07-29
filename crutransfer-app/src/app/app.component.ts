import { Component, OnInit, Renderer2 } from "@angular/core";
import { from } from "rxjs";
import { IpfsService, LangService } from "./core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crutransfer-app';

  loading = false;

  constructor(private ipfsService: IpfsService,
    private langService: LangService, private renderer: Renderer2) {

  }

  ngOnInit() {
    this.langService.init();

    const ipfsReady$ = from(this.ipfsService.init());
    ipfsReady$.subscribe(() => {
      console.log('IPFS and Crust Network is ready');
      this.loading = true;
    })

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'show');
    }, 1000);
    setTimeout(() => {
      this.renderer.addClass(document.body, 'default-transition');
    }, 1500);
  }

}
