import { Component, Input, OnInit } from '@angular/core';
import { IDappAccount } from '@cru-transfer/core';

@Component({
  selector: 'app-card-dapp-account',
  templateUrl: './card-dapp-account.component.html',
  styleUrls: ['./card-dapp-account.component.scss']
})
export class CardDappAccountComponent implements OnInit {

  @Input() account: IDappAccount;

  constructor() { }

  ngOnInit() {
  }

}
