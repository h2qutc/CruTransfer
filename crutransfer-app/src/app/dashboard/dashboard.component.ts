import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, AuthService, IOrder, IUser } from '@cru-transfer/core';
import { NotificationsService } from 'angular2-notifications';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('inputSearch', { static: true }) inputSearchRef: ElementRef | null = null;

  data: IOrder[] = [];
  filteredData: IOrder[] = [];

  currentUser: IUser;

  itemOrder = 'Date';
  itemOptionsOrders = ['Date', 'Size', 'Name'];
  displayOptionsCollapsed = false;

  loading = false;

  private _destroyed: Subject<void> = new Subject<void>();

  constructor(private api: ApiService, private authService: AuthService,
    private notifications: NotificationsService,
    private router: Router) {
    this.currentUser = this.authService.user;
  }

  ngOnInit() {
    this.getOrders();

    fromEvent(this.inputSearchRef?.nativeElement, 'keyup')
      .pipe(
        takeUntil(this._destroyed),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(_ => {
        this.checkAndLaunchSearch();
      });
  }

  ngOnDestroy(){
    this._destroyed.next();
    this._destroyed.complete();
  }

  private checkAndLaunchSearch() {
    const term = this.inputSearchRef?.nativeElement.value;
    if (term) {
      this.filteredData = this.data.filter(x => {
        if (x.fileInfos.name.toLowerCase().includes(term)) return true;
        const recipients = x.recipients.join(' ').toLowerCase();
        return recipients.includes(term);
      })
    } else {
      this.resetFilter();
    }
    this.orderBy(this.itemOrder);
  }

  getOrders() {
    this.loading = true;
    this.api.getOrdersByUser(this.currentUser.email).subscribe(data => {
      this.data = data;
      this.filteredData = data.sort(this.sortBy);
      this.loading = false;
    }, error => {
      this.notifications.error('Error', error.error.message);
      this.loading = false;
    })
  }

  goToDetail(order: IOrder) {
    this.router.navigate([`/dashboard/${order._id}`]);
  }

  orderBy(item: string) {
    this.itemOrder = item;
    this.filteredData.sort(this.sortBy);
  }

  private resetFilter() {
    this.filteredData = [...this.data];
  }

  private sortBy = (a: IOrder, b: IOrder): number => {
    const prop = this.itemOrder.toLowerCase();

    if (prop == 'date') {
      return b.createdDate.getTime() - a.createdDate.getTime();
    }
    return a.fileInfos[prop] - b.fileInfos[prop];
  }

}
