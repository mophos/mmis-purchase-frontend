import { CommitteeService } from './../share/committee.service';

import { CommitteePeopleService } from './../share/committee-people.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyDateModel } from 'mydatepicker-th';
import * as moment from 'moment';
import * as _ from 'lodash';

import { HtmlPreviewComponent } from 'app/helper/html-preview/html-preview.component';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { ProductService } from 'app/purchase/share/product.service';
import { JwtHelper } from 'angular2-jwt';
import { AlertService } from 'app/alert.service';
import { State } from '@clr/angular';
import { PurchasingOrderService } from 'app/purchase/share/purchasing-order.service';
import { Router } from '@angular/router';
import { SelectSubBudgetComponent } from '../../select-boxes/select-sub-budget/select-sub-budget.component';
import { SearchPeopleComponent } from '../../autocomplete/search-people/search-people.component';
@Component({
  selector: 'app-order-point',
  templateUrl: './order-point.component.html',
  styles: []
})
export class OrderPointComponent implements OnInit {

  @ViewChild('htmlPreview') public htmlPreview: HtmlPreviewComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent
  @ViewChild('subBudgetList') subBudgetList: SelectSubBudgetComponent;
  @ViewChild('searchPeople1') searchPeople1: SearchPeopleComponent;
  @ViewChild('searchPeople2') searchPeople2: SearchPeopleComponent;
  @ViewChild('searchPeople3') searchPeople3: SearchPeopleComponent;
  showNotPurchased = false;
  isPreview = false;
  openReservedOrder = false;

  products: any = [];
  reservedItems: any = [];
  selectedProduct: any = [];
  selectedReserved: any = [];
  selectedOrders: any = [];
  selectedOrdersReserved: any = [];
  printProducts: any = [];
  genericTypeId = 'all';
  genericTypeIdReserved = 'all';
  productGroup: any;
  productType: Array<any> = [];

  token: any;
  perPage = 20;
  perPageReserved = 100;
  total = 0;
  query: any = '';
  totalReserved = 0;
  queryReserved: any = '';

  delivery: any;
  vatRate: number;
  defaultBudgetYear: any;

  curentPage = 1;
  modalCreatePurchaseOrders = false;
  public jwtHelper: JwtHelper = new JwtHelper();
  offsetSet = 0;

