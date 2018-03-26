import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { GenericTypeService } from '../../share/generic-type.service';
import { PurchasingOrderService } from '../../share/purchasing-order.service';
import { log } from 'util';
import { decode } from 'punycode';
import { AlertService } from 'app/alert.service';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { HtmlPreviewComponent } from 'app/helper/html-preview/html-preview.component';

@Component({
  selector: 'po-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit {

  @ViewChild('htmlPreview') public htmlPreview: HtmlPreviewComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent

  genericType = [];
  purchaseOrder = [];

  generic_type_id: any;

  constructor(
    private genericTypeService: GenericTypeService,
    private purchasingOrderService: PurchasingOrderService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getPo(this.generic_type_id);
    this.getGenericType();
  }

  async getGenericType() {
    try {
      const rs: any = await this.genericTypeService.all();
      if (rs.ok) {
        this.genericType = rs.rows;
        this.generic_type_id = this.genericType[0].generic_type_id;
      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async changeType() {

  }

  async getPo(generic_type_id: any) {
    try {
      const rs: any = await this.purchasingOrderService.getOrderList(generic_type_id);
      if (rs.ok) {
        this.purchaseOrder = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    }
    catch (error) {
      this.alertService.error(error.message);
    }
  }
}