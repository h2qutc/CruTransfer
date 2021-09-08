import { Component, OnInit } from '@angular/core';
import { IDappAccount, IpfsService } from '@cru-transfer/core';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { NotificationsService } from 'angular2-notifications';
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

  constructor(private ipfsService: IpfsService,
    private notifications: NotificationsService) { }

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
    this.selectedAccountAddress = localStorage.getItem('selectedAccount');

    return this.accounts;
  }

  selectAccount(acc: any) {
    localStorage.setItem('selectedAccount', acc);
  }

  async pinToCrust() {
    const selectedAccount = this.accounts.find(x => x.address == this.selectedAccountAddress);
    const cid = "QmaMDCgjvdvHMXcXVHVN6GEgxDmekGq5b4whrusoL2NDsu";

    let isSuccess = false;
    this.ipfsService.placeStorageOrderViaDapp(selectedAccount, cid, 200).then((status: any) => {
      console.log('status', status);
      if (status.isInBlock) {
        console.log(`Completed at block hash #${status.asInBlock.toString()}`);
        isSuccess = true;
      } else {
        console.log(`Current status: ${status.type}`);
      }
    }, err => {
      this.notifications.error('Error', err?.message);
      console.error('error', err);
    })
  }



}