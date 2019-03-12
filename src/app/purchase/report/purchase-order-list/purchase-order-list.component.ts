import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { PurchasingOrderService } from '../../share/purchasing-order.service';
import { BudgetTypeService } from '../../share/budget-type.service';
import { AlertService } from 'app/alert.service';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { HtmlPreviewComponent } from 'app/helper/html-preview/html-preview.component';
import { GenericTypeService } from '../../share/generic-type.service';
@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit {

  @ViewChild('htmlPreview') public htmlPreview: HtmlPreviewComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent;

  genericTypes = [];
  purchaseOrder = [];

  startDate: any;
  endDate: any;
  token: any;
  start_id: any;
  end_id: any;
  genericTypeId: any;
  dataYear = [];
  yearPO: any;
  all = false
  status_po = 'ALL';


  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  }

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private purchasingOrderService: PurchasingOrderService,
    private alertService: AlertService,
    private genericTypeService: GenericTypeService
  ) {
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
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

    const year = moment().get('year');
    const month = moment().get('month') + 1;
    if (month >= 10) {
      this.yearPO = year + 1;
    } else {
      this.yearPO = year;
    }
    this.getGenericTypes();
    for (let i = -1; i < 5; i++) {
      this.dataYear.push({
        yearText: (((year - i) + 543).toString()).substring(2, 4),
        year: year - i
      })
    }
  }

  async getGenericTypes() {
    try {
      const rs: any = await this.genericTypeService.all();
      if (rs.ok) {
        this.genericTypes = rs.rows;
        this.genericTypeId = this.genericTypes[0].generic_type_id;
        this.getPo(this.genericTypeId);
      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async changeType() {
    this.getPo(this.genericTypeId);
  }

  async getPo(genericTypeId: any) {
    this.modalLoading.show();
    try {
      const startDate = `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}`;
      const endDate = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`;
      const rs: any = await this.purchasingOrderService.getOrderList(genericTypeId, startDate, endDate);
      if (rs.ok) {
        this.purchaseOrder = rs.rows;
        this.modalLoading.hide();
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async printProduct() {
    let startDate: any;
    if (this.all) {
      startDate = `2017-1-1`;
    } else {
      startDate = `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}`;
    }
    const endDate = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`;
    const url = `${this.apiUrl}/report/purchasing-list?startDate=${startDate}&endDate=${endDate}&genericTypeId=${this.genericTypeId}&token=${this.token}`;
    this.htmlPreview.showReport(url);
  }

  async exportExcel() {
    let startDate: any;
    if (this.all) {
      startDate = `2017-1-1`;
    } else {
      startDate = `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}`;
    }
    const endDate = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`;
    const url = `${this.apiUrl}/report/purchasing-list/excel?startDate=${startDate}&endDate=${endDate}&genericTypeId=${this.genericTypeId}&token=${this.token}`;
    window.open(url, '_blank');
  }

  onDateStartChanged(e) {
    console.log(e);
    this.startDate = e;
    this.getPo(this.genericTypeId);

  }

  onDateEndChanged(e) {
    console.log(e);
    this.endDate = e;
    this.getPo(this.genericTypeId);
  }

  async printProductPo() {
    if (this.start_id && this.end_id) {
      try {
        const rs: any = await this.purchasingOrderService.getPOid(this.start_id, this.end_id, this.genericTypeId, this.status_po, this.yearPO);
        if (rs.ok) {
          const Sid = rs.rows[0].po_id
          const Eid = rs.rows[rs.rows.length - 1].po_id
          const url = `${this.apiUrl}/report/purchasing-list/byPO?Sid=${Sid}&Eid=${Eid}&genericTypeId=${this.genericTypeId}&token=${this.token}`;
          this.htmlPreview.showReport(url);
        } else {
          this.alertService.error(rs.error);
        }

      } catch (error) {
        this.alertService.error('ไม่พบเลขที่ใบสั่งซื้อ');
      }
    }
  }
  async exportExcelPo() {
    if (this.start_id && this.end_id) {
      try {
        const rs: any = await this.purchasingOrderService.getPOid(this.start_id, this.end_id, this.genericTypeId, this.status_po, this.yearPO);
        if (rs.ok) {
          const Sid = rs.rows[0].po_id
          const Eid = rs.rows[rs.rows.length - 1].po_id
          const url = `${this.apiUrl}/report/purchasing-list/byPO/excel?Sid=${Sid}&Eid=${Eid}&genericTypeId=${this.genericTypeId}&token=${this.token}`;
          window.open(url, '_blank');
        } else {
          this.alertService.error(rs.error);
        }

      } catch (error) {
        this.alertService.error('ไม่พบเลขที่ใบสั่งซื้อ');
      }
    }
  }
}
