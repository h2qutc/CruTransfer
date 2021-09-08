import { Component, OnInit } from '@angular/core';
import { IDappAccount } from '@cru-transfer/core';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { from } from 'rxjs';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {

  accounts: IDappAccount[] = [];

  extensions: any[] = null;

  selectedAccountAddress: string;

  constructor() { }

  async ngOnInit() {
    await this.connectToWallet();
  }

  async connectToWallet() {
    this.extensions = await web3Enable('CruTransfer Dapp');

    console.log('extensions', this.extensions);
    if(this.extensions.length == 0){
      this.extensions = null; 
      return;
    }
    // console.log('Acc', await (<any>this.extensions[0]).accounts.get());

    this.accounts = await web3Accounts() as IDappAccount[];

    this.selectedAccountAddress = localStorage.getItem('selectedAccount');

    return this.accounts;
  }

  selectAccount(acc: any){
    console.log('selectAccount', acc)
    localStorage.setItem('selectedAccount', acc);
  }

}