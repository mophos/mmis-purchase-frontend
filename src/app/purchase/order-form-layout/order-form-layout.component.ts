import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-order-form-layout',
  templateUrl: './order-form-layout.component.html',
  styleUrls: ['./order-form-layout.component.css']
})
export class OrderFormLayoutComponent implements OnInit {
  collapsible: boolean = true;
  collapsed: boolean = true;
  fullname: string;
  constructor(
    private router: Router,
    @Inject('HOME_URL') public homeUrl: string
  ) {
    this.fullname = sessionStorage.getItem('fullname');
  }
  ngOnInit() {
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');
    this.router.navigate(['login']);
  }

}
