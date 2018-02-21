import { BudgetTransectionService } from '../share/budget-transection.service';
import { SettingService } from './../share/setting.service';
import { AccessCheck } from '../share/access-check';
import { HolidayService } from '../share/holiday.service';
import { HtmlPreviewComponent } from './../../helper/html-preview/html-preview.component';
import { OrdersHistoryComponent } from './../directives/orders-history/orders-history.component';
import { SelectUnitsComponent } from './../directives/select-units/select-units.component';
import { UnitService } from './../share/unit.service';
import { ProductsSelectComponent } from './../directives/products-select/products-select.component';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { Http, Response, Headers } from '@angular/http';
import { AlertService } from './../../alert.service';
import { OfficerService } from 'app/purchase/share/officer.service';

import { Product } from './../share/models/product.interface';
import { PeopleService } from '../share/people.service';
import { BidProcessService } from '../share/bid-process.service';
import { BidtypeService } from '../share/bidtype.service';
import { PackageService } from '../share/package.service';
import { RequisitionService } from '../share/requisition.service';
import { RequisitionItemService } from './../share/requisition-item.service';
import { CommitteeService } from '../share/committee.service';
import { BudgetTypeService } from '../share/budget-type.service';
import { LabelerService } from '../share/labeler.service';
import { ProductService } from '../share/product.service';
import { ContractService } from '../share/contract.service';
import { PurchasingService } from '../share/purchasing.service';
import { PurchasingOrderService } from '../share/purchasing-order.service';
import { PurchasingOrderItemService } from '../share/purchasing-orderitem.service';
import { UploadFormComponent } from './../directives/upload-form/upload-form.component';
import { CommitteePeopleService } from '../share/committee-people.service';
import { CompleterService } from 'ag2-completer';
import { Subject } from 'rxjs';
import { SearchProductVendorComponent } from '../../autocomplete/search-product-vendor/search-product-vendor.component';
import * as numeral from 'numeral';
import * as moment from 'moment';
import * as _ from 'lodash';
import { forEach } from '@angular/router/src/utils/collection';
import { SelectBoxUnitsComponent } from 'app/select-boxes/select-box-units/select-box-units.component';
import { BudgetransectionComponent } from 'app/purchase/directives/budgetransection/budgetransection.component';
import { TransactionPoComponent } from 'app/purchase/directives/transaction-po/transaction-po.component';
import { IProductOrderItem, IGenericUnit, IProductOrderItems } from 'app/interfaces'
import { log } from 'util';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { SelectSubBudgetComponent } from '../../select-boxes/select-sub-budget/select-sub-budget.component';
@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html'
})
export class OrderFormComponent implements OnInit {

  @ViewChild('productsSelect') productsSelect: ProductsSelectComponent;
  @ViewChild('orderHistory') orderHistory: OrdersHistoryComponent;
  @ViewChild('htmlPrview') htmlPrview: HtmlPreviewComponent;
  @ViewChild('searchProductLabeler') searchProductLabeler: SearchProductVendorComponent;
  @ViewChild('selectBoxUnit') selectBoxUnit: SelectBoxUnitsComponent;
  @ViewChild('bgTransection') bgTransection: BudgetransectionComponent;
  @ViewChild('transactionPo') transactionPo: TransactionPoComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent;
  @ViewChild('subBudgetList') subBudgetList: SelectSubBudgetComponent;

  detailActive: boolean = true;
  otherActive: boolean;
  productHistoryActive: boolean;
  bgTransectionActive: boolean;

  isBeforeVat: boolean;
  isOpen: boolean;
  isUpdate: boolean;
  isContract: boolean;
  loading: boolean;
  loadingCommittee: boolean;
  loadingProducts: boolean;
  purchase_order_id: string;
  tempPrice: boolean = true;

  contractDetail: any;
  contract_amount: string;
  amount_spent: string;
  contract_balance: string;

  bidProcess: Array<any> = [];
  packages: Array<any> = [];
  peoples: Array<any> = [];
  products: Array<any> = [];
  committees: Array<any> = [];
  labelers: Array<any> = [];
  contracts: Array<any> = [];
  budgetTypes: Array<any> = [];
  productType: Array<any> = [];
  budgetTypeDetail: any = {};
  lastOrder: any = {};
  budgetTransectionDetail: any = {};
  TransectionDetail: any = {};
  budgets: Array<any> = [];
  product: Array<any> = [];
  defaultBudgetYear: string;
  budgettype_id: string;
  budget_detail_id: string;
  generic_type_id: string;
  budgetYear: string;
  budgetTypeId: any;
  is_reorder: number;
  budget_type: string;
  holiday: any = {};
  holidayText: string;
  bidType: Array<any> = [];
  settingConfig: Array<any> = [];
  committeeSelected: Array<any> = [];
  purchasing: any;
  purchaseOrder: any;

  purchaseOrderItemsSelected: Array<any> = [];

  purchasing_id: string;
  purchase_order_book_number: string;
  requisition_id: string;
  comment: string;
  note_to_vender: string;
  purchasing_name: string;
  purchasing_status: string;
  purchase_order_status: string;
  is_contract: string;
  is_cancel: string;
  contract_ref: string;
  contractId: string;
  prepare_date: any;
  project_name: string;
  project_id: string;
  project_control_id: string;
  verifyCommitteeId: string;
  check_price_committee_id: string;

