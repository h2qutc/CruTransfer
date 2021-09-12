import { Component, OnInit } from '@angular/core';
import { IDappAccount } from '@cru-transfer/core';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {

  accounts: IDappAccount[] = [];

  extensions: any[] = null;

  selectedAccountAddress: string;
  selectedAccount: IDappAccount;

  constructor() { }

  async ngOnInit() {
    await this.connectToWallet();
  }

  async connectToWallet() {
    this.extensions = await web3Enable('CruTransfer Dapp');

    if (this.extensions.length == 0) {
      this.extensions = null;
      return;
    }
    // console.log('Acc', await (<any>this.extensions[0]).accounts.get());

    this.accounts = await web3Accounts() as IDappAccount[];
    this.selectedAccountAddress = localStorage.getItem('selectedAccountAddress');
    this.selectedAccount = this.accounts.find(x => x.address == this.selectedAccountAddress);

    if (!this.selectedAccount) {
      this.selectAccount(this.accounts[0]?.address);
    }

    return this.accounts;
  }

  selectAccount(accAdr: any) {
    if (!accAdr) return;
    localStorage.setItem('selectedAccountAddress', accAdr);
    this.selectedAccountAddress = accAdr;
    this.selectedAccount = this.accounts.find(x => x.address == accAdr);
  }

}