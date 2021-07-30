import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, AuthService, IOrder, IUser } from '@cru-transfer/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: any[] = [];

  currentUser: IUser;

  itemOrder = 'Title';
  itemOptionsOrders = ['Title', 'Category', 'Status', 'Label'];
  displayOptionsCollapsed = false;

  constructor(private api: ApiService, private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) {
    this.currentUser = this.authService.user;
  }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.api.getOrdersByUser(this.currentUser.email).subscribe(data => {
      this.data = data.payload;
      console.log('data', data);
    })
  }

  goToDetail(order: IOrder) {
    console.log('detail', order);
    this.router.navigate([`/dashboard/${order._id}`])
  }

}
