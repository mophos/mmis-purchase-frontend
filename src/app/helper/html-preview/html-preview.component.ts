import { Component, OnInit, Input, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PurchasingOrderService } from '../../purchase/share/purchasing-order.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-html-preview',
  templateUrl: './html-preview.component.html',
  styleUrls: ['./html-preview.component.css']
})
export class HtmlPreviewComponent implements OnInit {
  startDate: any;
  endDate: any;

  urlReport: any;
  reportURL: any;
  isShow = false;
  token: any;
  constructor(
    private santizer: DomSanitizer,
    private model: PurchasingOrderService,
    @Inject('API_URL') public url: String
  ) {
    this.token = sessionStorage.getItem('token');
  }

  showReport(url: any) {
    this.isShow = true;
    this.reportURL = this.santizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.getSysReport();
  }

  async getSysReport() {
    let rs = await this.model.sysReport();
    this.urlReport = rs.rows.report_url;
  }

  printPurchaseOrder(row: any) {
    console.log(this.urlReport)
    this.showReport(this.url + `${this.urlReport}/?token=${this.token}&purchaOrderId=` + row.purchase_order_id);
  }
  printpPurchasing(row: any) {
    const created_date = row.created_date.substring(0, 10);
    this.showReport(this.url + `/report/purchasing/${created_date}/${created_date}?token=${this.token}`);
  }

  printRequistionSingburi(row: any) {
    this.showReport(this.url + `/report/purchasing/10?purchaOrderId=${row.purchase_order_id}&type=8&bgtype=1&token=${this.token}`);
  }

  printRequistion(row: any) {
    const id = row.purchase_method;
    const forms: Array<any> = [
      { 'id': 1, 'name': 'บันทึกข้อความขอซื้อเวชภัณฑ์ (คัดเลือก)', path: this.url + `/report/requisition?purchase_order_id=${row.purchase_order_id}&type=1&token=${this.token}` },
      { 'id': 2, 'name': 'บันทึกข้อความขอซื้อเวชภัณฑ์ (เจาะจง ข.)', path: this.url + `/report/requisition?purchase_order_id=${row.purchase_order_id}&type=21&token=${this.token}` },
      { 'id': 3, 'name': 'บันทึกข้อความขอซื้อเวชภัณฑ์ (เจาะจง ค.)', path: this.url + `/report/requisition?purchase_order_id=${row.purchase_order_id}&type=22&token=${this.token}` },
      { 'id': 4, 'name': 'บันทึกข้อความขอซื้อเวชภัณฑ์ (เจาะจง ซ.)', path: this.url + `/report/requisition?purchase_order_id=${row.purchase_order_id}&type=23&token=${this.token}` },
      { 'id': 5, 'name': 'บันทึกข้อความขอซื้อเวชภัณฑ์ (เชิญชวน)', path: this.url + `/report/requisition?purchase_order_id=${row.purchase_order_id}&type=3&token=${this.token}` }
    ];
    const print = _.find(forms, { 'id': id });
    this.showReport(print ? print.path : this.url + '/report/purchasing/3?purchaOrderId=' + row.purchase_order_id);
  }

  printReportItems(id: string, order_id: string) {
    const forms: Array<any> = [
      { 'id': '1', 'name': 'บันทึกข้อความขอความ (สิงห์บุรี)', path: this.url + `/report/purchasing/10/?purchaOrderId=${order_id}&type=8&bgtype=1&token=${this.token}` },
      { 'id': '2', 'name': 'ใบสั่งซื้อ (สิงห์บุรี)', path: this.url + `/report/purchasingorder/?orderId=${order_id}&token=${this.token}` },
      { 'id': '3', 'name': 'ใบองค์การเภสัชกรรม (สิงห์บุรี)', path: this.url + `/report/purchasing/11/?purchaOrderId=${order_id}&type=8&bgtype=1&token=${this.token}` },
      { 'id': '4', 'name': 'ใบสั่งซื้อที่เลือก (สิงห์บุรี)', path: this.url + `/report/getporder?token=${this.token}` },
      { 'id': '5', 'name': 'แบบฟอ์รม e-GP', path: this.url + `/report/allpo/egp/singburi?porder=${order_id}&type=8&token=${this.token}` },
    ];
    const print = _.find(forms, { 'id': id });
    this.showReport(print ? print.path : this.url);
  }

  printRequistion_(row: any) {
    this.printReportItems('1', row.purchase_order_id);
  }

  printPurchaseOrder_(row: any) {
    this.printReportItems('2', row.purchase_order_id);
  }

  printPurchaseOrderAttach(row: any) {
    this.printReportItems('3', row.purchase_order_id);
  }
  printPurchaseOrderEgp(row: any) {
    this.printReportItems('5', row.purchase_order_id);
  }
}