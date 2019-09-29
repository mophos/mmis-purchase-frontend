
import { AccessCheck } from '../share/access-check';
import { HolidayService } from '../share/holiday.service';
import { HtmlPreviewComponent } from './../../helper/html-preview/html-preview.component';
import { OrdersHistoryComponent } from './../directives/orders-history/orders-history.component';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertService } from './../../alert.service';

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
import { SearchPeopleComponent } from '../../autocomplete/search-people/search-people.component';
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
  @ViewChild('searchPeople1') searchPeople1: SearchPeopleComponent;
  @ViewChild('searchPeople2') searchPeople2: SearchPeopleComponent;
  @ViewChild('searchPeople3') searchPeople3: SearchPeopleComponent;

  detailActive = true;
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
  tempPrice = true;

  contractDetail: any;
  contract_amount: string;
  amount_spent: string;
  contract_balance: string;

  products: Array<any> = [];
  productType: Array<any> = [];
  budgetTypeDetail: any = {};
  budgetTransectionDetail: any = {};
  TransectionDetail: any = {};
  defaultBudgetYear: string;
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
  purchaseOrderStatus: string;
  contractRef: string;
  contractId: string;
  verifyCommitteeId: any;
  checkPriceCommitteeId: string;

  egpId: string;
  purchaseMethodId: number;
  purchaseTypeId: number;
  labelerId: string;
  oldLabelerId: string;
  peopleId1 = null;
  peopleId2 = null;
  peopleId3 = null;
  vendorContactName: string;
  shipTo: string;

  discountPercentAmount = 0;
  bidAmount = 0;
  discountPercent = 0;
  discountCash = 0;
  subTotal = 0;
  vatRate: number;
  vatRateTmp: number;
  excludeVat = true;
  addVat = false;
  vat = 0;
  totalPrice = 0;
  viewBudgetDetailId: number;
  amount = 0;
  balance = 0;
  total = 0;
  totalFormat: string;

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
  supplyId: number;
  chiefId: number;
  headId: number;
  count = 0;

  isSaving = false;
  holidays: any = [];
  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    // satHighlight: true,
    markDates: this.holidays,
  };

  selectedProduct: any = {};
  selectedUnit: IGenericUnit = {};
  selectedCost: number;
  oldCost: number;
  selectedQty: number;
  selectedTotalQty = 0;
  selectedTotalPrice = 0;
  isGiveaway = false;
  purchaseOrderItems: Array<IProductOrderItems> = [];
  public jwtHelper: JwtHelper = new JwtHelper();

  currentBudgetYear = null;
  currentVatRate = 7;

  contractNo: any = null;

  _canSave = false;
  dupBookNumber = false; // false = ห้ามซ้ำ
  edi = false;
  editAfterApprove = false;
  managerId: any;
  isCancel = false;
  constructor(
    private accessCheck: AccessCheck,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private productService: ProductService,
    private holidayService: HolidayService,
    private committeeService: CommitteeService,
    private purchasingOrderService: PurchasingOrderService,
    private purchasingOrderItemService: PurchasingOrderItemService,
    private committeePeopleService: CommitteePeopleService,
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

    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    const accessRight = decoded.accessRight.split(',');
    this.editAfterApprove = _.indexOf(accessRight, 'PO_EDIT_AFFTER_APPROVE') === -1 ? false : true;

    this.vatRateTmp = decoded.PC_VAT ? decoded.PC_VAT : 7;
    this.vatRate = this.vatRateTmp;
    this.currentVatRate = decoded.PC_VAT ? decoded.PC_VAT : 7;

    this.delivery = decoded.PC_SHIPPING_DATE ? decoded.PC_SHIPPING_DATE : 30;
    let year = moment().get('year');
    const month = moment().get('month') + 1;
    if (month >= 10) {
      year += 1;
    }

    // this.budgetYear = year.toString();
    // this.currentBudgetYear = year;

    this.dupBookNumber = decoded.PC_BOOK_NUMBER_DUPLICATE === 'Y' ? true : false;
  }

  async ngOnInit() {
    this.viewBudgetDetailId = +localStorage.getItem('budgetDetailId');
    this.budgetTypeId = +localStorage.getItem('budgetTypeId');
    this.buyerId = +localStorage.getItem('buyerId');
    this.supplyId = +localStorage.getItem('supplyId');
    this.chiefId = +localStorage.getItem('chiefId');
    this.headId = +localStorage.getItem('headId');
    this.managerId = +localStorage.getItem('managerId');
    await this.getProductType();
    await this.getHoliday();

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
    this.oldCost = +event.old_cost;
  }

  onChangeGiveaway(e: any) {
    // this.getBidAmount(+e.target.checked);
  }

  addProductSelected() {
    if (this.contractId) {
      if (this.selectedProduct.contract_id !== this.contractId) {
        this.alertService.error('รายการนี้ไม่ได้อยู่ในสัญญา กรุณาตรวจสอบข้อมูล');
      } else {
        this.budgetRemainRef.getContractDetail(this.contractId, this.purchaseOrderId);
        this._doAddProduct();
      }
    } else {
      if (this.selectedProduct.contract_id) {
        const diffday = moment(moment(this.selectedProduct.end_date).format('YYYY-MM-DD')).diff(moment(moment().format('YYYY-MM-DD')), 'days');
        if (diffday >= 0 && this.selectedProduct.contract_status !== 'SUCCESS' && this.selectedProduct.contract_status !== 'CANCEL') {
          this.alertService.confirm('หากเพิ่มรายการนี้รายการอื่นๆที่ไม่มีสัญญาจะถูกยกเลิก แล้วออก PO เป็นแบบมีสัญญาแทน ต้องการสร้าง PO แบบมีสัญญาใช่หรือไม่?', 'รายการนี้มีสัญญา')
            .then(() => {
              // ออก PO แบบมีสัญญา
              this.contractId = this.selectedProduct.contract_id;
              this.contractNo = this.selectedProduct.contract_no;
              this.purchaseOrderItems.forEach((v, i) => {
                if (v.contract_id !== v.contract_id) {
                  this.purchaseOrderItems.splice(i, 1);
                }
              });
              // get contract budget
              this.budgetRemainRef.getContractDetail(this.contractId, this.purchaseOrderId);
              this._doAddProduct();
            }).catch(() => { });
        } else {
          this._doAddProduct();
        }
      } else {
        this._doAddProduct();
      }
    }
  }

  _doAddProduct() {
    const product: any = {};
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
    product.contract_no = this.selectedProduct.contract_no;
    product.contract_id = this.selectedProduct.contract_id;
    product.old_qty = this.selectedProduct.old_qty;
    product.old_cost = this.oldCost;
    product.standard_cost = this.selectedProduct.standard_cost;
    product.standard_pack_cost = this.selectedProduct.standard_pack_cost;

    if (this.checkDuplicatedItem(product)) {
      const items = _.filter(this.purchaseOrderItems, { product_id: product.product_id });
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
          const productId = this.purchaseOrderItems[idx].product_id;
          // remove primary product
          this.purchaseOrderItems.splice(idx, 1);

          // remove giveaway items
          const _idx = _.findIndex(this.purchaseOrderItems, { product_id: productId });
          if (_idx > -1) {
            this.purchaseOrderItems.splice(_idx, 1);
          }
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
      // this.purchaseOrderItems[idx].total_cost
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
    const idx = _.findIndex(this.purchaseOrderItems, { product_id: product.product_id, is_giveaway: product.is_giveaway });
    if (idx > -1) {
      return true;
    } else {
      return false;
    }
  }

  removeSelected() {
    this.clearSelectedProduct();
  }

  async onDateChanged(event: IMyDateModel) {
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    const selectDate: string = moment(event.jsdate).format('YYYY-MM-DD');

    let year = moment(selectDate, 'YYYY-MM-DD').get('year');
    const month = moment(selectDate, 'YYYY-MM-DD').get('month') + 1;
    if (month >= 10) {
      year += 1;
    }

    this.budgetYear = year.toString();
    this.currentBudgetYear = year;
    await this.subBudgetList.setYears(this.budgetYear);

    if (selectDate !== 'Invalid date') {
      // this.checkIsHoliday(selectDate);
    } else {
      this.holidayText = null;
    }
  }

  onChangeBudgetType(event: any) {
    this.budgetTypeId = event.bgtype_id;
  }

  onChangeSubBudget(event: any) {
    // คำนวณการใช้งบประมาณใหม่
    this.viewBudgetDetailId = event ? event.view_bgdetail_id : null;
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
    if (event === 'excludeVat' && this.excludeVat) {
      this.addVat = false
      this.vatRate = +this.vatRateTmp
    } else if (event === 'addVat' && this.addVat) {
      this.excludeVat = false
      this.vatRate = +this.vatRateTmp
    }
    this.calAmount()
  }

  async calAmount() {
    let afterDiscount = 0;
    let discount = 0;
    const checkloop = 0;
    this.subTotal = 0;
    this.totalPrice = 0;
    // let _purchaseOrderItems: any = [];

    await this.purchaseOrderItems.forEach(v => {
      if (v.is_giveaway === 'N') {
        this.subTotal += +v.total_cost;
      }
    });
    // this.subTotal = _.sum(_purchaseOrderItems);
    discount = this.calDiscount(this.subTotal);
    afterDiscount = this.subTotal - discount;
    if (this.excludeVat) {
      this.totalPrice = this.subTotal - discount;
      this.subTotal = (this.totalPrice * 100) / (+this.vatRate + 100)
      this.vat = (this.subTotal * this.vatRate) / 100
      // this.vat = (this.totalPrice - discount) * (this.vatRate / 100);
      // this.subTotal = (this.totalPrice - discount) - this.vat;
    } else if (this.addVat) {
      this.totalPrice = this.subTotal - discount;
      this.vat = this.totalPrice * (+this.vatRate / 100);
      this.totalPrice = this.totalPrice + this.vat;
    } else {
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

  onChangeLabeler(id: any, oldValue: string) {
    if (this.purchaseOrderItems.length > 0) {
      this.alertService.confirm('รายการสินค้าที่เลือกไปแล้วจะถูกลบออก คุณแน่ใจใช่หรือไม่?', 'คุณต้องการเปลี่ยนผู้จำหน่าย?').then(() => {
        this.purchaseOrderItems = [];
        this.contractId = null;
        this.contractNo = null;
        this.budgetRemainRef.clearContractDetail();
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

  async newOrder() {

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

    let year = moment().get('year');
    const month = moment().get('month') + 1;
    if (month >= 10) {
      year += 1;
    }
    this.budgetYear = year.toString();
    this.currentBudgetYear = year;
    await this.subBudgetList.setYears(year);
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
    this.checkPriceCommitteeId = data.check_price_committee_id;
    this.discountPercent = data.discount_percent;
    this.discountCash = data.discount_cash;
    this.vatRate = data.vat_rate;
    this.vat = data.vat;

    this.vendorContactName = data.vendor_contact_name;
    this.delivery = data.delivery;
    this.shipTo = data.ship_to;
    this.comment = data.comment;
    this.noteToVender = data.note_to_vender;
    this.egpId = data.egp_id;

    this.addVat = data.include_vat === 'Y' ? true : false;
    this.excludeVat = data.exclude_vat === 'Y' ? true : false;
    this.chiefId = data.chief_id ? data.chief_id : this.chiefId;
    this.buyerId = data.buyer_id ? data.buyer_id : this.buyerId;
    this.supplyId = data.supply_id ? data.supply_id : this.supplyId;
    this.headId = data.head_id ? data.head_id : this.headId;
    this.managerId = data.manager_id ? data.manager_id : this.managerId;

    // this.budgetYear = data.budget_year || this.currentBudgetYear;
    this.purchaseDate = {
      date: {
        year: moment(data.order_date).get('year'),
        month: moment(data.order_date).get('month') + 1,
        day: moment(data.order_date).get('date')
      }
    };

    let year = moment(data.order_date, 'YYYY-MM-DD').get('year');
    const month = moment(data.order_date, 'YYYY-MM-DD').get('month') + 1;
    if (month >= 10) {
      year += 1;
    }

    if (data.budget_detail_id) {
      this.viewBudgetDetailId = data.budget_detail_id;
    }
    // if (data.budgettype_id) {
    //   this.budgetTypeId = data.budgettype_id;
    // }
    if (data.budget_year && data.budgettype_id && data.budget_detail_id) {
      this.budgetYear = data.budget_year;
      this.currentBudgetYear = data.budget_year;
      this.budgetTypeId = data.budgettype_id
      await this.subBudgetList.setBudgetType(this.budgetTypeId);
      await this.subBudgetList.setYears(data.budget_year);
      // await this.subBudgetList.getItems();
    } else if (data.budget_year && !data.budget_detail_id) {
      this.budgetYear = data.budget_year
      this.currentBudgetYear = data.budget_year;
      await this.subBudgetList.setYears(data.budget_year);
    } else {
      this.budgetYear = year.toString();
      this.currentBudgetYear = year;
      await this.subBudgetList.setYears(year);
    }
    // } else {

    //   if (!data.budgettype_id) {

    //     await this.subBudgetList.setYears(this.budgetYear);

    //     // await this.subBudgetList.setBudgetType(this.budgetTypeId);
    //     // await this.subBudgetList.getItems();
    //   } else {
    //     this.budgetTypeId = data.budgettype_id;
    //     await this.subBudgetList.setBudgetType(this.budgetDetailId);
    //   }
    // }


    if (this.purchaseOrder.verify_committee_id) {
      this.verifyCommitteeId = this.purchaseOrder.verify_committee_id;
      await this.getCommitteePeople(this.purchaseOrder.verify_committee_id);
    }

    if (data.budget_detail_id) {
      this.viewBudgetDetailId = data.budget_detail_id;
    }

    this.searchVendor.setSelected(data.labeler_name);
    // this.searchPeople.setSelected

    if (this.contractId) {
      this.budgetRemainRef.getContractDetail(this.contractId, this.purchaseOrderId);
    }

  }

  async save() {
    this.isSaving = true;

    if (!this.editAfterApprove && this.isUpdate && this.purchaseOrderStatus === 'APPROVED') {
      // save แถบอื่นๆ
      const other: any = {
        egp_id: this.egpId,
        vendor_contact_name: this.vendorContactName,
        ship_to: this.shipTo,
        note_to_vender: this.noteToVender,
        comment: this.comment
      }
      const rs: any = await this.purchasingOrderService.updateOther(this.purchaseOrderId, other);
      if (rs.ok) {
        this.alertService.success();
        this.router.navigate(['/purchase/orders'])
      } else {
        this.modalLoading.hide();
        this.isSaving = false;
        this.alertService.error(rs.error);
      }

    } else {
      if (this.purchaseDate && this.labelerId && this.purchaseMethodId &&
        this.budgetTypeId && this.genericTypeId && this.purchaseOrderItems.length &&
        this.totalPrice > 0 && this.viewBudgetDetailId && this.verifyCommitteeId != null) {

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
          this.isSaving = false;
        }
      } else {
        this.isSaving = false;
        this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
      }
    }
  }

  async _save() {

    localStorage.setItem('budgetDetailId', this.viewBudgetDetailId.toString());
    localStorage.setItem('budgetTypeId', this.budgetTypeId.toString());
    if (this.buyerId) {
      localStorage.setItem('buyerId', this.buyerId.toString());
    } else {
      localStorage.removeItem('buyerId');
    }
    if (this.supplyId) {
      localStorage.setItem('supplyId', this.supplyId.toString());
    } else {
      localStorage.removeItem('supplyId');
    }
    if (this.headId) {
      localStorage.setItem('headId', this.headId.toString());
    } else {
      localStorage.removeItem('headId');
    }
    if (this.managerId) {
      localStorage.setItem('managerId', this.managerId.toString());
    } else {
      localStorage.removeItem('managerId');
    }
    if (this.chiefId) {
      localStorage.setItem('chiefId', this.chiefId.toString());
    } else {
      localStorage.removeItem('chiefId');
    }
    const bookNumber = await this.purchasingOrderService.getPoBookNumber();
    const idx = _.findIndex(bookNumber.rows, { purchase_order_book_number: this.purchaseOrderBookNumber });
    if (((!this.dupBookNumber && idx === -1) || this.dupBookNumber) || this.isUpdate) {
      const isErrorBidAmount: boolean = this.bidAmount < this.totalPrice;

      if (isErrorBidAmount) {
        // วงเงินเกินวิธีการจัดซื้อ
        this.alertService.error('ราคารวมสุทธิเกินวงเงินที่กำหนดตามวิธีการจัดซื้อ');
        this.isSaving = false;
      } else if (this.budgetData.remainAfterPurchase < 0) {
        this.alertService.error('ราคารวมสุทธิเกินวงเงินของสัญญา');
        this.isSaving = false;
      } else {
        const dataPurchasing: any = {};
        const summary: any = {};

        // ตรวจสอบว่ามีรายการใดที่จำนวนจัดซื้อเป็น 0 หรือ ไม่ได้ระบุราคา
        let isError = false;
        this.purchaseOrderItems.forEach((v: IProductOrderItems) => {
          if (!v.product_id || v.qty <= 0 || !v.unit_generic_id && !v.cost) {
            isError = true;
          }
        });

        if (isError) {
          this.alertService.error('กรุณาระบุรายละเอียดสินค้าให้ครบถ้วน เช่น ราคา, จำนวนจัดซื้อและหน่วยสำหรับจัดซื้อ');
          this.isSaving = false;
        } else {
          // ตรวจสอบยอดสั่งซื้อกับวงเงินของงบคงเหลือ
          if (this.budgetData.RemainAfterPurchase < 0) {
            this.alertService.error('ยอดจัดซื้อครั้งนี้ เกินกว่ายอดคงเหลือของงบประมาณ?');
            this.isSaving = false;
          } else if (this.budgetData.contractRemainAfterPurchase < 0 && this.contractId) {
            this.alertService.error('ยอดจัดซื้อครั้งนี้ เกินกว่ายอดคงเหลือของสัญญา?');
            this.isSaving = false;
          } else {
            this._canSave = false;
            this.modalLoading.show();
            // calculate new budget transaction
            await this.budgetRemainRef.getBudget();

            if (this._canSave) {
              this.modalLoading.hide();
              const text = this.edi ? 'กรุณาตรวจสอบรายการให้ถูกต้อง ต้องการบันทึกสั่งซื้อสินค้าออนไลน์ (EDI) ใช่หรือไม่?' : 'กรุณาตรวจสอบรายการให้ถูกต้อง ต้องการบันทึก ใช่หรือไม่?';
              this.alertService.confirm(text)
                .then(async () => {
                  this.doSavePurchase();
                }).catch(() => {
                  this.isSaving = false;
                });
            } else {
              this.isSaving = false;
              this.modalLoading.hide();
              this.alertService.error('ไม่สามารถประมวลผล Transaction ของงบประมาณได้')
            }
          }
        }
      }
    } else {
      this.isSaving = false;
      this.modalLoading.hide();
      this.alertService.error('เลขที่อ้างอิงซ้ำ')
    }
  }

  async doSavePurchase() {
    this.isSaving = true;
    this.modalLoading.show();
    let summary: any = {};
    // try {

    const purchaseDate = `${this.purchaseDate.date.year}-${this.purchaseDate.date.month}-${this.purchaseDate.date.day}`;

    // if (!this.showChief) {
    //   this.chiefId = null;
    // }
    // if (!this.showBuyer) {
    //   this.buyerId = null;
    // }
    const peopleCommittee = [];
    if (this.verifyCommitteeId === 0) {
      const committeeHead = {
        committee_name: 'อื่นๆ',
        committee_type: 0,
        datetime_start: moment(new Date()).format('YYYY-MM-DD'),
        is_delete: 'Y'
      }
      const committeeHeadIdRs: any = await this.committeeService.save(committeeHead);
      if (committeeHeadIdRs.ok) {
        this.verifyCommitteeId = committeeHeadIdRs.rows[0];

        if (this.peopleId1) {
          const committeeDetail = {
            committee_id: this.verifyCommitteeId,
            people_id: this.peopleId1,
            position_name: 'ประธาน'
          }
          peopleCommittee.push(committeeDetail)
        }
        if (this.peopleId2) {
          const committeeDetail = {
            committee_id: this.verifyCommitteeId,
            people_id: this.peopleId2,
            position_name: 'กรรมการ'
          }
          peopleCommittee.push(committeeDetail)
        }
        if (this.peopleId3) {
          const committeeDetail = {
            committee_id: this.verifyCommitteeId,
            people_id: this.peopleId3,
            position_name: 'กรรมการ'
          }
          peopleCommittee.push(committeeDetail)
        }
        await this.committeePeopleService.save(peopleCommittee);
      } else {
        console.log('error');

      }
    }

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
      budget_detail_id: this.viewBudgetDetailId,
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
      supply_id: this.supplyId,
      head_id: this.headId,
      manager_id: this.managerId,
      budget_year: this.budgetYear,
      is_edi: this.edi ? 'Y' : 'N'
      // is_reorder: this.isReorder === 'Y' ? 2 : this.isReorder
    };

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
      this.modalLoading.hide();
      this.isSaving = false;
      this.alertService.error(rs.error);
    }
  }

  async getPurchaseOrderDetail(orderId: string) {
    this.loading = true;
    this.modalLoading.show();

    try {
      const rs: any = await this.purchasingOrderService.detail(orderId);
      if (rs.ok) {
        this.purchaseOrder = rs.detail;
        this.isContract = rs.detail.is_contract === 'T' ? true : false;
        this.isCancel = rs.detail.is_cancel === 'Y' ? true : false;
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
      const rs: any = await this.purchasingOrderItemService.allByOrderID(orderId);
      this.modalLoading.hide();
      if (rs.ok) {
        const products = rs.rows;

        for (const v of products) {
          const obj = {
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
            small_qty: v.small_qty,
            old_qty: v.old_qty
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

    if (this.isContract === true) {
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

    if (!this.labelerId) {
      return true;
    }
    if (this.purchaseOrderItems.length === 0) {
      return true;
    }
    if (this.isCancel) {
      return true;
    }
    if (this.purchaseOrderStatus === 'COMPLETED') {
      return true;
    }
    // if (this.isContract === true)  return true;

    // if (this.purchaseOrderStatus === 'APPROVED') {
    //   if (this.accessCheck.can('PO_EDIT_AFFTER_APPROVE')) {
    //     return false;
    //   }
    //   return true;
    // }

    if (this.purchaseOrderStatus === 'CONFIRMED') {
      if (this.accessCheck.can('PO_EDIT_AFFTER_APPROVE')) {
        return false;
      }
      return true;
    }

    return false;
  }

  changeCommittee(event: any) {
    this.verifyCommitteeId = event ? event.committee_id : null;
    this.peopleId1 = null;
    this.peopleId2 = null;
    this.peopleId3 = null;
    this.getCommitteePeople(event.committee_id);

  }

  // แสดงรายชื่อกรรมการ
  async getCommitteePeople(committeeId: any) {
    this.modalLoading.show();
    if (this.purchaseOrderId) {
      if (committeeId !== 0) {
        const rs: any = await this.committeePeopleService.allByCommitteeId(committeeId);
        if (rs.ok) {
          this.committeeSelected = rs.rows;
          if (+rs.rows[0].committee_type === 0) {
            this.verifyCommitteeId = 0;
            if (rs.rows[0]) {
              this.searchPeople1.setSelected(rs.rows[0].fullname);
              this.peopleId1 = rs.rows[0].people_id;
            }
            if (rs.rows[1]) {
              this.searchPeople2.setSelected(rs.rows[1].fullname);
              this.peopleId2 = rs.rows[1].people_id;
            }
            if (rs.rows[2]) {
              this.searchPeople3.setSelected(rs.rows[2].fullname);
              this.peopleId3 = rs.rows[2].people_id;
            }
          }
        }
        this.modalLoading.hide();
      } else {
        this.searchPeople1.setSelected('');
        this.searchPeople2.setSelected('');
        this.searchPeople3.setSelected('');
        this.modalLoading.hide();
      }
    } else {
      if (committeeId !== 0) {
        const rs: any = await this.committeePeopleService.allByCommitteeId(committeeId);
        this.modalLoading.hide();
        if (rs.ok) {
          if (+rs.rows[0].committee_type === 0) {
            this.verifyCommitteeId = 0;
          }
          this.committeeSelected = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }
      } else {
        this.searchPeople1.setSelected('');
        this.searchPeople2.setSelected('');
        this.searchPeople3.setSelected('');
        this.modalLoading.hide();
      }
    }
  }

  changeOfficer(event: any) {
    this.chiefId = event ? event.officer_id : null;
  }

  changeOffice(event: any) {
    this.buyerId = event ? event.officer_id : null;
  }
  changeOffices(event: any) {
    this.supplyId = event ? event.officer_id : null;
  }
  changeOfficeHeadId(event: any) {
    this.headId = event ? event.officer_id : null;
  }

  changeManager(event: any) {
    this.managerId = event ? event.officer_id : null;
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
      this.labelerId = null;
      this.edi = false;
    }
  }

  onSelectVendor(event: any) {
    if (event) {
      if (this.oldLabelerId !== event.labeler_id) {
        this.purchaseOrderItems = [];
      }
      this.labelerId = event.labeler_id;
      this.oldLabelerId = event.labeler_id;
      this.edi = (event.is_edi === 'Y');

      this.searchProductLabeler.setApiUrl(this.labelerId);
    }
  }

  onChangePeople(event: any, idx) {
    if (event) {
      if (idx === 1) {
        this.peopleId1 = null;
      }
      if (idx === 2) {
        this.peopleId2 = null;
      }
      if (idx === 3) {
        this.peopleId3 = null;
      }

    }
  }

  onSelectPeople(event: any, idx) {
    if (event) {
      if (idx === 1) {
        this.peopleId1 = event.people_id;
      }
      if (idx === 2) {
        this.peopleId2 = event.people_id;
      }
      if (idx === 3) {
        this.peopleId3 = event.people_id;
      }
    }
  }
  async getHoliday() {
    const holiday: any = await this.holidayService.all();
    const holidays = [];
    holiday.rows.forEach(v => {
      const obj: any = {};
      if (+v.is_year === 1) {
        obj.year = moment(new Date()).get('year');
        obj.month = (moment(v.date).get('month')) + 1
        obj.day = moment(v.date).get('date')
        holidays.push(obj);
      } else {
        obj.year = moment(v.date).get('year');
        obj.month = (moment(v.date).get('month')) + 1
        obj.day = moment(v.date).get('date')
        holidays.push(obj);
      }
    });
    const objDate = { 'dates': holidays, 'color': 'red' };
    this.holidays.push(objDate);
  }
}
