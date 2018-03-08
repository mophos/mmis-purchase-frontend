import { Router } from '@angular/router';
import { AccessCheck } from '../share/access-check';
import { HtmlPreviewComponent } from './../../helper/html-preview/html-preview.component';
import { PurchaseCancelComponent } from './../directives/purchase-cancel/purchase-cancel.component';
import { PurchasingOrderItemService } from './../share/purchasing-orderitem.service';
import { PurchasingOrderService } from './../share/purchasing-order.service';
import { PurchasingService } from './../share/purchasing.service';
import { AlertService } from './../../alert.service';
import { IMyOptions } from 'mydatepicker-th';
import { Component, OnInit, Inject, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { ModalReceivesComponent } from 'app/purchase/modal-receives/modal-receives.component';
import { ProductService } from './../share/product.service'
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { SettingService } from './../share/setting.service';
@Component({
  selector: 'app-datagrid-orders',
  templateUrl: './datagrid-orders.component.html',
  styleUrls: ['./datagrid-orders.component.css']
})
export class DatagridOrdersComponent implements OnInit {

  @Input() title: string;
  @Input() actionMenus: Array<any> = ['confirm', 'edit', 'print-pr', 'print-po', 'print-receive', 'copy', 'cancel'];
  @ViewChild('modalCancel') modalCancel: PurchaseCancelComponent;
  @ViewChild('htmlPrview') htmlPrview: HtmlPreviewComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent;
  @ViewChild('modalReceives') modalReceives: ModalReceivesComponent
  /**
   * @params status
   *  'PREPARED','CONFIRMED','APPROVED','COMPLETED'
   */
  @Input() genericId: string;
  productOrders: Array<any> = [];
  @Input() status: Array<any> = ['ORDERPOINT'];
  @Input() isCancel: boolean;

  query: string;
  number_start: string;
  number_end: string;
  start_id: string;
  end_id: string;
  start_date: any;
  end_date: any;
  loading: boolean;
  purchaseOrders: Array<any> = [];
  purchaseOrdersSelected: Array<any> = [];
  contractFilter: string = 'ALL';
  statusFilter: string = 'ALL';
  status_po: string = 'ALL';
  openModal: boolean = false;
  generic: any;
  generic_type_id: any;
  genericType: any;
  productType: Array<any> = [];
  settingConfig: any;
  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
  };
  genericOrders: Array<any> = [];
  modal: any = false;
  file: any;
  purchaseOrderId: any;
  generic_name: any;

  isConfirm: any;
  constructor(
    private ref: ChangeDetectorRef,
    private alertService: AlertService,
    private purchasingService: PurchasingService,
    private purchasingOrderService: PurchasingOrderService,
    private purchasingOrderItemService: PurchasingOrderItemService,
    private accessCheck: AccessCheck,
    @Inject('API_URL') public url: String,
    @Inject('DOC_URL') private docUrl: string,
    private router: Router,
    private productService: ProductService,
    private settingService: SettingService
  ) { }
  public jwtHelper: JwtHelper = new JwtHelper()
  ngOnInit() {
    this.settings();
    this.getProductType();
    this.purchaseOrders = [];
    moment.locale('th');
    this.start_date = {
      date: {
        year: moment().get('year'),
        month: moment().get('month') + 1,
        day: 1
      },
      jsdate: {
        year: moment().get('year'),
        month: moment().get('month'),
        day: 1
      }
    };
    this.end_date = {
      date: {
        year: moment().get('year'),
        month: moment().get('month') + 1,
        day: moment().get('date')
      },
      jsdate: {
        year: moment().get('year'),
        month: moment().get('month'),
        day: moment().get('date')
      }
    };
    this.getPurchaseOrders();
    this.getOrders();
  }

  handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      this.getPurchaseOrders();
    }
  }

  search() {
    this.getPurchaseOrders();
  }

  async getPurchaseOrders() {

    let result: any;
    const start_date = this.start_date !== null ? moment(this.start_date.jsdate).format('YYYY-MM-DD') : '';
    const end_date = this.end_date !== null ? moment(this.end_date.jsdate).format('YYYY-MM-DD') : '';

    let status: Array<any> = ['ORDERPOINT', 'PREPARED', 'CONFIRMED', 'APPROVED', 'SUCCESS', 'COMPLETED'];
    if (this.statusFilter === 'PREPARED') {
      this.status = ['PREPARED'];
    } else if (this.statusFilter === 'ORDERPOINT') {
      this.status = ['ORDERPOINT'];
    }
    else if (this.statusFilter === 'CONFIRMED') {
      this.status = ['CONFIRMED'];
    }
    else if (this.statusFilter === 'APPROVED') {
      this.status = ['APPROVED'];
    }
    else if (this.statusFilter === 'SUCCESS') {
      this.status = ['COMPLETED', 'SUCCESS'];
    } else {
      this.status = status;
    }

    try {
      this.modalLoading.show();
      if (this.isCancel) {
        result = await this.purchasingOrderService.isCancel();
      } else {
        result = await this.purchasingOrderService.byStatus(
          this.status,
          this.contractFilter,
          this.query,
          start_date,
          end_date,
          this.number_start,
          this.number_end);
      }

      this.modalLoading.hide();

      this.purchaseOrders = result.rows;
    } catch (error) {
      this.alertService.error(error);
      this.modalLoading.hide();
    }
  }

  async confirm(order: any) {
    let purchases = [];
    if (this.accessCheck.confirm('PO_CONFIRM')) {
      if (order.purchase_order_status !== "ORDERPOINT" && order.is_cancel !== 'Y') {
        if (this.canUpdateStatus(order.purchase_order_status, 'CONFIRMED')) {
          let data = {
            purchase_order_id: order.purchase_order_id,
            purchase_order_status: 'CONFIRMED',
            from_status: order.purchase_order_status
          }
          purchases.push(data);
        }
      }
      if (purchases.length) {
        try {
          this.modalLoading.show();
          let rs: any = await this.purchasingOrderService.updateStatus(purchases);
          this.purchaseOrdersSelected = [];
          if (rs.ok) {
            this.alertService.success();
            this.getPurchaseOrders();
          } else {
            this.alertService.error(rs.error);
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          this.purchaseOrdersSelected = [];
          this.alertService.error(JSON.stringify(error))
        }
      } else {
        this.alertService.error('ไม่พบรายการที่ต้องการยืนยัน')
      }
    } else {
      this.alertService.error('ไม่มีสิทธิ์ยืนยันใบสั่งซื้อ');
    }
  }

  async approve(order: any) {
    let purchases = [];
    if (this.accessCheck.confirm('PO_APPROVE')) {
      if (order.purchase_order_status !== "ORDERPOINT" && order.is_cancel !== 'Y') {
        if (this.canUpdateStatus(order.purchase_order_status, 'APPROVED')) {
          let data = {
            purchase_order_id: order.purchase_order_id,
            purchase_order_status: 'APPROVED',
            from_status: order.purchase_order_status
          }
          purchases.push(data);
        }
      }

      if (purchases.length) {
        this.modalLoading.show();
        try {
          let rs: any = await this.purchasingOrderService.updateStatus(purchases);
          this.purchaseOrdersSelected = [];
          this.modalLoading.hide();
          if (rs.ok) {
            this.alertService.success();
            this.getPurchaseOrders();
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.modalLoading.hide();
          this.purchaseOrdersSelected = [];
          this.alertService.error(JSON.stringify(error))
        }
      } else {
        this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ')
      }
    } else {
      this.alertService.error('ไม่มีสิทธิ์อนุมัติใบสั่งซื้อ');
    }
  }

  async confirmAll(type: string) {
    let promise: Array<any> = [];
    const message: string = (type === 'CONFIRMED' ?
      'คุณต้องการที่จะยืนยันใบสั่งซื้อใช่หรือไม่' :
      'คุณต้องการที่จะอนุมัติใบสั่งซื้อใช่หรือไม่');

    let dataConfirm = [];
    if (this.accessCheck.confirm(type === 'CONFIRMED' ? 'PO_CONFIRM' : 'PO_APPROVE')) {
      this.alertService.confirm(message).then(async () => {
        this.purchaseOrdersSelected.forEach(element => {
          if (element.purchase_order_status !== "ORDERPOINT" && element.is_cancel !== 'Y') {
            if (this.canUpdateStatus(element.purchase_order_status, type)) {
              if (this.getConfirmData(type, element) !== false) {
                const data: any = this.getConfirmData(type, element);
                dataConfirm.push(data);
              }
            }
          }

        });

        if (dataConfirm.length) {
          try {
            let rs: any = await this.purchasingOrderService.updateStatus(dataConfirm);
            this.purchaseOrdersSelected = [];
            if (rs.ok) {
              this.alertService.success();
              this.getPurchaseOrders();
            } else {
              this.alertService.error(rs.error);
            }
          } catch (error) {
            this.purchaseOrdersSelected = [];
            this.alertService.error(JSON.stringify(error))
          }
        } else {
          this.alertService.error('ไม่พบรายการที่ต้องการ');
        }

      })
        .catch(() => { });

    } else if (!this.accessCheck.confirm('PO_CONFIRM') && type === 'CONFIRMED') {
      this.alertService.error('คุณไม่มีสิทธ์ในการยืนยัน!', 'Access denied!');
    } else {
      this.alertService.error('คุณไม่มีสิทธ์ในการอนุมัติ!', 'Access denied!');
    }
  }

  canUpdateStatus(currentStatus: string, updateStatus: string) {
    if (currentStatus === 'PREPARED') {
      if (_.indexOf(['CONFIRMED', 'APPROVED'], updateStatus) > -1) {
        // console.log(updateStatus)
        return true;
      }
    } else if (currentStatus === 'CONFIRMED') {
      if (_.indexOf(['APPROVED'], updateStatus) > -1) {
        // console.log(updateStatus)
        return true;
      }
    }
    return false;
  }

  getConfirmData(type: string, po: any) {
    if (type === 'CONFIRMED') {
      return {
        purchase_order_id: po.purchase_order_id,
        from_status: po.purchase_order_status,
        purchase_order_status: 'CONFIRMED',
        confirmed_date: moment().format('YYYY-MM-DD HH:mm:ss')
      };
    } else if (type === 'APPROVED') {
      return {
        purchase_order_id: po.purchase_order_id,
        from_status: po.purchase_order_status,
        purchase_order_status: 'APPROVED',
        approved_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        //approved_by:1
      };
    }
    return false;
  }

  menuIsActive(name: string) {
    return this.actionMenus.includes(name);
  }

  cancle(data: any) {
    // PO_CANCEL,PO_CANCEL_AFFTER_APPROVE
    if (data.purchase_order_status === 'APPROVED') {
      if (this.accessCheck.confirm('PO_CANCEL_AFFTER_APPROVE')) {
        this.modalCancel.onOpen(data);
      } else {
        this.alertService.error('คุณไม่มีสิทธิ์ในการยกเลิก');
      }
    } else {
      if (this.accessCheck.confirm('PO_CANCEL')) {
        this.modalCancel.onOpen(data);
      } else {
        this.alertService.error('คุณไม่มีสิทธิ์ในการยกเลิก');
      }
    }

  }

  getStatusLabel(po: any, type: string = 'label') {
    let label: string;
    let color: string;
    switch (po.purchase_order_status) {
      case 'ORDERPOINT':
        label = 'ก่อนเตรียมใบสั่งซื้อ';
        color = ' text-red';
        break;
      case 'PREPARED':
        label = 'เตรียมใบสั่งซื้อ';
        color = ' text-warning';
        break;
      case 'CONFIRMED':
        label = 'ยืนยันการสั่งซื้อ';
        color = 'text-info';
        break;
      case 'APPROVED':
        label = 'อนุมัติใบสั่งซื้อ';
        color = 'text-success';
        break;
      case 'COMPLETED':
        label = 'รับเข้าคลัง';
        color = 'text-muted';
        break;
      case 'COMPLETED':
        label = 'ยกเลิก';
        color = 'text-danger';
        break;
      default:
        label = 'Error! ไม่ได้ระบุสถานะ';
        color = 'is-solid text-danger';
        break;
    }
    return type === 'color' ? color : label;
  }

  onAfterCancel(event: Event) {
    this.getPurchaseOrders();
  }

  // getStatusTextCancel(pro: any) {
  //   return pro.is_cancel === 'Y' ? '' : '';
  // }

  btnEditIsActive(pro: any) {
    if (pro.purchase_order_status === 'COMPLETED' || pro.purchase_order_status === 'APPROVED') {
      return false;
    } else {
      return true;
    }
  }

  btnCancelIsActive(pro: any) {
    if (pro.purchase_order_status === 'COMPLETED' || pro.is_cancel === 'Y' || pro.recieve_count > 0) {
      return false;
    } else {
      return true;
    }
  }

  checkEmptyData(pro: any) {
    if (!pro.budgettype_id) {
      return false;
    }
    if (!pro.budget_detail_id) {
      return false;
    }
    if (!pro.purchase_type_id) {
      return false;
    }
    if (!pro.purchase_method_id) {
      return false;
    }
    if (!pro.buyer_id) {
      return false;
    }
    if (!pro.chief_id) {
      return false;
    }
    if (!pro.verify_committee_id) {
      return false;
    }
    if (pro.total_price < 0) {
      return false;
    }
  }

  btnConfirmIsActive(pro: any) {

    if (this.checkEmptyData(pro) === false) {
      return false;
    }
    if(!this.isConfirm){
      return false;
    }
    if (pro.purchase_order_status === 'COMPLETED'
      || pro.purchase_order_status === 'CONFIRMED'
      || pro.purchase_order_status === 'APPROVED'
      || pro.is_cancel === 'Y') {
      return false;
    } else {
      return true;
    }
  }

  btnApproveIsActive(pro: any) {

    if (this.checkEmptyData(pro) === false) {
      return false;
    }
    if(this.isConfirm && pro.purchase_order_status !== 'CONFIRMED'){
      return false;
    }
    if (pro.purchase_order_status === 'COMPLETED' || pro.purchase_order_status === 'APPROVED' || pro.is_cancel === 'Y') {
      return false;
    } else {
      return true;
    }
  }

  printPurchaseOrder(row: any) {
    this.htmlPrview.printPurchaseOrder(row);
  }
  printpPurchasing(row: any) {
    this.htmlPrview.printpPurchasing(row);
  }

  printRequistion(row: any) {
    this.htmlPrview.printRequistion(row);
  }

  printPurchaseOrderAttach(row: any) {
    this.htmlPrview.printPurchaseOrderAttach(row);
  }
  printPurchaseOrderEgp(row: any) {
    this.htmlPrview.printPurchaseOrderEgp(row);
  }


  printSelected() {
    const poItems: Array<any> = [];
    // ดักstatusถ้าเป็น ORDERPOINT อย่างเดียวไม่ให้ปริ้้น
    let f1 = 0;
    let f2 = 0;
    this.purchaseOrdersSelected.forEach((value: any, index: number) => {
      f1++;
      if (value.purchase_order_status !== 'ORDERPOINT') {
        poItems.push('porder=' + value.purchase_order_id);
      } else {
        f2++;
      }
    });
  
    if (f1 !== f2) {
      this.htmlPrview.showReport(this.url + '/report/getporder/singburi/?' + poItems.join('&'));
    } else {
      this.alertService.error('ข้อมุูลไม่ครบถ้วน');
    }

  }

  printRequistionSingburi(row: any) {
    this.htmlPrview.printRequistionSingburi(row);
  }

  goEdit(purchase_order_id) {

    if (this.accessCheck.confirm('PO_EDIT')) {
      this.router.navigateByUrl('/purchase/edit?purchaseOrderId=' + purchase_order_id);
    } else {
      this.alertService.error('คุณไม่มีสิทธิ์ในการแก้ไข', 'Access denied!');
    }
  }
  printOrder_number() {
    this.start_id = '';
    this.end_id = '';
    this.openModal = true;
  }
  async getProductType() {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    const productGroup = decodedToken.generic_type_id.split(',');
    // console.log(productGroup);
    const rs: any = await this.productService.type(productGroup);
    this.productType = rs.rows;
    this.generic_type_id = this.productType[0].generic_type_id;
  }
  async print_id() {
    const printId: any = [];
    let print_non: any = 0;
    const rs: any = await this.purchasingOrderService.getPOid(this.start_id, this.end_id, this.generic_type_id, this.status_po);
    if (rs.rows) {
      rs.rows.forEach(e => {
        if (e.purchase_order_status !== 'ORDERPOINT') {
          printId.push('porder=' + e.purchase_order_id);
          print_non++;
        }
      });
    } else {
      this.alertService.error('ข้อมุูลไม่ครบถ้วน');
    }
    if (print_non > 0) {
      this.htmlPrview.showReport(this.url + '/report/getporder/singburi/?' + printId.join('&'));
      this.openModal = false;
    } else {
      this.alertService.error('ข้อมุูลไม่ครบถ้วน');
    }
    this.start_id = '';
    this.end_id = '';
  }
  async print_date() {
    const printId: any = [];
    let print_non: any = 0;
    const start_date = this.start_date !== null ? moment(this.start_date.jsdate).format('YYYY-MM-DD') : '';
    const end_date = this.end_date !== null ? moment(this.end_date.jsdate).format('YYYY-MM-DD') : '';
    const rs: any = await this.purchasingOrderService.getPrintDate(start_date, end_date, this.generic_type_id, this.status_po);
    if (rs.rows) {
      rs.rows.forEach(e => {
        if (e.purchase_order_status !== 'ORDERPOINT') {
          printId.push('porder=' + e.purchase_order_id);
          print_non++;
        }
      });
    } else {
      this.alertService.error('ไม่มีข้อมูล');
    }
    if (print_non > 0) {
      this.htmlPrview.showReport(this.url + '/report/getporder/singburi/?' + printId.join('&'));
      this.openModal = false;
    } else {
      this.alertService.error('ข้อมุูลไม่ครบถ้วน');
    }
  }

  getReceiveInfo(pro: any) {
    this.modalReceives.show(pro);
  }

  async changeToPrepare(pro: any) {

    if (this.accessCheck.confirm('PO_EDIT_AFFTER_APPREVE')) {
      this.alertService.confirm('ต้องการเปลี่ยนสถานะใบสั่งซื้อ เป็นเตรียมใบสั่งซื้อ ใช่หรือไม่?')
        .then(async () => {
          // PREPARED
          let obj: any = {
            purchase_order_id: pro.purchase_order_id,
            purchase_order_status: 'PREPARED',
            from_status: pro.purchase_order_status
          }

          let items = [];
          items.push(obj);

          try {
            this.modalLoading.show();
            let rs: any = await this.purchasingOrderService.updateStatus(items);
            if (rs.ok) {
              this.alertService.success();
              this.getPurchaseOrders();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          } catch (error) {
            this.modalLoading.hide();
            this.alertService.error(JSON.stringify(error))
          }
        }).catch(() => { });

    }

  }

  settings(){
    this.settingService.byModule('PC')
    .then(async (results: any) => {
      this.settingConfig = results.rows;
      const confirm = _.find(this.settingConfig, { 'action_name': 'PC_CONFIRM' });
      this.isConfirm = (confirm.value == null || confirm.value == '' )? confirm.default : confirm.value;
      this.isConfirm = this.isConfirm === 'Y' ? true : false;
    })
    .catch(error => {
      this.alertService.serverError(error);
    });
  }

  async getOrders() {
    const rs: any = await this.purchasingOrderService.getGeneric();
    this.genericOrders = rs.rows;
    // console.log(this.genericOrders);
  }

  printHistory(generic_name: any) {
    this.generic_name = generic_name;
    this.htmlPrview.showReport(this.url + '/report/getProductHistory/' + generic_name.generic_code);
    console.log(generic_name.generic_code);
  }

  async fileChangeEvent(e: any) {
    if (e.target.value !== '') {
      const rs: any = await this.purchasingOrderService.searchGenericHistory(e.target.value);
      this.genericOrders = rs.rows;
    } else {
      const rs: any = await this.purchasingOrderService.getGeneric();
      this.genericOrders = rs.rows;
    }
    // console.log(e.target.value);
  }

}
