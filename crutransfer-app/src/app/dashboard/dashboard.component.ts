import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, AuthService, IOrder, IUser } from '@cru-transfer/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('inputSearch', { static: true }) inputSearchRef: ElementRef | null = null;

  data: IOrder[] = [];
  filteredData: IOrder[] = [];

  currentUser: IUser;

  itemOrder = 'Title';
  itemOptionsOrders = ['Title', 'Category', 'Status', 'Label'];
  displayOptionsCollapsed = false;

  private _destroyed: Subject<void> = new Subject<void>();

  constructor(private api: ApiService, private authService: AuthService,
    private route: ActivatedRoute,
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
  }

  getOrders() {
    this.api.getOrdersByUser(this.currentUser.email).subscribe(data => {
      this.data = data;
      this.filteredData = data;
      console.log('data', data);
    })
  }

  goToDetail(order: IOrder) {
    console.log('detail', order);
    this.router.navigate([`/dashboard/${order._id}`]);
  }

  private resetFilter() {
    this.filteredData = [...this.data];
  }

}
