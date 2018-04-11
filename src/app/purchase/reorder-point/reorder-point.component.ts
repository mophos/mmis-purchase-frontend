import { GenericTypeService } from '../share/generic-type.service';
import { PurchasingOrderItemService } from './../share/purchasing-orderitem.service';
import { PurchasingOrderService } from './../share/purchasing-order.service';
import { PurchasingService } from './../share/purchasing.service';
import { ProductService } from './../share/product.service';
import { UnitService } from './../share/unit.service';
import { AlertService } from './../../alert.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { State } from '@clr/angular';
import { SettingService } from 'app/purchase/share/setting.service';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { JwtHelper } from 'angular2-jwt';

import * as Random from 'random-js';
@Component({
  selector: 'app-reorder-point',
  templateUrl: './reorder-point.component.html',
})
export class ReorderPointComponent implements OnInit {

  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent
  loading: boolean;
  total = 0;
  perPage = 50;

  labelerName: string;
  contractFilter = 'all';
  minMaxFilter = 'min';
  query: string;
  generic_type_id: string = null;
  products: any = [];
  generictsType: Array<any> = [];
  productsSelected: Array<any> = [];

  settingConfig: Array<any> = [];
  delivery: number;
  defaultBudgetYear: number;

  orderItems: any = [];
  token: any;
  jwtHelper: JwtHelper = new JwtHelper();
  vatRate: any;

  constructor(
    private ref: ChangeDetectorRef,
    private router: Router,
    private alertService: AlertService,
    private productService: ProductService,
    private unitService: UnitService,
    private purchasingService: PurchasingService,
    private purchasingOrderService: PurchasingOrderService,
    private purchasingOrderItemService: PurchasingOrderItemService,
    private genericTypeService: GenericTypeService,
    private settingService: SettingService
  ) {
    this.token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(this.token);
    if (decoded) {
      this.delivery = decoded.PC_SHIPPING_DATE || 30;
      this.vatRate = decoded.PC_VAT || 7;
      this.defaultBudgetYear = decoded.PC_DEFAULT_BUDGET_YEAR || moment().get('year');
    }
  }

  async ngOnInit() {
    await this.getGenerictType();
  }

  handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      this.getProducts(this.query);
    }
  }

  search() {
    this.getProducts(this.query);
  }

  async refresh(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;

    try {
      this.modalLoading.show();
      // if (!this.generic_type_id) this.generic_type_id = this.generictsType[0].generic_type_id;
      const rs: any = await this.productService.ordersPoint(this.query, this.contractFilter, this.generic_type_id, limit, offset);
      this.products = [];
      if (rs.ok) {
        rs.rows.forEach(v => {
          const obj: any = {};
          obj.generic_id = v.generic_id;
          obj.generic_name = v.generic_name;
          obj.generic_type_name = v.generic_type_name;
          obj.generic_type_id = v.generic_type_id;
          obj.max_qty = v.max_qty;
          obj.min_qty = v.min_qty;
          obj.primary_unit_name = v.primary_unit_name;
          obj.remain_qty = v.remain_qty;
          obj.working_code = v.working_code;
          obj.total_purchased = v.total_purchased;
          obj.items = [];

          this.products.push(obj);
        });

        this.total = rs.total || 0;
        this.modalLoading.hide();
        // this.calReorderPointUnit();
      } else {
        this.modalLoading.hide();
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
      this.modalLoading.hide();
    }
  }

  async getProducts(q: string = '', limit: number = 100, offset: number = 0) {
    this.modalLoading.show();
    try {
      // if (!this.generic_type_id) this.generic_type_id = this.generictsType[0].generic_type_id;
      const rs: any = await this.productService.ordersPoint(q, this.contractFilter, this.generic_type_id, limit, offset);
      this.products = [];
      // this.products = res.ok ? res.rows : [];
      if (rs.ok) {
        rs.rows.forEach(v => {
          const obj: any = {};
          obj.generic_id = v.generic_id;
          obj.generic_name = v.generic_name;
          obj.generic_type_name = v.generic_type_name;
          obj.generic_type_id = v.generic_type_id;
          obj.max_qty = v.max_qty;
          obj.min_qty = v.min_qty;
          obj.primary_unit_name = v.primary_unit_name;
          obj.remain_qty = v.remain_qty;
          obj.working_code = v.working_code;
          obj.total_purchased = v.total_purchased;
          obj.items = [];

          this.products.push(obj);
        });

        this.total = rs.total || 0;
        this.modalLoading.hide();
        // this.calReorderPointUnit();
      } else {
        this.modalLoading.hide();
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
      this.modalLoading.hide();
    }
  }

  async getGenerictType() {
    // this.modalLoading.show();
    try {
      const res: any = await this.genericTypeService.all();

      const decoded = this.jwtHelper.decodeToken(this.token);
      const genericIds = decoded.generic_type_id ? decoded.generic_type_id.split(',') : [];

      const data = res.ok ? res.rows : [];

      data.forEach(v => {
        genericIds.forEach(i => {
          if (+i === +v.generic_type_id) {
            this.generictsType.push(v);
          }
        })
      })

      // this.modalLoading.hide();
      // this.ref.detectChanges();
    } catch (error) {
      this.alertService.serverError(error);
      // this.modalLoading.hide();
    }
  }

  getRemainStatus(data: any) {
    if (data.remain < data.min_qty) {
      return 'text-danger';
    } else if (data.remain > data.min_qty) {
      return 'text-info';
    }
  }

  async createPurchaseOrders() {
    const totalPrice = 0;
    const purchaseSummary: any = {};
    const purchaseOrderItems: Array<any> = [];

    const purchaseItems = [];

    this.products.forEach(v => {
      if (v.items.length) {
        v.items.forEach(x => {
          if (x.order_qty > 0) {
            x.generic_type_id = v.generic_type_id;
            purchaseItems.push(x);
          }
        })
      }
    });

    // console.log(purchaseItems);

    // group by contract
    const contractItems = [];
    const noContractItems = [];

    // group by generictypes
    const genericGroups = _.uniqBy(purchaseItems, 'generic_type_id');
    const genericTypeItems = [];
    // จัดกลุ่มตาม Generic types
    genericGroups.forEach(g => {
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
        obj.contract_no = pItem.contract_no;
        obj.conversion_qty = pItem.conversion_qty;
        obj.generic_id = pItem.generic_id;
        obj.m_labeler_id = pItem.m_labeler_id;
        obj.v_labeler_id = pItem.v_labeler_id;
        obj.purchase_cost = pItem.purchase_cost;
        obj.unit_generic_id = pItem.unit_generic_id;
        obj.order_qty = pItem.order_qty;
        obj.product_id = pItem.product_id
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
          try {
            this.loading = true;
            const rs: any = await this.purchasingOrderService.saveWithOrderPoint(poItems, productItems);
            this.modalLoading.hide();
            // console.log(rs);
            if (rs.ok) {
              this.alertService.success();
              this.productsSelected = [];
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

  onSuccessReorderPoint(event: any) {
    const idx = _.findIndex(this.orderItems, { product_id: event.product_id });
    if (idx > -1) {
      this.orderItems[idx].order_qty = +event.order_qty;
      this.orderItems[idx].purchase_cost = +event.purchase_cost;
      this.orderItems[idx].conversion_qty = +event.conversion_qty;

    } else {
      this.orderItems.push(event);
    }

    const idxG = _.findIndex(this.products, { generic_id: event.generic_id });

    if (idxG > -1) {
      const idxP = _.findIndex(this.products[idxG].items, { product_id: event.product_id });
      if (idxP > -1) {
        this.products[idxG].items[idxP].order_qty = +event.order_qty;
      } else {
        this.products[idxG].items.push(event);
      }

      let totalOrder = 0;

      this.products[idxG].items.forEach(v => {
        totalOrder += (v.order_qty * v.conversion_qty);
      });

      this.products[idxG].order_qty = totalOrder;
    }
  }

}
