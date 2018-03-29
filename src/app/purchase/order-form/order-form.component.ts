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
// import { CompleterService } from 'ag2-completer';
// import { Subject } from 'rxjs';
import { SearchProductVendorComponent } from '../../autocomplete/search-product-vendor/search-product-vendor.component';
import * as numeral from 'numeral';
import * as moment from 'moment';
import * as _ from 'lodash';
// import { forEach } from '@angular/router/src/utils/collection';
import { SelectBoxUnitsComponent } from 'app/select-boxes/select-box-units/select-box-units.component';
import { TransactionPoComponent } from 'app/purchase/directives/transaction-po/transaction-po.component';
import { IProductOrderItem, IGenericUnit, IProductOrderItems } from 'app/interfaces'
import { log } from 'util';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { SelectSubBudgetComponent } from '../../select-boxes/select-sub-budget/select-sub-budget.component';
import { SearchVendorComponent } from '../../autocomplete/search-vendor/search-vendor.component';
import { BudgetRemainComponent } from '../directives/budget-remain/budget-remain.component';
@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html'
})
export class OrderFormComponent implements OnInit {

  // @ViewChild('productsSelect') productsSelect: ProductsSelectComponent;
  @ViewChild('orderHistory') orderHistory: OrdersHistoryComponent;
  @ViewChild('htmlPrview') htmlPrview: HtmlPreviewComponent;
  @ViewChild('searchProductLabeler') searchProductLabeler: SearchProductVendorComponent;
  @ViewChild('selectBoxUnit') selectBoxUnit: SelectBoxUnitsComponent;
  @ViewChild('transactionPo') transactionPo: TransactionPoComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent;
  @ViewChild('subBudgetList') subBudgetList: SelectSubBudgetComponent;
  @ViewChild('searchVendor') searchVendor: SearchVendorComponent;
  @ViewChild('budgetRemainRef') budgetRemainRef: BudgetRemainComponent;

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
  purchaseOrderId: string;
  tempPrice: boolean = true;

  contractDetail: any;
  contract_amount: string;
  amount_spent: string;
  contract_balance: string;

  // bidProcess: Array<any> = [];
  // packages: Array<any> = [];
  // peoples: Array<any> = [];
  products: Array<any> = [];
  // contracts: Array<any> = [];
  // budgetTypes: Array<any> = [];
  productType: Array<any> = [];
  budgetTypeDetail: any = {};
  // lastOrder: any = {};
  budgetTransectionDetail: any = {};
  TransectionDetail: any = {};
  // budgets: Array<any> = [];
  // product: Array<any> = [];
  defaultBudgetYear: string;
  // budgettype_id: string;
  // budget_detail_id: string;
  genericTypeId: string;
  budgetYear: string;
  budgetTypeId: any;
  isReorder: string;
  budgetType: string;
  // budget detail for this purchase
  budgetData: any;

  holiday: any = {};
  holidayText: string;
  bidType: Array<any> = [];
  settingConfig: Array<any> = [];
  committeeSelected: Array<any> = [];
  purchasing: any;
  purchaseOrder: any;

  purchaseOrderItemsSelected: Array<any> = [];

  purchasingId: string;
  purchaseOrderBookNumber: string;
  // requisition_id: string;
  comment: string;
  noteToVender: string;
  // purchasing_name: string;
  // purchasingStatus: string;
  purchaseOrderStatus: string;
  // isContract: string;
  // isCancel: string;
  contractRef: string;
  contractId: string;
  // prepareDate: any;
  // project_name: string;
  // projectId: string;
  // project_control_id: string;
  verifyCommitteeId: string;
  checkPriceCommitteeId: string;

  egpId: string;
  purchaseMethodId: number;
  purchaseTypeId: number;
  labelerId: string;
  oldLabelerId: string;
  // labelerName: string;
  // purchasingCreatedDate: string;
  vendorContactName: string;
  shipTo: string;

  discountPercentAmount: number = 0;
  bidAmount: number = 0;
  discountPercent: number = 0;
  discountCash: number = 0;
  subTotal: number = 0;
  vatRate: number;
  vatRateTmp: number;
  excludeVat: boolean = false;
  addVat: boolean = false;
  vat: number = 0;
  totalPrice: number = 0;
  // incomingBalance: number = 0;
  // bgdetail_id: number = 10;
  budgetDetailId: number;
  amount: number = 0;
  balance: number = 0;
  total: number = 0;
  totalFormat: string;

