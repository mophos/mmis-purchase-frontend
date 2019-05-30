import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { LoginService } from '../login.service';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username: string;
  password: string;
  jwtHelper: JwtHelper = new JwtHelper();
  isLogging = false;
  warehouses = [];
  warehouseId;
  userWarehouseId;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alert: AlertService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['purchase/orders']);
    }
  }

  enterLogin(event) {
    // enter login
    if (event.keyCode === 13) {
      this.doLogin();
    }
  }

  doLogin() {
    this.isLogging = true;
    this.loginService.doLogin(this.username, this.password, this.userWarehouseId)
      .then((res: any) => {

        const decodedToken = this.jwtHelper.decodeToken(res.token);
        const fullname = `${decodedToken.fullname}`;

        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('fullname', fullname);
        // hide spinner
        this.isLogging = false;
        // redirect to admin module
        this.router.navigate(['purchase/order-point']);
      })
      .catch((error) => {
        this.isLogging = false;
        //this.alert.error(JSON.stringify(error));
        this.alert.error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
      });
  }

  async selectWarehouse(event) {
    const rs: any = await this.loginService.searchWarehouse(this.username);
    if (rs.ok) {
      this.warehouses = rs.rows;
      this.userWarehouseId = rs.rows[0].user_warehouse_id;
    } else {
      this.warehouses = [];
      this.userWarehouseId = null;
    }
  }

}
