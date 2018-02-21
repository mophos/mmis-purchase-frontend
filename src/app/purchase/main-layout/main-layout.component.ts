import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { AlertService } from './../../alert.service';
import { UsersService } from './../../users.service';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  collapsible = true;
  collapsed = true;
  fullname: string;

  ChangePasswordModal = false;
  jwtHelper: JwtHelper = new JwtHelper();
  @Output('onSuccess') onSuccess = new EventEmitter<boolean>();
  password: any = '';
  password2: any;
  open = false;
  isSaving = false;

  constructor(
    private router: Router,
    @Inject('HOME_URL') public homeUrl: string,
    private userService: UsersService,
    private alertService: AlertService
  ) {
    this.fullname = sessionStorage.getItem('fullname');
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');
    this.router.navigate(['login']);
  }

  ngOnInit() {

  }
  openChangePasswordModal() {
    this.ChangePasswordModal = true;
  }

  chanagePassword() {
    this.isSaving = true;
    this.alertService.confirm('ต้องการเปลี่ยนรหัสผ่าน ใช่หรือไม่?')
      .then(() => {
        this.userService.changePassword(this.password)
          .then((rs: any) => {
            if (rs.ok) {
              this.isSaving = false;
              this.alertService.success();
              this.ChangePasswordModal = false;
              this.onSuccess.emit(true);
            } else {
              this.isSaving = false;
              this.alertService.error(rs.error);
            }
          })
          .catch((error: any) => {
            this.isSaving = false;
            this.alertService.error(error.message);
          })
      }).catch(() => { });
  }

  closeModal() {
    this.onSuccess.emit(true);
    this.ChangePasswordModal = false;
    this.password2 = '';
    this.password = '';
  }
}