  egp_id: string;
  purchase_method: number;
  purchase_type: number;
  labelerId: string;
  labeler_name: string;
  purchasing_created_date: string;
  vendor_contact_name: string;
  ship_to: string;

  discount_percent_amount: number = 0;
  bidAmount: number = 0;
  discount_percent: number = 0;
  discount_cash: number = 0;
  sub_total: number = 0;
  vat_rate: number;
  include_vat: boolean = false;
  vat: number = 0;
  total_price: number = 0;
  incoming_balance: number = 0;
  bgdetail_id: number = 10;
  budgetDetailId: number;
  amount: number = 0;
  balance: number = 0;
  total: number = 0;
  totalFormat: string;

  requisition_date: any;
  purchase_order_item_id: string;
  purchase_order_number: string;
  order_date: any;
  shipping_date: any;
  delivery: number;
  committeePo: any;
  officer: any = [];
  officer1: any = [];

  office: any;
  office1: any;

  buyer_fullname: string;
  buyer_position: string;
  chief_fullname: string;
  chief_position: string;
  labelerName: string;
  buyer_id: number;
  chief_id: number;
  percent_amount: number;
  count: number = 0;

  isSaving = false;

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  /* satit */
  selectedProduct: IProductOrderItem = {};
  selectedUnit: IGenericUnit = {};
  selectedCost: number;
  selectedQty: number;
  selectedTotalQty: number = 0;
  selectedTotalPrice: number = 0;
  isGiveaway: boolean = false;
  purchaseOrderItems: Array<IProductOrderItems> = [];
  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private accessCheck: AccessCheck,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private bidProcessService: BidProcessService,
    private bidtypeService: BidtypeService,
    private settingService: SettingService,
    private productService: ProductService,
    private labelerService: LabelerService,
    private holidayService: HolidayService,
    private budgetTypeService: BudgetTypeService,
    private budgetTransectionService: BudgetTransectionService,
    private committeeService: CommitteeService,
    private peopleService: PeopleService,
    private contractService: ContractService,
    private packageService: PackageService,
    private purchasingService: PurchasingService,
    private purchasingOrderService: PurchasingOrderService,
    private purchasingOrderItemService: PurchasingOrderItemService,
    private committeePeopleService: CommitteePeopleService,
    private completerService: CompleterService,
    private unitService: UnitService,
    private http: AuthHttp,
    private officerService: OfficerService,
    @Inject('DOC_URL') public docUrl: string,
    @Inject('PO_PREFIX') public documentPoPrefix: string,
    @Inject('PR_PREFIX') public documentPrPrefix: string,
    @Inject('API_URL') private url: string,

  ) {
    this.activatedRoute.queryParams.subscribe(async (params: Params) => {
      const id: string = params['id'] || null;
      this.purchase_order_id = id;

      if (id === null) {
        this.isUpdate = false;
      } else {
        this.isUpdate = true;
      }
    });

    let token = sessionStorage.getItem('token');
    let decoded = this.jwtHelper.decodeToken(token);

    this.vat_rate = decoded.PC_VAT ? decoded.PC_VAT : 7;
    this.delivery = decoded.PC_SHIPPING_DATE ? decoded.PC_SHIPPING_DATE : 30;
    this.budgetYear = decoded.PC_DEFAULT_BUDGET_YEAR;
  }

  async ngOnInit() {
    if (this.isUpdate) {
      await this.getPurchaseOrderDetail(this.purchase_order_id);
    } else {
      this.newOrder();
      await this.checkIsHoliday(moment().format('YYYY-MM-DD'));
    }

    await this.getProductType();
  }

  productSearchSelected(product: IProductOrderItem) {
    this.selectedProduct = product;
    this.selectBoxUnit.setGenericId(product.generic_id);
  }

  onSelectedUnits(unit: IGenericUnit) {
    this.selectedUnit = unit;
    this.selectedCost = unit.cost;
  }

  onChangeGiveaway(e: any) {
    this.getBidAmount(+e.target.checked);
  }

  addProductSelected() {
    let product: IProductOrderItems = {};
    // console.log(this.selectedCost);
    product.cost = +this.selectedCost;
    product.product_id = this.selectedProduct.product_id;
    product.generic_id = this.selectedProduct.generic_id;
    product.generic_name = this.selectedProduct.generic_name;
    product.product_name = this.selectedProduct.product_name;
    product.is_giveaway = this.isGiveaway ? 'Y' : 'N';
    product.qty = this.selectedQty;
    product.unit_generic_id = this.selectedUnit.unit_generic_id;
    product.small_qty = this.selectedUnit.qty;
    product.total_cost = this.selectedCost * this.selectedQty;
    product.total_small_qty = this.selectedQty * this.selectedUnit.qty;

    if (this.checkDuplicatedItem(product)) {
      let items = _.filter(this.purchaseOrderItems, { product_id: product.product_id });
      // console.log(items.length);
      if (items.length > 1) {
        this.alertService.error('ไม่สามารถเพิ่มรายการเดียวกันได้เกิน 2 รายการ');
      } else {
        this.alertService.confirm('รายการซ้ำ ต้องการเพิ่มเป็นของแถมหรือไม่?')
          .then(() => {
            product.is_giveaway = 'Y';
            product.total_cost = 0;
            this.purchaseOrderItems.push(product);
          })
          .catch(() => {

          });
      }
    } else {
      this.purchaseOrderItems.push(product);
    }
    // clear selected product item
    this.clearSelectedProduct();
    this.calAmount();
  }

  removeProduct(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        if (this.purchaseOrderItems[idx].is_giveaway === 'Y') {
          this.purchaseOrderItems.splice(idx, 1);
        } else {
          let productId = this.purchaseOrderItems[idx].product_id;
          // remove primary product
          this.purchaseOrderItems.splice(idx, 1);

          // remove giveaway items
          let _idx = _.findIndex(this.purchaseOrderItems, { product_id: productId });
          if (_idx > -1) this.purchaseOrderItems.splice(_idx, 1);
        }
        this.calAmount();
      }).catch(() => {
        // cancel
      });
  }

  clearSelectedProduct() {
    this.selectedProduct = {};
    this.isGiveaway = false;
    this.selectedCost = null;
    this.selectedQty = null;
    this.selectBoxUnit.clearUnits();
    this.searchProductLabeler.clearProductSearch();
  }

  onSelectedEditUnits(unit: IGenericUnit, idx: any) {
    this.purchaseOrderItems[idx].small_qty = unit.qty;
    this.purchaseOrderItems[idx].unit_generic_id = unit.unit_generic_id;
    if (this.purchaseOrderItems[idx].is_giveaway === 'Y') {
      this.purchaseOrderItems[idx].total_cost = 0;
    } else {
      this.purchaseOrderItems[idx].total_cost = this.purchaseOrderItems[idx].cost * this.purchaseOrderItems[idx].qty;
    }

    this.purchaseOrderItems[idx].total_small_qty = this.purchaseOrderItems[idx].qty * unit.qty;

  }

  onChangeEditGiveaway(cmp: any, idx: any) {
    const checked = cmp.checked;
    const isGiveaway = cmp.checked ? 'Y' : 'N';
    const product: IProductOrderItems = {};
    product.product_id = this.purchaseOrderItems[idx].product_id;
    product.is_giveaway = isGiveaway;

    if (this.checkDuplicatedItem(product)) {
      cmp.checked = !checked;
      this.alertService.error('รายการซ้ำ กรุณาตรวจสอบ');
    } else {
      this.purchaseOrderItems[idx].is_giveaway = isGiveaway;
      if (isGiveaway === 'Y') {
        this.purchaseOrderItems[idx].total_cost = 0;
      } else {
        this.purchaseOrderItems[idx].total_cost = this.purchaseOrderItems[idx].cost * this.purchaseOrderItems[idx].qty;
      }
      this.calAmount();
    }
  }

  onChangeEditQty(qty: number, idx: any) {
    this.tempPrice = false;
    this.purchaseOrderItems[idx].qty = qty;
    this.purchaseOrderItems[idx].total_small_qty = this.purchaseOrderItems[idx].qty * this.purchaseOrderItems[idx].small_qty;
    if (this.purchaseOrderItems[idx].is_giveaway === 'Y') {
      this.purchaseOrderItems[idx].total_cost
    } else {
      this.purchaseOrderItems[idx].total_cost = this.purchaseOrderItems[idx].cost * this.purchaseOrderItems[idx].qty;
    }

    this.calAmount();
  }

  onChangeEditCost(cost: number, idx: any) {
    this.tempPrice = false;
    this.purchaseOrderItems[idx].cost = cost;
    if (this.purchaseOrderItems[idx].is_giveaway === 'Y') {
      this.purchaseOrderItems[idx].total_cost = 0;
    } else {
      this.purchaseOrderItems[idx].total_cost = this.purchaseOrderItems[idx].cost * this.purchaseOrderItems[idx].qty;
    }

    this.calAmount();

  }

  checkDuplicatedItem(product: IProductOrderItems) {
    let idx = _.findIndex(this.purchaseOrderItems, { product_id: product.product_id, is_giveaway: product.is_giveaway });
    if (idx > -1) {
      return true;
    } else {
      return false;
    }
  }

  removeSelected() {
    this.clearSelectedProduct();
  }

  /***********************************************************/

  onDateChanged(event: IMyDateModel) {
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    let selectDate: string = moment(event.jsdate).format('YYYY-MM-DD');
    if (selectDate !== 'Invalid date') {
      this.checkIsHoliday(selectDate);
    } else {
      this.holidayText = null;
    }
  }

  navigateUrlError() {
    this.alertService.error('ไม่พบรายการใบสั่งซื้อ!...');
  }

  onChangeBudgetType(event: any) {
    this.budgetTypeId = event.bgtype_id;
  }

  onChangeSubBudget(event: any) {
    console.log(event);
    this.budgetDetailId = event ? event.bgdetail_id : null;
    console.log('xxxxxx', this.budgetDetailId)
  }

  // budgetsYear(year: string, budget_type_id: string) {
  //   this.purchasingOrderService.budgetsYear(year, budget_type_id)
  //     .then((results: any) => {
  //       this.budgets = results.rows;
  //       if (this.isUpdate) {
  //         this.getAmountBudgetTransection(this.budget_detail_id, year);
  //         this.setActiveBudget(+this.budget_detail_id);
  //       } else {
  //         if (this.budgets.length > 0) {
  //           this.setActiveBudget(+this.budgets[0].bgdetail_id);
  //           this.budget_detail_id = this.budget_detail_id ? this.budget_detail_id : this.budgets[0].bgdetail_id;
  //           this.getAmountBudgetTransection(this.budget_detail_id, year);
  //         }
  //       }
  //       this.ref.detectChanges();
  //     })
  //     .catch(error => {
  //       this.budgets = [];
  //       this.alertService.serverError(error);
  //     });
  // }

  onChangeGenericType(generic_type_id: string) {
    this.tempPrice = false;
    this.generic_type_id = generic_type_id;
  }

  async onChangeBudgetSoruce(e) {
    this.tempPrice = false;
    // this.setActiveBudget(+e.target.value);
    await this.getAmountBudgetTransection(+e.target.value, this.budgetYear)
    await this.bgTransection.getbgTransection(+e.target.value);
  }
  onChangeBidAmount(e) {
    this.getBidAmount(+e.target.value)
  }

  calAmount() {
    let afterDiscount: number = 0;
    let discount: number = 0;
    let checkloop = 0;
    let _purchaseOrderItems: any = [];
    this.purchaseOrderItems.forEach(v => {
      if (v.is_giveaway == "N") {
        _purchaseOrderItems.push(v.total_cost)
      }

    })
    this.sub_total = _.sum(_purchaseOrderItems);
    discount = this.calDiscount(this.sub_total);
    afterDiscount = this.sub_total - discount;
    if (this.include_vat) {
      if (this.isBeforeVat) {
        this.total_price = this.sub_total;
        this.vat = (this.total_price - discount) * (this.vat_rate / (this.vat_rate + 100));
        this.sub_total = (this.total_price - discount) * (100 / (this.vat_rate + 100));
      } else {
        this.vat = afterDiscount * this.vat_rate / 100;
        this.total_price = this.vat + afterDiscount;
      }
    } else {
      this.vat = 0;
      this.total_price = this.sub_total - discount;
      let count: number = 0;
    }
  }

  calDiscount(subTotal: number): number {
    this.discount_percent_amount = this.discount_percent * subTotal / 100;
    return ((+this.discount_percent_amount) + (+this.discount_cash));
  }

  openSelectedProduct(product: any = '') {
    if (this.labelerId) {
      this.productsSelect.open(this.labelerId, product.product_id);
    }
  }

  onSelectedProduct(data: any) {
    // console.log(data);
  }

  onMultiSelectedProduct(data: any) {
    // console.log(data);
  }

  onChangeLabeler(id: any, oldValue: string) {
    if (this.purchaseOrderItems.length > 0) {
      this.alertService.confirm('รายการสินค้าที่เลือกไปแล้วจะถูกลบออก คุณแน่ใจใช่หรือไม่?', 'คุณต้องการเปลี่ยนผู้จำหน่าย?').then(() => {
        this.purchaseOrderItems.length = 0;
        this.calAmount();
        this.addItem();
      }).catch(() => {
        this.labelerId = oldValue;
      })
    }
  }

  onClickProduct(data) {
    if (this.productHistoryActive === true) {
      this.orderHistory.getProductHistory(data.product_id);
    }
  }

  loadFormPurchasing(data: any) {
    this.purchasing_name = data.purchasing_name;
    this.purchasing_status = data.purchasing_status;
    this.project_id = data.project_id;
    this.project_name = data.project_name;
    this.project_control_id = data.project_control_id;
  }

  newOrder() {
    this.tempPrice = false;
    this.isUpdate = false;
    let d = new Date();
    let i: number = 0;
    const purchasingID = d.getTime().toString() + i++;
    const purchasingOrderID = d.getTime().toString() + i++;
    const budgetTransectionId = d.getTime().toString() + i++;
    this.purchasing_id = purchasingID;
    this.purchase_order_id = purchasingOrderID;
    this.purchaseOrderItems = [];
    this.purchase_order_number = null;
    this.sub_total = 0;
    this.discount_percent = null;
    this.discount_cash = 0;
    this.vat = 0;
    this.budgettype_id = '1';
    this.total_price = 0;
    this.purchase_method = 1;
    this.purchase_type = 1;
    this.labelerName = null;

    this.order_date = {
      date: {
        year: moment().get('year'),
        month: moment().get('month') + 1,
        day: moment().get('date')
      }
    };
    this.budget_type = 'spend';
    this.getBidAmount(this.purchase_method);
  }

  addItem() {
    //
  }

  async loadFormPO(data: any) {
    this.labelerName = data.labeler_name;
    this.isUpdate = true;
    this.purchasing_id = data.purchasing_id;
    this.purchase_order_book_number = data.purchase_order_book_number;
    this.purchase_order_number = data.purchase_order_number;
    this.requisition_id = data.requisition_id;
    this.generic_type_id = data.generic_type_id;
    this.contractId = data.contract_id;
    this.contract_ref = data.contract_ref;
    this.purchase_method = data.purchase_method;
    this.purchase_order_id = data.purchase_order_id;
    this.purchase_type = data.purchase_type;
    this.purchase_order_status = data.purchase_order_status;
    this.is_cancel = data.is_cancel;

    this.budgettype_id = data.budgettype_id;
    this.budget_detail_id = data.budget_detail_id;
    this.labelerId = data.labeler_id;
    this.verifyCommitteeId = data.verify_committee_id;
    this.check_price_committee_id = data.check_price_committee_id;


    // this.sub_total = data.sub_total;
    this.discount_percent = data.discount_percent;
    this.discount_cash = data.discount_cash;
    this.vat_rate = data.vat_rate;
    this.vat = data.vat;
    // this.total_price = data.total_price;

    this.vendor_contact_name = data.vendor_contact_name;
    this.delivery = data.delivery;
    this.ship_to = data.ship_to;
    this.comment = data.comment;
    this.note_to_vender = data.note_to_vender;
    this.egp_id = data.egp_id;

    this.office1 = data.buyer_id;
    this.office = data.chief_id
    this.buyer_fullname = data.buyer_fullname;
    this.chief_fullname = data.chief_fullname;
    this.include_vat = data.include_vat;
    this.chief_position = data.chief_position;
    this.buyer_position = data.buyer_position;
    this.chief_id = data.chief_id;
    this.buyer_id = data.buyer_id;
    this.budgetYear = data.budget_year || moment().get('year');
    this.is_reorder = data.is_reorder;
    // console.log(data.is_reorder)
    this.order_date = {
      date: {
        year: moment(data.order_date).get('year'),
        month: moment(data.order_date).get('month') + 1,
        day: moment(data.order_date).get('date')
      }
    };

  }
  async save() {
    this.isSaving = true;
    const _order_date = this.order_date ?
      `${this.order_date.date.year}-${this.order_date.date.month}-${this.order_date.date.day}` : null;

    try {
      const rs = await this.purchasingOrderService.getPeriodStatus(_order_date);
      if (rs.rows[0].status_close === 'Y') {
        this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถสั่งซื้อได้')
      } else {
        let is_error = false;

        if (this.order_date) {
          const _order_date = this.order_date ?
            `${this.order_date.date.year}-${this.order_date.date.month}-${this.order_date.date.day}` : null;
          const rs: any = await this.purchasingOrderService.getPurchaseCheckHoliday(_order_date);
          if (!rs.ok && !is_error) {
            await this.alertService.confirm(rs.error).then(() => {
              is_error = false;
              this.isSaving = false;
              this.modalLoading.hide();
            }).catch(() => {
              is_error = true;
              this.isSaving = false;
              this.modalLoading.hide();
            });
          }

          if (!is_error) {
            this.saveTo();
          }
        }
      }
    } catch (error) {
      this.alertService.error()
      this.modalLoading.hide();
      this.isSaving = false;
    }
  }

  async saveTo() {
    if (this.bidAmount < this.total_price) {
      this.isSaving = false;
      this.modalLoading.hide();
      this.alertService.error('ราคารวมสุทธิเกินวงเงินที่กำหนดตามวิธีการจัดซื้อ');
    } else {
      let dataPurchasing: any = {};
      let summary: any = {};
      let budgetTransection: any = {};
      let count: number = 0;
      let countQty: number = 0;
      let promise;

      if (!this.budgettype_id || !this.budget_detail_id || !this.purchase_type || !this.purchase_method || !this.verifyCommitteeId) {
        this.alertService.error('กรุณากรอกข้อมูลให้ครบ.!');
        return false;
      }

      let isError = false;
      this.purchaseOrderItems.forEach((v: IProductOrderItems) => {
        if (!v.product_id || v.qty <= 0 || !v.generic_id && !v.cost) {
          isError = true;
        }
      });

      if (isError) {
        this.alertService.error('กรุณาเพิ่มข้อมูลรายการชื่อยาให้ครบถ้วน.!');
      } else {
        dataPurchasing = {
          purchasing_id: this.purchasing_id,
          purchasing_name: this.purchasing_name,
          prepare_date: moment().format('YYYY-MM-DD'),
        }

        budgetTransection = {
          purchase_order_id: this.purchase_order_id,
          bgdetail_id: this.budget_detail_id,
          budget_year: this.budgetYear,
          type: this.budget_type,
          incoming_balance: this.incoming_balance,
          amount: this.total_price,
          balance: this.balance,
          // date_time: moment().format('YYYY-MM-DD H:i:s')
        }

        if (this.office != 0) {
          const _officer = _.filter(this.officer, { 'people_id': +this.office });
          this.chief_fullname = _officer[0].fullname;
          this.chief_position = _officer[0].type_name;
          this.chief_id = _officer[0].people_id;
        } else {
          this.chief_fullname = '';
          this.chief_position = '';
          this.chief_id = 0
        }
        if (this.office1 != 0) {
          const _officer1 = _.filter(this.officer1, { 'people_id': +this.office1 });
          this.buyer_fullname = _officer1[0].fullname;
          this.buyer_position = _officer1[0].type_name;
          this.buyer_id = _officer1[0].people_id;
        } else {
          this.buyer_fullname = '';
          this.buyer_position = '';
          this.buyer_id = 0
        }

        summary = {
          purchase_order_id: this.purchase_order_id,
          purchase_order_book_number: this.purchase_order_book_number,
          purchase_order_number: this.purchase_order_number,
          purchase_order_status: this.purchase_order_status,
          purchasing_id: this.purchasing_id,
          labeler_id: this.labelerId,
          verify_committee_id: this.verifyCommitteeId,
          check_price_committee_id: this.check_price_committee_id,
          egp_id: this.egp_id,
          is_contract: this.is_contract,
          purchase_method: this.purchase_method,
          budgettype_id: this.budgettype_id,
          budget_detail_id: this.budget_detail_id,
          generic_type_id: this.generic_type_id,
          purchase_type: this.purchase_type,
          sub_total: this.sub_total,
          delivery: this.delivery,
          discount_percent: this.discount_percent,
          discount_cash: this.discount_cash,
          vat_rate: this.vat_rate,
          vat: this.vat,
          include_vat: this.include_vat,
          total_price: this.total_price,
          ship_to: this.ship_to,
          vendor_contact_name: this.vendor_contact_name,
          order_date: moment(this.order_date.jsdate).format('YYYY-MM-DD'),
          //shipping_date:  moment(this.shipping_date.jsdate).format('YYYY-MM-DD'),
          comment: this.comment,
          note_to_vender: this.note_to_vender,
          chief_fullname: this.chief_fullname,
          chief_position: this.chief_position,
          buyer_fullname: this.buyer_fullname,
          buyer_position: this.buyer_position,
          chief_id: this.chief_id,
          buyer_id: this.buyer_id,
          budget_year: this.budgetYear,
          is_reorder: this.is_reorder === 1 ? 2 : this.is_reorder
        };

        this.isSaving = true;
        try {
          if ((this.budgetTypeDetail.amount - this.amount) - this.total_price < 0) {
            this.alertService.confirm('ยอดจัดซื้อครั้งนี้ เกินกว่ายอดคงเหลือของงบประมาณ ต้องการบันทึก ใช่หรือไม่?')
              .then(async () => {
                this._savePurchase(summary, budgetTransection);
              })
              .catch(() => { 
                this.isSaving = false;
                this.modalLoading.hide();
              });
          } else {
            this._savePurchase(summary, budgetTransection);
          }

        } catch (error) {
          this.isSaving = false;
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error));
        }
      }
    }
  }

  async _savePurchase(summary: any, budgetTransection: any) {
    // let rsPurchase: any;
    // let rsBudget: any;

    try {
      if (this.isUpdate) {
        if (this.purchase_order_status === 'ORDERPOINT') {
          summary.from_status = 'ORDERPOINT';
          summary.purchase_order_status = 'PREPARED';
        }
        this.isSaving = true;
        this.modalLoading.show();
        let rs: any = await this.purchasingOrderService.update(this.purchase_order_id, summary, this.purchaseOrderItems);
        if (rs.ok) {
          let rsBudget: any = await this.budgetTransectionService.save(budgetTransection);
          if (rsBudget.ok) {
            this.isSaving = false;
            this.alertService.success();
            this.alertService.success('ดำเนินการเสร็จเรียบร้อย');
            this.router.navigate(['/purchase/orders']);
          } else {
            this.modalLoading.hide();
            this.isSaving = false;
            this.alertService.error(rsBudget.error);
          }
        } else {
          this.modalLoading.hide();
          this.isSaving = false;
          this.alertService.error(rs.error);
        }
      } else {
        this.modalLoading.show();
        this.isSaving = true;

        let rs: any = await this.purchasingOrderService.save(summary, this.purchaseOrderItems);
        if (rs.ok) {
          let rsBudget: any = await this.budgetTransectionService.save(budgetTransection);
          if (rsBudget.ok) {
            this.alertService.success();
            this.alertService.success('ดำเนินการเสร็จเรียบร้อย');
            this.router.navigate(['/purchase/orders']);
          } else {
            this.alertService.error(rsBudget.error);
          }
        } else {
          this.alertService.error(rs.error);
        }
        
        this.isSaving = false;
        this.modalLoading.hide();
      }

    } catch (error) {
      this.modalLoading.hide();
      this.isSaving = false;
      this.alertService.error(JSON.stringify(error));
    }

  }

  getContract() {
    this.contractService.all()
      .then((results: any) => {
        this.contracts = results.rows;
      })
      .catch(error => {
        this.alertService.serverError(error);
      });
  }

  getDetailContract(id: string) {
    this.contractService.detail(id)
      .then((results: any) => {
        this.contractDetail = results.detail;
        this.contract_amount = this.contractDetail.amount;
        this.amount_spent = this.contractDetail.amount_spent;
      })
      .catch(error => {
        this.alertService.serverError(error);
      });
  }

  async getBidAmount(id: any) {
    if (id) {
      let rs: any = await this.bidProcessService.bidAmount(id);
      if (rs.ok) {
        this.bidAmount = rs.rows.length ? rs.rows[0].f_amount : 0;
      }
    } else {
      this.bidProcessService.all()
        .then(async (results: any) => {
          this.bidProcess = results.rows;
          if (this.bidProcess.length) {
            let idx = this.bidProcess[0].id;
            let rs: any = await this.bidProcessService.bidAmount(idx);
            if (rs.ok) {
              this.bidAmount = rs.rows.length ? rs.rows[0].f_amount : 0;
            } else {
              this.alertService.error(rs.error);
            }
          }

        })
        .catch(error => {
          this.alertService.serverError(error);
        });
    }
  }

  // getPeople() {
  //   this.peopleService.all()
  //     .then((results: any) => {
  //       this.peoples = results.rows;
  //       this.ref.detectChanges();
  //     })
  //     .catch(error => {
  //       this.alertService.serverError(error);
  //     });
  // }

  // getCommittee() {
  //   this.committeeService.active()
  //     .then((results: any) => {
  //       this.committees = results.rows;
  //       if (this.committees.length > 0 && this.isUpdate === false) {
  //         this.verify_committee_id = this.committees[0].committee_id;
  //         this.getCommitteePeople(this.verify_committee_id);
  //       }
  //     })
  //     .catch(error => {
  //       this.alertService.serverError(error);
  //     });
  // }

  // async getLabeler() {
  //   try {
  //     let res = await this.labelerService.all();
  //     this.labelers = res.ok ? res.rows : [];
  //   } catch (error) {
  //     this.alertService.error(error.message);
  //   }
  // }

  // getProduct(labelerId: string) {
  //   this.productService.productsByLabeler(labelerId)
  //     .then((results: any) => {
  //       this.products = results.rows;
  //       this.ref.detectChanges();
  //     })
  //     .catch(error => {
  //       this.alertService.serverError(error);
  //     });
  // }

  getPurchasing(purchasing_id: string) {
    this.loading = true;
    this.purchasingService.detail(purchasing_id)
      .then((results: any) => {
        this.purchasing = results.detail;
        this.loadFormPurchasing(results.detail);
        this.ref.detectChanges();
        this.loading = false;
      })
      .catch(error => {
        this.alertService.serverError(error);
      });
  }

  async getPurchaseOrderDetail(orderId: string) {
    this.loading = true;
    this.modalLoading.show();
    this.purchasingOrderService.detail(orderId)
      .then(async (results: any) => {
        if (results) {
          this.purchaseOrder = results.detail;
          this.isContract = results.detail.is_contract === 'T' ? true : false;
          await this.loadFormPO(results.detail);
          await this.getLastOrderByLeberID(this.purchaseOrder.labeler_id);
          // 
          await this.getBidAmount(results.detail.purchase_method);
          await this.searchProductLabeler.setApiUrl(results.detail.labeler_id);
          await this.getPurchaseOrderItems(this.purchaseOrder.purchase_order_id);
          await this.getBudgetTransectionDetail(this.purchaseOrder.purchase_order_id);

          if (this.purchaseOrder.verify_committee_id) {
            // this.getCommitteePeople(this.purchaseOrder.verify_committee_id);
          }

          if (this.contract_ref) {
            this.getDetailContract(this.contract_ref);
          }
        } else {
          this.navigateUrlError();
        }
        this.modalLoading.hide();
        this.loading = false;
      })
      .catch(error => {
        this.alertService.serverError(error);
      });
  }

  async getPurchaseOrderItems(orderId: string) {
    try {
      this.modalLoading.show();
      let rs: any = await this.purchasingOrderItemService.allByOrderID(orderId);
      if (rs.ok) {
        let products = rs.rows;
        products.forEach((v: any) => {
          let obj: IProductOrderItems = {
            product_id: v.product_id,
            product_name: v.product_name,
            generic_id: v.generic_id,
            generic_name: v.generic_name,
            cost: v.unit_price,
            qty: v.qty,
            total_small_qty: v.total_small_qty,
            unit_generic_id: v.unit_generic_id,
            total_cost: v.total_price,
            fullname: v.fullname,
            is_giveaway: v.giveaway === 'Y' ? 'Y' : 'N',
            small_qty: v.small_qty
          }

          this.purchaseOrderItems.push(obj);
        });

        this.modalLoading.hide();

        setTimeout(() => {
          this.calAmount();
        }, 1000);

      } else {
        this.modalLoading.hide();
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  getLastOrderByLeberID(labeler_id: string) {
    this.purchasingOrderService.lastOrderByLebelerID(labeler_id)
      .then((results: any) => {
        this.lastOrder = results.detail;
        if (this.purchaseOrder.is_reorder === 1) {
          if (this.lastOrder) {
            this.budgettype_id = this.lastOrder.budgettype_id;
            this.budget_detail_id = this.lastOrder.budget_detail_id;
            this.purchase_type = this.lastOrder.purchase_type;
            this.purchase_method = this.lastOrder.purchase_method;
            this.buyer_id = this.lastOrder.buyer_id;
            this.chief_id = this.lastOrder.chief_id;
            this.verifyCommitteeId = this.lastOrder.verify_committee_id;
          }
        }
        this.ref.detectChanges();
      })
      .catch(error => {
        this.alertService.serverError(error);
      });
  }

  getBudgetTransectionDetail(purchase_order_id: number) {
    this.budgetTransectionService.detail(purchase_order_id)
      .then((results: any) => {
        this.budgetTransectionDetail = results.detail;
        if (this.budgetTransectionDetail) {
          this.incoming_balance = this.budgetTransectionDetail.incoming_balance;
          this.balance = this.budgetTransectionDetail.balance;
          this.budget_type = this.budgetTransectionDetail.type;
        }
        // console.log(this.budgetTransectionDetail);
        this.ref.detectChanges();
      })
      .catch(error => {
        this.budgetTransectionDetail = {};
      });
  }

  getAmountBudgetTransection(bgdetail_id: any, year: any) {
    this.budgetTransectionService._detail(bgdetail_id, year)
      .then((results: any) => {
        this.TransectionDetail = results.detail;
        // console.log(this.TransectionDetail);
        this.amount = this.TransectionDetail ? this.TransectionDetail.amount : null;
        this.ref.detectChanges();
      })
      .catch(error => {
        this.budgetTransectionDetail = {};
      });
  }

  // setActiveBudget(bgdetail_id: number) {
  //   const budget: any = _.find(this.budgets, { 'bgdetail_id': bgdetail_id });
  //   if (budget) {
  //     this.budgetYear = budget.bg_year;
  //     this.budgetTypeDetail = {
  //       bgtype_name: budget.bgtype_name,
  //       bgsubtype_name: budget.bgtypesub_name,
  //       amount: budget.amount
  //     };
  //   }
  // }

  printPurchaseOrder(row: any) {
    this.htmlPrview.printPurchaseOrder(row);
  }

  printRequistion(row: any) {
    this.htmlPrview.printRequistion(row);
  }

  onLabelerSelected(event: any) {
    // console.log(event);
    const oldLabelerID: string = this.labelerId;
    this.labelerName = event.labeler_name;
    this.labelerId = event.labeler_id;
    this.searchProductLabeler.setApiUrl(event.labeler_id);
    if (this.purchaseOrderItems.length === 0) {
      this.addItem();
    } else {
      this.onChangeLabeler(this.labelerId, oldLabelerID);
    }
  }

  cancel() {
    this.router.navigateByUrl('/purchase/orders');
  }

  checkIsHoliday(date: string) {

    this.holidayService.isHoliday(date)
      .then((results: any) => {
        this.holiday = results.detail;
        if (this.holiday) {
          this.holidayText = results.detail.detail;
          this.alertService.success('วันนี้เป็นวันหยุด', results.detail.detail);
        }
        this.ref.detectChanges();
      })
      .catch(error => {
        this.alertService.serverError(error);
      });
  }

  disableAddBtn() {
    if (!this.labelerId) {
      return true;
    }

    if (this.purchase_order_status === 'COMPLETED') {
      return true;
    }

    if (this.is_cancel == '1') {
      return true;
    }

    if (this.purchase_order_status === 'APPROVED') {
      if (this.accessCheck.can('PO_EDIT_AFFTER_APPREVE')) {
        return false;
      }
      return true;
    }
    return false;
  }

  disableSave() {
    if (this.tempPrice) return this.tempPrice;

    if (!this.labelerId) {
      return true;
    }
    if (this.purchaseOrderItems.length == 0) {
      return true;
    }
    if (this.purchase_order_status === 'COMPLETED') {
      return true;
    }

    if (this.is_cancel === '1') {
      return true;
    }

    if (this.purchase_order_status === 'APPROVED') {
      if (this.accessCheck.can('PO_EDIT_AFFTER_APPREVE')) {
        return false;
      }
      return true;
    }

    return false;
  }

  // async onChangeChief(data: any, item) {
  // await this.officerService.findPeople(id)
  //   .then((results: any) => {
  //     if (results.ok) {
  //       this.chief_fullname = results.rows[0].fname + ' ' + results.rows[0].lname;
  //       this.chief_position = results.rows.position_name;
  //       this.chief_id = results.rows.id;
  //     } else {
  //       this.chief_fullname = '________________________________';
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })

  // }

  // async onChangeBuyer(id: any) {
  //   await this.officerService.findPeople(id)
  //     .then((results: any) => {
  //       if (results.ok) {
  //         this.buyer_fullname = results.rows[0].fname + ' ' + results.rows[0].lname;
  //         this.buyer_position = results.rows.position_name;
  //         this.buyer_id = results.rows.id;
  //       } else {
  //         this.buyer_fullname = '________________________________';
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }

  changeCommittee(event: any) {
    this.verifyCommitteeId = event.committee_id;
    this.getCommitteePeople(event.committee_id);
  }

  async getCommitteePeople(committeeId: string) {
    this.modalLoading.show();
    try {
      let rs: any = await this.committeePeopleService.allByCommitteeId(committeeId);
      this.modalLoading.hide();
      if (rs.ok) {
        this.committeeSelected = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  changeOfficer(event: any) {
    this.office = event ? event.people_id : null;
  }

  changeOffice(event: any) {
    this.office1 = event ? event.people_id : null;
  }

  async getProductType() {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    try {
      const productGroup = decodedToken.generic_type_id.split(',');
      this.modalLoading.show();
      const rs: any = await this.productService.type(productGroup);
      this.modalLoading.hide();
      if (rs.rows) {
        this.productType = rs.rows;
        this.generic_type_id = this.productType.length ? this.productType[0].generic_type_id : null;
      } else {
        this.alertService.error(rs.error);
      }
      
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }

  reset() {
    this.newOrder();
  }

}