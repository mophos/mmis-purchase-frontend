import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AlertService } from './../../alert.service';
import { UsersService } from './../../users.service';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  public env: any;
  collapsible = true;
  collapsed = true;
  fullname: string;
  rights: any;
  Purchasing = false;
  Planning = false;
  Inventory = false;
  InventoryWarehouse = false;
  Materials = false;
  Contracts = false;
  Administrator = false;

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
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    const accessRight = decodedToken.accessRight;
    this.rights = accessRight.split(',');
  }

  logout() {
    sessionStorage.removeItem('token');
    location.href = this.homeUrl;
  }

  ngOnInit() {
    this.env = {
      purchasingUrl: environment.purchasingUrl,
      planningUrl: environment.planningUrl,
      inventoryUrl: environment.inventoryUrl,
      materialsUrl: environment.materialsUrl,
      reportUrl: environment.reportUrl,
      umUrl: environment.umUrl,
      contractsUrl: environment.contractsUrl
    };
    this.Purchasing = _.indexOf(this.rights, 'PO_ADMIN') === -1 ? false : true;
    this.Planning = _.indexOf(this.rights, 'BM_ADMIN') === -1 ? false : true;
    this.Inventory = _.indexOf(this.rights, 'WM_ADMIN') === -1 ? false : true;
    this.InventoryWarehouse = _.indexOf(this.rights, 'WM_WAREHOUSE_ADMIN') === -1 ? false : true;
    this.Materials = _.indexOf(this.rights, 'MM_ADMIN') === -1 ? false : true;
    this.Contracts = _.indexOf(this.rights, 'CM_ADMIN') === -1 ? false : true;
    this.Administrator = _.indexOf(this.rights, 'UM_ADMIN') === -1 ? false : true;
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
