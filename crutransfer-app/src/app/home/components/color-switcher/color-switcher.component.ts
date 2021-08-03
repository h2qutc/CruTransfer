import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { IOrder, OrderStatus } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { ClipboardService } from 'ngx-clipboard';
import { HomeViewService } from 'src/app/home/home-view.service';

@Component({
  selector: 'app-color-switcher',
  templateUrl: './color-switcher.component.html',
  styleUrls: ['./color-switcher.component.scss']

})
export class ColorSwitcherComponent implements OnInit {

  public OrderStatusEnum = OrderStatus;
  data: any[];

  isOpenSwitcher = false;
  toggleClass = 'theme-colors';

  constructor(private renderer: Renderer2, private homeViewService: HomeViewService,
    private notifications: NotificationsService, private clipboardService: ClipboardService,
    private cd: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.homeViewService.orders$.subscribe((data) => {
      console.log('menu', this.data)
      this.data = data;
      this.cd.detectChanges();
    })
  }

  toggleSwitcher(event): void {
    this.isOpenSwitcher = !this.isOpenSwitcher;
    this.toggleClass = this.isOpenSwitcher
      ? 'theme-colors shown'
      : 'theme-colors hidden';
    event.stopPropagation();
  }

  copyLink(order: IOrder) {
    this.clipboardService.copy(order.link);
    this.notifications.success('Success', 'This link has been copied to your clipboard!');
  }

  onClickOutside(): void {
    this.isOpenSwitcher = false;
    this.toggleClass = 'theme-colors hidden';
  }
}