  budgetYear: any;
  budgetTypeId: any;
  onePO = true;
  committeeSelected = [];
  committeeId: any;
  verifyCommitteeId: any;
  chiefId: any;
  buyerId: any;
  peopleId1: any;
  peopleId2: any;
  peopleId3: any;
  budgetDetailId: any;
  purchaseTypeId: any;
  purchaseMethodId: any;
  bidAmount: any;
  showChief = true;
  showBuyer = true;
  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    private purchasingOrderService: PurchasingOrderService,
    private router: Router,
    private committeePeopleService: CommitteePeopleService,
    private committeeService: CommitteeService,
    @Inject('API_URL') private apiUrl: any) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    if (decodedToken) {
      this.delivery = decodedToken.PC_SHIPPING_DATE || 30;
      this.vatRate = decodedToken.PC_VAT || 7;
      // this.defaultBudgetYear = decodedToken.PC_DEFAULT_BUDGET_YEAR || moment().get('year');
    }
    let year = moment().get('year');
    const month = moment().get('month') + 1;
    if (month >= 10) {
      year += 1;
    }
    this.defaultBudgetYear = year;
    this.budgetYear = year;
    this.productGroup = decodedToken.generic_type_id.split(',');
  }

  async ngOnInit() {
    this.getProductType();
    await this.getProductsReserved();
    await this.getReservedForOrders();
  }

  printProduct() {
    this.selectedReserved.forEach(v => {
      this.printProducts.push(v.product_id);
    });

    let productIds = '';
    this.printProducts.forEach((v: any) => {
      productIds += `product_id=${v}&`;
    });

    const url = `${this.apiUrl}/report/list/purchase-trade-select/?token=${this.token}&${productIds}`;
    this.htmlPreview.showReport(url);

    this.printProducts = [];
    this.selectedReserved = [];
  }

  onDateStartChanged(event: IMyDateModel) {
    const selectDate: any = moment(event.jsdate).format('YYYY-MM-DD');
    if (selectDate !== 'Invalid date') {
      // this._start_date = selectDate;
    } else {

    }
  }

  onDateEndChanged(event: IMyDateModel) {
    const selectDate: any = moment(event.jsdate).format('YYYY-MM-DD');
    if (selectDate !== 'Invalid date') {
      // this._end_date = selectDate;
    } else {

    }
  }

  changeType() {
    this.curentPage = 1;
    this.getGenerics(this.perPage);
  }

  changeTypeReserved() {
    this.getProductsReserved(this.perPage);
  }

  async getGenerics(limit: number = 20, offset: number = 0, sort: any = {}) {
    try {
      this.products = [];
      this.modalLoading.show();
      let rs: any;
      let showNotPurchased = this.showNotPurchased ? 'Y' : 'N';
      if (this.genericTypeId === 'all') {
        rs = await this.productService.getReorderPointGeneric(this.productGroup, limit, offset, this.query, showNotPurchased, sort);
      } else {
        const productGroup: any = [];
        productGroup.push(this.genericTypeId);
        rs = await this.productService.getReorderPointGeneric(productGroup, limit, offset, this.query, showNotPurchased, sort);
      }
      if (rs.ok) {
        // this.products = rs.rows;
        rs.rows.forEach(v => {
          let obj: any = {
            generic_id: v.generic_id,
            generic_name: v.generic_name,
            generic_type_name: v.generic_type_name,
            max_qty: v.max_qty,
            min_qty: v.min_qty,
            remain_qty: v.remain_qty,
            total_purchased: v.total_purchased,
            working_code: v.working_code,
            items: []
          };

          this.products.push(obj);

        });

        this.total = rs.total || 0;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getReservedForOrders() {
    try {
      const rs: any = await this.productService.getReorderPointTradeReservedForOrdered();
      if (rs.ok) {
        this.selectedOrders = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getProductsReserved(limit: number = 20, offset: number = 0, sort: any = {}) {
    try {
      // this.modalLoading.show();
      let rs: any;
      if (this.genericTypeIdReserved === 'all') {
        rs = await this.productService.getReorderPointTradeReserved(this.productGroup, limit, offset, this.queryReserved, sort);
      } else {
        const productGroup: any = [];
        productGroup.push(this.genericTypeIdReserved);
        rs = await this.productService.getReorderPointTradeReserved(productGroup, limit, offset, this.queryReserved, sort);
      }
      // this.modalLoading.hide();
      if (rs.ok) {
        this.reservedItems = rs.rows;
        this.totalReserved = rs.total || 0;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      // this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getProductType() {
    try {
      // this.modalLoading.show();
      const rs: any = await this.productService.type(this.productGroup);
      if (rs.ok) {
        this.productType = rs.rows;
        await this.getGenerics();
      } else {
        // this.modalLoading.hide();
        this.alertService.error(rs.error);
      }

    } catch (error) {
      // this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  refresh(state: State) {
    let offset = this.offsetSet = +state.page.from;
    let limit = +state.page.size;
    let sort = state.sort;
    this.getGenerics(limit, offset, sort);
  }

  refreshReserved(state: State) {
    let offset = +state.page.from;
    let limit = +state.page.size;
    let sort = state.sort;

    this.getProductsReserved(limit, offset, sort);
  }

  doSearch(event: any) {
    if (event.keyCode === 13) {
      this.getGenerics();
    }
  }

  doSearchReserved(event: any) {
    if (event.keyCode === 13) {
      this.getProductsReserved();
    }
  }

  async createPreparePurchaseOrder() {

    const items: any = [];

    this.selectedReserved.forEach(v => {
      if (+v.purchase_qty > 0) {
        const obj: any = {};
        obj.generic_id = v.generic_id;
        obj.unit_generic_id = v.unit_generic_id;
        obj.cost = v.cost;
        obj.purchase_qty = +v.purchase_qty; // pack unit
        obj.product_id = v.product_id;
        obj.contract_id = v.contract_id || null;
        obj.reserve_id = v.reserve_id;

        items.push(obj);
      }
    });

    if (items.length) {
      try {
        const rs: any = await this.productService.updateTradeReserved(items);
        if (rs.ok) {
          this.alertService.success();
          this.getProductsReserved();
          this.getReservedForOrders();
          this.selectedReserved = [];
        } else {
          this.alertService.error(rs.error);
        }
      } catch (error) {
        this.alertService.error(JSON.stringify(error));
      }
    } else {
      this.alertService.error('กรุณาระบุจำนวนที่ต้องการสั่งซื้อ');
    }
  }

  async saveReserved() {
    if (this.selectedProduct.length) {
      try {
        this.curentPage = 1;
        const items: any = [];
        this.selectedProduct.forEach(v => {
          const obj: any = {};
          obj.product_id = v.product_id;
          obj.generic_id = v.generic_id;
          items.push(obj);
        });
        this.selectedProduct = [];
        this.modalLoading.show();
        const rs: any = await this.productService.saveReservedProducts(items);
        if (rs.ok) {
          this.alertService.success();
          this.getGenerics();
          this.getReservedForOrders();
          this.getProductsReserved();
        } else {
          this.alertService.error(rs.error);
        }
        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        console.log(error);
        this.alertService.error(error);
      }
    } else {
      this.alertService.error('กรุณาเลือกรายการที่ต้องการ')
    }
  }

  onChangeUnit(event: any, product: any) {
    const idx = _.findIndex(this.reservedItems, { product_id: product.product_id });
    if (idx > -1) {
      this.reservedItems[idx].cost = +event.cost;
      this.reservedItems[idx].unit_generic_id = +event.unit_generic_id;
    }
  }

  onChangeQty(qty: any, product: any) {
    const idx = _.findIndex(this.reservedItems, { product_id: product.product_id });
    if (idx > -1) {
      this.reservedItems[idx].purchase_qty = +qty;
    }
  }

  removeWaiting(product: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(async () => {
        try {
          const rs: any = await this.productService.removeReservedProducts(product.reserve_id);
          if (rs.ok) {
            this.alertService.success();
            this.getProductsReserved();
            this.getReservedForOrders();
            this.clearSelected();
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.alertService.error(JSON.stringify(error));
        }
      }).catch(() => { });
  }

  clearSelected() {
    this.selectedProduct = [];
    this.selectedReserved = [];
    this.selectedOrdersReserved = [];
  }

  getSelectedPrepare() {
    const items = [];
    this.selectedReserved.forEach(v => {
      if (+v.purchase_qty > 0) {
      } items.push(v);
    });

    return items.length;
  }

  showReservedOrder() {
    this.openReservedOrder = true;
  }

  // createPurchaseOrders() {
  //   console.log(this.onePO, this.budgetTypeId, this.budgetDetailId);
  //   console.log(this.oneCom, this.chiefId, this.buyerId, this.verifyCommitteeId);
  //   console.log(this.peopleId1, this.peopleId2, this.peopleId3);

  // }
  async createPurchaseOrders() {
    const purchaseItems = this.selectedOrdersReserved;

    // group by contract
    const contractItems = [];
    const noContractItems = [];

    // group by generictypes
    const genericGroups = _.uniqBy(purchaseItems, 'generic_type_id');
    const genericTypeItems = [];
    // จัดกลุ่มตาม Generic types
    genericGroups.forEach((g: any) => {
      const objG: any = [];
      objG.generic_type_id = g.generic_type_id;
      objG.items = [];

      purchaseItems.forEach(item => {
        if (item.generic_type_id === g.generic_type_id) {
          objG.items.push(item);
        }
      });

      genericTypeItems.push(objG);
    });

    const itemsByGenericsType = [];

    for (const gItem of genericTypeItems) {
      for (const pItem of gItem.items) {
        const obj: any = {};
        obj.generic_type_id = pItem.generic_type_id;
        obj.contract_id = pItem.contract_id;
        obj.conversion_qty = pItem.conversion_qty;
        obj.generic_id = pItem.generic_id;
        obj.m_labeler_id = pItem.m_labeler_id;
        obj.v_labeler_id = pItem.v_labeler_id;
        obj.purchase_cost = pItem.purchase_cost;
        obj.unit_generic_id = pItem.unit_generic_id;
        obj.order_qty = pItem.order_qty;
        obj.product_id = pItem.product_id;
        obj.reserve_id = pItem.reserve_id;
        itemsByGenericsType.push(obj);
      }
    }

    // แยกสัญญา และไม่ใช่สัญญา

    itemsByGenericsType.forEach(v => {
      if (v.contract_id) {
        contractItems.push(v);
      } else {
        noContractItems.push(v);
      }
    });

    const productItems = [];
    const poItems = [];

    if (contractItems.length || noContractItems.length) {

      if (noContractItems.length) {
        // group by labeler
        const labelerItems = [];
        const labelerGroups = _.uniqBy(noContractItems, 'v_labeler_id');

        for (const l of labelerGroups) {
          const obj: any = {};
          obj.v_labeler_id = l.v_labeler_id;
          obj.generic_type_id = l.generic_type_id;
          obj.items = [];
          for (const i of noContractItems) {
            if (i.v_labeler_id === l.v_labeler_id && i.generic_type_id === l.generic_type_id) {
              obj.items.push(i);
            }
          }
          labelerItems.push(obj);
        }
        // สร้าง product items
        for (const v of labelerItems) {
          const purchaseOrderId = Math.floor(new Date().valueOf() * Math.random() * new Date().getUTCMilliseconds());

          for (const i of v.items) {
            const obj: any = {};
            obj.purchase_order_id = purchaseOrderId;
            obj.generic_id = i.generic_id;
            obj.product_id = i.product_id;
            obj.qty = i.order_qty;
            obj.unit_price = i.purchase_cost;
            obj.unit_generic_id = i.unit_generic_id;
            obj.total_small_qty = i.conversion_qty * i.order_qty;
            obj.reserve_id = i.reserve_id;
            productItems.push(obj);
          }

          const objP: any = {
            purchase_order_id: purchaseOrderId,
            labeler_id: v.v_labeler_id,
            is_contract: 'N',
            delivery: this.delivery,
            vat_rate: this.vatRate,
            generic_type_id: v.generic_type_id,
            budget_year: this.defaultBudgetYear,
            order_date: moment().format('YYYY-MM-DD')
          }
          if (!this.showChief) {
            this.chiefId = null;
          }
          if (!this.showBuyer) {
            this.buyerId = null;
          }
          if (!this.onePO) {
            objP.purchase_order_status = 'PREPARED';
            objP.budget_detail_id = this.budgetDetailId;
            objP.budgettype_id = this.budgetTypeId
            objP.purchase_type_id = this.purchaseTypeId;
            objP.purchase_method_id = this.purchaseMethodId;
            objP.buyer_id = this.buyerId;
            objP.chief_id = this.chiefId;
          }


          // open committee
          const peopleCommittee = [];
          if (this.verifyCommitteeId === 0) {
            const committeeHead = {
              committee_name: 'อื่นๆ',
              committee_type: 0,
              datetime_start: moment(new Date()).format('YYYY-MM-DD'),
              is_delete: 'Y'
            }
            const committeeHeadIdRs: any = await this.committeeService.save(committeeHead);
            // console.log(committeeHeadIdRs);
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
          // close committee
          objP.verify_committee_id = this.verifyCommitteeId
          poItems.push(objP);
        }
      }

      // มีสัญญา
      if (contractItems.length) {
        // group by labeler
        const ctItems = [];
        const contractGroups = _.uniqBy(contractItems, 'contract_id');

        for (const l of contractGroups) {
          const obj: any = {};
          obj.contract_id = l.contract_id;
          obj.generic_type_id = l.generic_type_id;
          obj.v_labeler_id = l.v_labeler_id;

          obj.items = [];
          for (const i of contractItems) {
            if (i.contract_id === l.contract_id && i.generic_type_id === l.generic_type_id) {
              obj.items.push(i);
            }
          }

          ctItems.push(obj);

        }
        // สร้าง product items
        for (const v of ctItems) {
          const purchaseOrderId = Math.floor(new Date().valueOf() * Math.random() * new Date().getUTCMilliseconds());

          for (const i of v.items) {
            const obj: any = {};
            obj.purchase_order_id = purchaseOrderId;
            obj.generic_id = i.generic_id;
            obj.product_id = i.product_id;
            obj.qty = i.order_qty;
            obj.unit_price = i.purchase_cost;
            obj.unit_generic_id = i.unit_generic_id;
            obj.total_small_qty = i.conversion_qty * i.order_qty;
            obj.reserve_id = i.reserve_id;

            productItems.push(obj);
          }

          const objP = {
            purchase_order_id: purchaseOrderId,
            labeler_id: v.v_labeler_id,
            contract_id: v.contract_id,
            is_contract: 'Y',
            delivery: this.delivery,
            vat_rate: this.vatRate,
            generic_type_id: v.generic_type_id,
            budget_year: this.defaultBudgetYear,
            order_date: moment().format('YYYY-MM-DD')
          }

          poItems.push(objP);
        }
      }

      this.alertService.confirm('ต้องการสร้างใบสั่งซื้อใหม่ตามรายการที่กำหนด ใช่หรือไม่?')
        .then(async () => {
          this.modalLoading.show();
          // console.log(poItems);
          // console.log(productItems);
          try {
            const rs: any = await this.purchasingOrderService.saveWithOrderPoint(poItems, productItems);
            this.modalLoading.hide();
            // console.log(rs);
            if (rs.ok) {
              this.alertService.success();
              // this.router.navigate(['purchase/orders']);
              this.getReservedForOrders();
            } else {
              this.alertService.error(rs.error);
            }

          } catch (error) {
            this.modalLoading.hide();
            this.alertService.error(error.message);
          }
        })
        .catch(() => {
          this.modalLoading.hide();
        });

    } else {
      this.modalLoading.hide();
      this.alertService.error('กรุณาระบุรายการที่ต้องการจัดซื้อ');
    }

  }

  onChangePurchaseStatus() {
    this.curentPage = 1;
    this.getGenerics(this.perPage);
  }

  async onSelectedProduct(event: any) {
    const items: any = [];
    const item: any = {};
    item.product_id = event.product_id;
    item.generic_id = event.generic_id;
    items.push(item);

    this.modalLoading.show();
    // save reserved
    const rs: any = await this.productService.saveReservedProducts(items);
    if (rs.ok) {
      this.alertService.success();
      // remove generic selected
      const idx = _.findIndex(this.products, { generic_id: event.generic_id });
      if (idx > -1) {
        this.products.splice(idx, 1);
      }
      // get reserved items
      await this.getGenerics(this.perPage, this.offsetSet);
      await this.getProductsReserved();
      // await this.getReservedForOrders();
    } else {
      this.alertService.error(rs.error);
    }
    this.modalLoading.hide();

  }

  onChangeBudgetType(e) {
    console.log(e);
    this.budgetTypeId = e.bgtype_id;

  }

  onChangeSubBudget(event: any) {
    this.budgetDetailId = event ? event.bgdetail_id : null;
  }

  changeRadio() {
    this.onePO = !this.onePO;
  }

  onChangePeople(e, i) {
    console.log(e, i);

  }

  async getCommitteePeople(committeeId: any) {
    this.modalLoading.show();
    // if (this.purchaseOrderId) {
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
  }


  changeOfficer(event: any) {
    this.chiefId = event ? event.people_id : null;
  }

  changeOffice(event: any) {
    this.buyerId = event ? event.people_id : null;
  }

  changeCommittee(event: any) {
    this.verifyCommitteeId = event ? event.committee_id : null;
    this.peopleId1 = null;
    this.peopleId2 = null;
    this.peopleId3 = null;
    this.getCommitteePeople(event.committee_id);
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

  onChangePurchaseType(event: any) {
    this.purchaseTypeId = event.bid_id;
  }

  onChangePurchaseMethod(event: any) {
    this.purchaseMethodId = event ? event.id : null;
    this.bidAmount = event ? event.f_amount : 0;
  }

  onChangeGenericType(genericTypeId: string) {
    // this.tempPrice = false;
    this.genericTypeId = genericTypeId;
  }

}
