import { Component, OnInit } from '@angular/core';
import { ApiService, AuthService, IUser } from '@cru-transfer/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: any[] = [];

  currentUser: IUser;

  constructor(private api: ApiService, private authService: AuthService) { 
    this.currentUser = this.authService.user;
  }

  ngOnInit() {
    this.getOrders();
  }

  getOrders(){
    this.api.getOrdersByUser(this.currentUser.email).subscribe(data => {
      this.data = data.payload;
      console.log('data', data);
    })
  }

}
