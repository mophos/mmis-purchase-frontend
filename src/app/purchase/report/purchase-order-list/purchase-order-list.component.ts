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
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent;

  genericType = [];
  purchaseOrder = [];

  startDate: any;
  endDate: any;
  token: any;

  generic_type_id: any;

  
  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  }

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private genericTypeService: GenericTypeService,
    private purchasingOrderService: PurchasingOrderService,
    private alertService: AlertService
  ) {
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    this.getGenericType();

    const date = new Date();

    this.startDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 1
      }
    };
    this.endDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
  }

  async getGenericType() {
    try {
      const rs: any = await this.genericTypeService.all();
      if (rs.ok) {
        this.genericType = rs.rows;
        this.generic_type_id = this.genericType[0].generic_type_id;
        this.getPo(this.generic_type_id);
      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async changeType() {
    this.getPo(this.generic_type_id);
  }

  async getPo(generic_type_id: any) {
    this.modalLoading.show();
    try {
      const rs: any = await this.purchasingOrderService.getOrderList(generic_type_id);
      if (rs.ok) {
        this.purchaseOrder = rs.rows;
        this.modalLoading.hide();
      } else {
        this.alertService.error(rs.error);
      }
    }
    catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async printProduct() {
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;

    const url = `${this.apiUrl}/report/purchasing-list/${startDate}/${endDate}?token=${this.token}`;
    console.log(url);
    this.htmlPreview.showReport(url);
  }
}