  // requisition_date: any;
  // purchase_order_item_id: string;
  purchaseOrderNumber: string;
  purchaseDate: any;
  shippingDate: any;
  delivery: number;
  committeePo: any;
  officer: any = [];
  officer1: any = [];

  showChief = true;
  showBuyer = true;

  office: any;
  office1: any;

  buyerFullname: string;
  buyerPosition: string;
  chiefFullname: string;
  chiefPosition: string;
  buyerId: number;
  chiefId: number;
  // percent_amount: number;
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

  currentBudgetYear = null;
  currentVatRate = 7;

  contractNo: any = null;

  _canSave: boolean = false;

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
    // private committeeService: CommitteeService,
    // private peopleService: PeopleService,
    // private contractService: ContractService,
    // private packageService: PackageService,
    private purchasingService: PurchasingService,
    private purchasingOrderService: PurchasingOrderService,
    private purchasingOrderItemService: PurchasingOrderItemService,
    private committeePeopleService: CommitteePeopleService,
    // private completerService: CompleterService,
    // private unitService: UnitService,
    // private http: AuthHttp,
    // private officerService: OfficerService,
    @Inject('DOC_URL') public docUrl: string,
    @Inject('PO_PREFIX') public documentPoPrefix: string,
    @Inject('PR_PREFIX') public documentPrPrefix: string,
    @Inject('API_URL') private url: string,

  ) {

    this.activatedRoute.queryParams.subscribe(async (params: Params) => {
      const purchaseOrderId: string = params['purchaseOrderId'] || null;
      this.purchaseOrderId = purchaseOrderId;

      if (purchaseOrderId === null) {
        this.isUpdate = false;
      } else {
        this.isUpdate = true;
      }
    });

    let token = sessionStorage.getItem('token');
    let decoded = this.jwtHelper.decodeToken(token);

    this.vatRateTmp = decoded.PC_VAT ? decoded.PC_VAT : 7;
    this.vatRate = this.vatRateTmp;
    this.currentVatRate = decoded.PC_VAT ? decoded.PC_VAT : 7;

    this.delivery = decoded.PC_SHIPPING_DATE ? decoded.PC_SHIPPING_DATE : 30;
    this.budgetYear = decoded.PC_DEFAULT_BUDGET_YEAR;
    this.currentBudgetYear = decoded.PC_DEFAULT_BUDGET_YEAR;
  }

  async ngOnInit() {
    await this.getProductType();

    if (this.purchaseOrderId) {
      await this.getPurchaseOrderDetail(this.purchaseOrderId);
    } else {
      this.newOrder();
      await this.checkIsHoliday(moment().format('YYYY-MM-DD'));
    }
  }

  productSearchSelected(product: IProductOrderItem) {
    this.selectedProduct = product;
    this.selectBoxUnit.setGenericId(product.generic_id);
  }

  onChangeUnit(event: any) {
    this.selectedUnit = event;
    this.selectedCost = +event.cost;
  }

  onChangeGiveaway(e: any) {
    // this.getBidAmount(+e.target.checked);
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
    this.selectedUnit = {};
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
    // this.tempPrice = false;
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
    // this.tempPrice = false;
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

  onDateChanged(event: IMyDateModel) {
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    let selectDate: string = moment(event.jsdate).format('YYYY-MM-DD');
    if (selectDate !== 'Invalid date') {
      this.checkIsHoliday(selectDate);
    } else {
      this.holidayText = null;
    }
  }

  onChangeBudgetType(event: any) {
    this.budgetTypeId = event.bgtype_id;
  }

  onChangeSubBudget(event: any) {
    // คำนวณการใช้งบประมาณใหม่
    this.budgetDetailId = event ? event.bgdetail_id : null;
  }

  onChangeGenericType(genericTypeId: string) {
    this.tempPrice = false;
    this.genericTypeId = genericTypeId;
  }

  onBudgetCalculated(event: any) {
    this.budgetData = event;
    this._canSave = true;
  }

  checkVat(event: any) {
    if (event == 'excludeVat' && this.excludeVat) {
      this.addVat = false
      this.vatRate = this.vatRateTmp
    }
    else if (event == 'addVat' && this.addVat) {
      this.excludeVat = false
      this.vatRate = this.vatRateTmp
    }
    this.calAmount()
  }

  calAmount() {
    let afterDiscount: number = 0;
    let discount: number = 0;
    let checkloop = 0;
    this.subTotal = 0;
    this.totalPrice = 0;
    // let _purchaseOrderItems: any = [];

    this.purchaseOrderItems.forEach(v => {
      if (v.is_giveaway == "N") {
        this.subTotal += +v.total_cost;
      }
    });

    // this.subTotal = _.sum(_purchaseOrderItems);
    discount = this.calDiscount(this.subTotal);
    afterDiscount = this.subTotal - discount;
    if (this.excludeVat) {
      this.totalPrice = this.subTotal - discount;
      this.vat = (this.totalPrice - discount) * (this.vatRate / 100);
      this.subTotal = (this.totalPrice - discount) - this.vat;
    } else if (this.addVat) {
      this.totalPrice = this.subTotal - discount;
      this.vat = this.totalPrice * (this.vatRate / 100);
      this.totalPrice = this.totalPrice + this.vat;
    }
    else {
      this.vatRate = null;
      this.vat = 0;
      this.totalPrice = this.subTotal - discount;
      // let count: number = 0;
    }
  }

  calDiscount(subTotal: number): number {
    this.discountPercentAmount = this.discountPercent * subTotal / 100;
    return ((+this.discountPercentAmount) + (+this.discountCash));
  }

  // openSelectedProduct(product: any = '') {
  //   if (this.labelerId) {
  //     this.productsSelect.open(this.labelerId, product.product_id);
  //   }
  // }

  // onSelectedProduct(data: any) {
  //   // console.log(data);
  // }

  // onMultiSelectedProduct(data: any) {
  //   // console.log(data);
  // }

  onChangeLabeler(id: any, oldValue: string) {
    if (this.purchaseOrderItems.length > 0) {
      this.alertService.confirm('รายการสินค้าที่เลือกไปแล้วจะถูกลบออก คุณแน่ใจใช่หรือไม่?', 'คุณต้องการเปลี่ยนผู้จำหน่าย?').then(() => {
        this.purchaseOrderItems.length = 0;
        this.calAmount();
        // this.addItem();
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

  onChangePurchaseType(event: any) {
    this.purchaseTypeId = event.bid_id;
  }

  newOrder() {

    this.isUpdate = false;

    this.purchaseOrderItems = [];
    this.purchaseOrderNumber = null;
    this.subTotal = 0;
    this.discountPercent = null;
    this.discountCash = 0;
    this.totalPrice = 0;

    this.purchaseDate = {
      date: {
        year: moment().get('year'),
        month: moment().get('month') + 1,
        day: moment().get('date')
      }
    };

    this.budgetType = 'spend';
  }

  async setOrderDetail(data: any) {
    this.isUpdate = true;
    this.purchasingId = data.purchasing_id;
    this.purchaseOrderBookNumber = data.purchase_order_book_number;
    this.purchaseOrderNumber = data.purchase_order_number;

    if (data.generic_type_id) {
      this.genericTypeId = data.generic_type_id;
    } else {
      this.genericTypeId = this.productType.length ? this.productType[0].generic_type_id : null;
    }

    this.contractId = data.contract_id;

    this.contractNo = data.contract_no;
    this.contractRef = data.contract_ref;
    this.purchaseOrderId = data.purchase_order_id;

    if (data.purchase_method_id) {
      this.purchaseMethodId = data.purchase_method_id;
    }
    if (data.purchase_type_id) {
      this.purchaseTypeId = data.purchase_type_id;
    }

    this.purchaseOrderStatus = data.purchase_order_status;
    // this.isCancel = data.is_cancel;

    this.labelerId = data.labeler_id;
    // this.verifyCommitteeId = data.verify_committee_id;
    this.checkPriceCommitteeId = data.check_price_committee_id;

    // this.sub_total = data.sub_total;
    this.discountPercent = data.discount_percent;
    this.discountCash = data.discount_cash;
    this.vatRate = data.vat_rate;
    this.vat = data.vat;
    // this.totalPrice = data.total_price;

    this.vendorContactName = data.vendor_contact_name;
    this.delivery = data.delivery;
    this.shipTo = data.ship_to;
    this.comment = data.comment;
    this.noteToVender = data.note_to_vender;
    this.egpId = data.egp_id;

    // this.buyerFullname = data.buyer_fullname;
    // this.chiefFullname = data.chief_fullname;
    this.addVat = data.include_vat === 'Y' ? true : false;
    this.excludeVat = data.exclude_vat === 'Y' ? true : false;
    // this.isBeforeVat = data.is_before_vat === 'Y' ? true : false;
    // this.chiefPosition = data.chief_position;
    // this.buyerPosition = data.buyer_position;
    this.chiefId = data.chief_id;
    this.buyerId = data.buyer_id;
    this.budgetYear = data.budget_year || this.currentBudgetYear;
    // this.isReorder = data.is_reorder;
    // console.log(data.is_reorder)
    this.purchaseDate = {
      date: {
        year: moment(data.order_date).get('year'),
        month: moment(data.order_date).get('month') + 1,
        day: moment(data.order_date).get('date')
      }
    };

    if (!data.budgettype_id) {
      await this.subBudgetList.setBudgetType(this.budgetTypeId);
      await this.subBudgetList.getItems();
    } else {
      this.budgetTypeId = data.budgettype_id;
    }

    if (this.purchaseOrder.verify_committee_id) {
      this.verifyCommitteeId = this.purchaseOrder.verify_committee_id;
      await this.getCommitteePeople(this.purchaseOrder.verify_committee_id);
    }

    if (this.contractRef) {
      // this.getDetailContract(this.contract_ref);
    }

    if (data.budget_detail_id) {
      this.budgetDetailId = data.budget_detail_id;
    }

    this.searchVendor.setSelected(data.labeler_name);

  }

  async save() {

    if (this.purchaseDate && this.labelerId && this.purchaseMethodId &&
      this.budgetTypeId && this.genericTypeId && this.purchaseOrderItems.length &&
      this.totalPrice > 0 && this.budgetDetailId && this.verifyCommitteeId) {

      const purchaseDate = this.purchaseDate ?
        `${this.purchaseDate.date.year}-${this.purchaseDate.date.month}-${this.purchaseDate.date.day}` :
        `${moment().get('year')}-${moment().get('month') + 1}-${moment().get('date')}`;

      let isSaveHoliday = false;

      // check วันหยุด
      const rs: any = await this.purchasingOrderService.getPurchaseCheckHoliday(purchaseDate);

      if (!rs.ok) {
        await this.alertService.confirm(rs.error).then(() => {
          // บันทึกแม้เป็นวันหยุด
          isSaveHoliday = true;
        }).catch(() => {
          isSaveHoliday = false;
        });
      } else {
        isSaveHoliday = true;
      }

      if (isSaveHoliday) {
        // save purchase
        this._save();
      } else {
        // cancel save purchase
      }
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }

  }

  async _save() {

    let isErrorBidAmount: boolean = this.bidAmount < this.totalPrice;

    if (isErrorBidAmount) {
      // วงเงินเกินวิธีการจัดซื้อ
      this.alertService.error('ราคารวมสุทธิเกินวงเงินที่กำหนดตามวิธีการจัดซื้อ');
    } else {
      let dataPurchasing: any = {};
      let summary: any = {};

      // ตรวจสอบว่ามีรายการใดที่จำนวนจัดซื้อเป็น 0 หรือ ไม่ได้ระบุราคา
      let isError = false;
      this.purchaseOrderItems.forEach((v: IProductOrderItems) => {
        if (!v.product_id || v.qty <= 0 || !v.unit_generic_id && !v.cost) {
          isError = true;
        }
      });

      if (isError) {
        this.alertService.error('กรุณาระบุรายละเอียดสินค้าให้ครบถ้วน เช่น ราคา, จำนวนจัดซื้อและหน่วยสำหรับจัดซื้อ')
      } else {
        // ตรวจสอบยอดสั่งซื้อกับวงเงินของงบคงเหลือ
        if (this.budgetData.RemainAfterPurchase < 0) {
          this.alertService.error('ยอดจัดซื้อครั้งนี้ เกินกว่ายอดคงเหลือของงบประมาณ?')
        } else if (this.budgetData.contractRemainAfterPurchase < 0 && this.contractId) {
          this.alertService.error('ยอดจัดซื้อครั้งนี้ เกินกว่ายอดคงเหลือของสัญญา?')
        } else {
          this._canSave = false;
          this.modalLoading.show();
          // calculate new budget transaction
          await this.budgetRemainRef.getBudget();

          if (this._canSave) {
            this.modalLoading.hide();
            this.alertService.confirm('กรุณาตรวจสอบรายการให้ถูกต้องการทำการบันทึก ต้องการบันทึก ใช่หรือไม่?')
              .then(async () => {
                this.doSavePurchase();
              }).catch(() => { });
          } else {
            this.modalLoading.hide();
            this.alertService.error('ไม่สามารถประมวลผล Transaction ของงบประมาณได้')
          }
        }
      }

    }
  }

  async doSavePurchase() {
    let summary: any = {};
    try {

      let purchaseDate = `${this.purchaseDate.date.year}-${this.purchaseDate.date.month}-${this.purchaseDate.date.day}`;
      
      if(!this.showChief) this.chiefId = null;
      if(!this.showBuyer) this.buyerId = null;

      summary = {
        // purchase_order_id: this.purchaseOrderId,
        purchase_order_book_number: this.purchaseOrderBookNumber,
        purchase_order_number: this.purchaseOrderNumber,
        purchase_order_status: this.purchaseOrderStatus,
        // purchasing_id: this.purchasingId,
        labeler_id: this.labelerId,
        verify_committee_id: this.verifyCommitteeId,
        check_price_committee_id: this.checkPriceCommitteeId,
        egp_id: this.egpId,
        is_contract: this.isContract,
        contract_id: this.contractId,
        purchase_method_id: this.purchaseMethodId,
        budgettype_id: this.budgetTypeId,
        budget_detail_id: this.budgetDetailId,
        generic_type_id: this.genericTypeId,
        purchase_type_id: this.purchaseTypeId,
        sub_total: this.subTotal,
        delivery: this.delivery,
        discount_percent: this.discountPercent,
        discount_cash: this.discountCash,
        vat_rate: this.vatRate,
        vat: this.vat,
        include_vat: this.addVat ? 'Y' : 'N',
        exclude_vat: this.excludeVat ? 'Y' : 'N',
        // is_before_vat: this.isBeforeVat ? 'Y' : 'N',
        total_price: this.totalPrice,
        ship_to: this.shipTo,
        vendor_contact_name: this.vendorContactName,
        order_date: purchaseDate,
        comment: this.comment,
        note_to_vender: this.noteToVender,
        chief_id: this.chiefId,
        buyer_id: this.buyerId,
        budget_year: this.budgetYear,
        // is_reorder: this.isReorder === 'Y' ? 2 : this.isReorder
      };

      this.isSaving = true;
      this.modalLoading.show();

      let rs: any;

      if (this.isUpdate) {
        if (this.purchaseOrderStatus === 'ORDERPOINT') {
          summary.from_status = 'ORDERPOINT';
          summary.purchase_order_status = 'PREPARED';
        }
        rs = await this.purchasingOrderService.update(this.purchaseOrderId, summary, this.purchaseOrderItems, this.budgetData);
      } else {
        rs = await this.purchasingOrderService.save(summary, this.purchaseOrderItems, this.budgetData);
      }

      if (rs.ok) {
        this.alertService.success();
        this.router.navigate(['/purchase/orders'])
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.isSaving = false;
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getPurchaseOrderDetail(orderId: string) {
    this.loading = true;
    this.modalLoading.show();

    try {
      let rs: any = await this.purchasingOrderService.detail(orderId);
      if (rs.ok) {
        this.purchaseOrder = rs.detail;
        this.isContract = rs.detail.is_contract === 'T' ? true : false;
        await this.setOrderDetail(rs.detail);
        this.searchProductLabeler.setApiUrl(rs.detail.labeler_id);
        await this.getPurchaseOrderItems(this.purchaseOrder.purchase_order_id);

      } else {
        this.alertService.error(rs.error);
      }

      this.modalLoading.hide();
      this.loading = false;

    } catch (error) {
      this.modalLoading.hide();
      this.loading = false;
      this.alertService.error(JSON.stringify(error));
    }

  }

  async getPurchaseOrderItems(orderId: string) {
    try {
      this.modalLoading.show();
      let rs: any = await this.purchasingOrderItemService.allByOrderID(orderId);
      this.modalLoading.hide();
      if (rs.ok) {
        let products = rs.rows;

        for (let v of products) {
          let obj: IProductOrderItems = {
            product_id: v.product_id,
            product_name: v.product_name,
            generic_id: v.generic_id,
            generic_name: v.generic_name,
            cost: v.unit_price,
            qty: v.qty,
            total_small_qty: v.qty * v.small_qty,
            unit_generic_id: v.unit_generic_id,
            total_cost: v.unit_price * v.qty,
            is_giveaway: v.giveaway || 'N',
            small_qty: v.small_qty
          }
          this.purchaseOrderItems.push(obj);
        }

        this.calAmount();

      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  // getLastOrderByLeberID(labeler_id: string) {
  //   this.purchasingOrderService.lastOrderByLebelerID(labeler_id)
  //     .then((results: any) => {
  //       this.lastOrder = results.detail;
  //       if (this.purchaseOrder.is_reorder === 1) {
  //         if (this.lastOrder) {
  //           this.budgettype_id = this.lastOrder.budgettype_id;
  //           this.budget_detail_id = this.lastOrder.budget_detail_id;
  //           this.purchase_type = this.lastOrder.purchase_type;
  //           this.purchaseMethod = this.lastOrder.purchase_method;
  //           this.buyer_id = this.lastOrder.buyer_id;
  //           this.chief_id = this.lastOrder.chief_id;
  //           this.verifyCommitteeId = this.lastOrder.verify_committee_id;
  //         }
  //       }
  //       this.ref.detectChanges();
  //     })
  //     .catch(error => {
  //       this.alertService.serverError(error);
  //     });
  // }

  // getBudgetTransectionDetail(purchase_order_id: number) {
  //   this.budgetTransectionService.detail(purchase_order_id)
  //     .then((rs: any) => {
  //       if (rs.ok) {
  //         if (rs.detail) {
  //           this.budgetTransectionDetail = rs.detail;
  //           if (this.budgetTransectionDetail) {
  //             // this.incomingBalance = this.budgetTransectionDetail.incoming_balance;
  //             this.balance = this.budgetTransectionDetail.balance;
  //             this.budgetType = this.budgetTransectionDetail.type;
  //           }
  //         }
  //       } else {
  //         this.alertService.error(rs.error);
  //       }
  //     })
  //     .catch(error => {
  //       this.budgetTransectionDetail = {};
  //     });
  // }

  // getAmountBudgetTransection(bgdetail_id: any) {
  //   this.budgetTransectionService.getDetail(bgdetail_id)
  //     .then((rs: any) => {
  //       if (rs.ok) {
  //         if (rs.detail) {
  //           this.TransectionDetail = rs.detail;
  //           // console.log(this.TransectionDetail);
  //           this.amount = this.TransectionDetail ? this.TransectionDetail.amount : 0;
  //         }
  //       } else {
  //         this.alertService.error(rs.error);
  //       }
  //     })
  //     .catch(error => {
  //       this.budgetTransectionDetail = {};
  //     });
  // }

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
      })
      .catch(error => {
        this.alertService.serverError(error);
      });
  }

  disableAddBtn() {
    if (!this.labelerId) {
      return true;
    }

    if (this.purchaseOrderStatus === 'COMPLETED') {
      return true;
    }

    if (this.isContract == true) {
      return true;
    }

    if (this.purchaseOrderStatus === 'APPROVED') {
      if (this.accessCheck.can('PO_EDIT_AFFTER_APPROVE')) {
        return false;
      }
      return true;
    }
    return false;
  }

  disableSave() {
    // if (this.tempPrice) return this.tempPrice;

    if (!this.labelerId) return true;
    if (this.purchaseOrderItems.length == 0) return true;
    if (this.purchaseOrderStatus === 'COMPLETED') return true;
    // if (this.isContract === true)  return true;

    if (this.purchaseOrderStatus === 'APPROVED') {
      if (this.accessCheck.can('PO_EDIT_AFFTER_APPROVE')) {
        return false;
      }
      return true;
    }

    return false;
  }

  changeCommittee(event: any) {
    this.verifyCommitteeId = event ? event.committee_id : null;
    this.getCommitteePeople(event.committee_id);
  }

  // แสดงรายชื่อกรรมการ
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
    this.chiefId = event ? event.people_id : null;
  }

  changeOffice(event: any) {
    this.buyerId = event ? event.people_id : null;
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
        this.genericTypeId = this.productType.length ? this.productType[0].generic_type_id : null;
      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }

  onChangePurchaseMethod(event: any) {
    this.purchaseMethodId = event ? event.id : null;
    this.bidAmount = event ? event.f_amount : 0;
  }

  reset() {
    this.newOrder();
  }

  // search vendor
  onChangeVendor(event: any) {
    if (event) {
      // console.log(this.labelerId);
      this.labelerId = null;
    }
  }

  onSelectVendor(event: any) {
    if (event) {

      if (this.oldLabelerId !== event.labeler_id) {
        this.purchaseOrderItems = [];
      }

      this.labelerId = event.labeler_id;
      this.oldLabelerId = event.labeler_id;

      this.searchProductLabeler.setApiUrl(this.labelerId);
    }
  }
}