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
@Component({
  selector: 'po-order-point',
  templateUrl: './order-point.component.html',
  styles: []
})
export class OrderPointComponent implements OnInit {

  @ViewChild('htmlPreview') public htmlPreview: HtmlPreviewComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent

  isPreview: boolean = false;
  openReservedOrder: boolean = false;

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
  perPage: number = 20;
  perPageReserved: number = 100;
  total: number = 0;
  query: any = '';
  totalReserved: number = 0;
  queryReserved: any = '';

  delivery: any;
  vatRate: number;
  defaultBudgetYear: any;

  curentPage = 1;
  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    private purchasingOrderService: PurchasingOrderService,
    private router: Router,
    @Inject('API_URL') private apiUrl: any) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    if (decodedToken) {
      this.delivery = decodedToken.PC_SHIPPING_DATE || 30;
      this.vatRate = decodedToken.PC_VAT || 7;
      this.defaultBudgetYear = decodedToken.PC_DEFAULT_BUDGET_YEAR || moment().get('year');
    }

    this.productGroup = decodedToken.generic_type_id.split(',');
  }

  public jwtHelper: JwtHelper = new JwtHelper();

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
      //this._start_date = selectDate;
    } else {

    }
  }

  onDateEndChanged(event: IMyDateModel) {
    const selectDate: any = moment(event.jsdate).format('YYYY-MM-DD');
    if (selectDate !== 'Invalid date') {
      //this._end_date = selectDate;
    } else {

    }
  }

  changeType() {
    this.curentPage = 1;
    this.getProducts(this.perPage);
  }

  changeTypeReserved() {
    this.getProductsReserved(this.perPage);
  }

  async getProducts(limit: number = 20, offset: number = 0) {
    try {
      this.modalLoading.show();
      let rs: any;
      if (this.genericTypeId === 'all') {
        rs = await this.productService.getReorderPointTrade(this.productGroup, limit, offset, this.query);
      } else {
        let productGroup: any = [];
        productGroup.push(this.genericTypeId);
        rs = await this.productService.getReorderPointTrade(productGroup, limit, offset, this.query);
      }
      this.modalLoading.hide();
      if (rs.ok) {
        this.products = rs.rows;
        this.total = rs.total || 0;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getReservedForOrders() {
    try {
      let rs: any = await this.productService.getReorderPointTradeReservedForOrdered();
      if (rs.ok) {
        this.selectedOrders = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getProductsReserved(limit: number = 20, offset: number = 0) {
    try {
      this.modalLoading.show();
      let rs: any;
      if (this.genericTypeIdReserved === 'all') {
        rs = await this.productService.getReorderPointTradeReserved(this.productGroup, limit, offset, this.queryReserved);
      } else {
        let productGroup: any = [];
        productGroup.push(this.genericTypeIdReserved);
        rs = await this.productService.getReorderPointTradeReserved(productGroup, limit, offset, this.queryReserved);
      }
      this.modalLoading.hide();
      if (rs.ok) {
        this.reservedItems = rs.rows;
        this.totalReserved = rs.total || 0;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getProductType() {
    try {
      // this.modalLoading.show();
      const rs: any = await this.productService.type(this.productGroup);
      if (rs.ok) {
        this.productType = rs.rows;
        await this.getProducts();
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
    const offset = +state.page.from;
    const limit = +state.page.size;
    this.getProducts(limit, offset);
  }

  refreshReserved(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;
    this.getProductsReserved(limit, offset);
  }

  doSearch(event: any) {
    if (event.keyCode === 13) {
      this.getProducts();
    }
  }

  doSearchReserved(event: any) {
    if (event.keyCode === 13) {
      this.getProductsReserved();
    }
  }

  async createPreparePurchaseOrder() {
    let items: any = [];

    this.selectedReserved.forEach(v => {
      if (+v.purchase_qty > 0) {
        let obj: any = {};
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
          this.getProducts();
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
    let idx = _.findIndex(this.reservedItems, { product_id: product.product_id });
    if (idx > -1) {
      this.reservedItems[idx].cost = +event.cost;
      this.reservedItems[idx].unit_generic_id = +event.unit_generic_id;
    }
  }

  onChangeQty(qty: any, product: any) {
    let idx = _.findIndex(this.reservedItems, { product_id: product.product_id });
    if (idx > -1) {
      this.reservedItems[idx].purchase_qty = +qty;
    }
  }

  removeWaiting(product: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(async () => {
        try {
          let rs: any = await this.productService.removeReservedProducts(product.reserve_id);
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
    let items = [];
    this.selectedReserved.forEach(v => {
      if (+v.purchase_qty > 0) items.push(v);
    });

    return items.length;
  }

  showReservedOrder() {
    this.openReservedOrder = true;
  }

  async createPurchaseOrders() {
    const totalPrice = 0;
    const purchaseSummary: any = {};
    const purchaseOrderItems: Array<any> = [];

    const purchaseItems = this.selectedOrders;

    // console.log(purchaseItems);

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
        // obj.contract_no = pItem.contract_no;
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

    // console.log(noContractItems);
    // console.log(contractItems);

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

        // console.log(labelerItems)

        // สร้าง product items
        for (const v of labelerItems) {
          // var rnd = new Random(Random.engines.mt19937().seedWithArray([0x12345678, 0x90abcdef]));
          const purchaseOrderId = Math.floor(new Date().valueOf() * Math.random() * new Date().getUTCMilliseconds());

          for (const i of v.items) {
            const obj: any = {};
            obj.purchase_order_id = purchaseOrderId;
            // obj.generic_type_id = i.generic_type_id;
            obj.generic_id = i.generic_id;
            obj.product_id = i.product_id;
            obj.qty = i.order_qty;
            obj.unit_price = i.purchase_cost;
            obj.unit_generic_id = i.unit_generic_id;
            obj.total_small_qty = i.conversion_qty * i.order_qty;
            obj.reserve_id = i.reserve_id;
            // obj.v_labeler_id = i.v_labeler_id;

            productItems.push(obj);
          }

          const objP = {
            purchase_order_id: purchaseOrderId,
            labeler_id: v.v_labeler_id,
            is_contract: 'N',
            delivery: this.delivery,
            vat_rate: this.vatRate,
            generic_type_id: v.generic_type_id,
            budget_year: this.defaultBudgetYear,
            // total_price: totalPrice + vat,
            order_date: moment().format('YYYY-MM-DD')
          }

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
          // var rnd = new Random(Random.engines.mt19937().seedWithArray([0x12345678, 0x90abcdef]));
          const purchaseOrderId = Math.floor(new Date().valueOf() * Math.random() * new Date().getUTCMilliseconds());

          for (const i of v.items) {
            const obj: any = {};
            obj.purchase_order_id = purchaseOrderId;
            // obj.generic_type_id = i.generic_type_id;
            obj.generic_id = i.generic_id;
            obj.product_id = i.product_id;
            obj.qty = i.order_qty;
            obj.unit_price = i.purchase_cost;
            obj.unit_generic_id = i.unit_generic_id;
            obj.total_small_qty = i.conversion_qty * i.order_qty;
            obj.reserve_id = i.reserve_id;
            // obj.v_labeler_id = i.v_labeler_id;
            // obj.contract_id = i.contract_id;
            // obj.contract_no = i.contract_no;

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
            // total_price: totalPrice + vat,
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
              this.router.navigate(['purchase/orders']);
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
}
