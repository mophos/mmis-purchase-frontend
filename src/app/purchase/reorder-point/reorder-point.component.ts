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

@Component({
  selector: 'app-reorder-point',
  templateUrl: './reorder-point.component.html',
})
export class ReorderPointComponent implements OnInit {

  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent
  loading: boolean;
  total: number = 0;
  perPage: number = 50;

  labelerName: string;
  contractFilter: string = 'all';
  minMaxFilter: string = 'min';
  query: string;
  generic_type_id: string = null;
  products: any = [];
  generictsType: Array<any> = [];
  productsSelected: Array<any> = [];

  settingConfig: Array<any> = [];
  delivery: number;
  defaultBudgetYear: number;

  orderItems: any = [];

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
  ) { }

  async ngOnInit() {
    this.settings('PC');
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
    this.loading = true;
    let offset = +state.page.from;
    let limit = +state.page.size;
    try {

      // const res: any = await this.productService.ordersPoint(this.query, this.contractFilter, this.minMaxFilter, this.generic_type_id, limit, offset);
      // this.products = res.ok ? res.rows : [];
      // this.total = res.total || 0;
      // this.loading = false;
      // this.calReorderPointUnit();
      // this.ref.detectChanges();
      this.getProducts(this.query, limit, offset);
    } catch (error) {
      this.alertService.serverError(error);
      this.loading = false;
    }
  }

  async getProducts(q: string = '', limit: number = 100, offset: number = 0) {
    this.modalLoading.show();
    try {
      const rs: any = await this.productService.ordersPoint(q, this.contractFilter, this.minMaxFilter, this.generic_type_id, limit, offset);
      this.products = [];
      // this.products = res.ok ? res.rows : [];
      if (rs.ok) {
        rs.rows.forEach(v => {
          let obj: any = {};
          obj.generic_id = v.generic_id;
          obj.generic_name = v.generic_name;
          obj.generic_type_name = v.generic_type_name;
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
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
      this.modalLoading.hide();
    }
  }

  async getGenerictType() {
    this.modalLoading.show();
    try {
      const res: any = await this.genericTypeService.all();
      this.generictsType = res.ok ? res.rows : [];
      // if (this.generictsType.length > 0) {
      //   this.generic_type_id = this.generictsType[0].generic_type_id;
      // }
      this.modalLoading.hide();
      this.ref.detectChanges();
    } catch (error) {
      this.alertService.serverError(error);
      this.modalLoading.hide();
    }
  }

  // calReorderPointUnit() {
  //   this.products.forEach((item, index) => {
  //     let rec_amount: number = Math.ceil((item.max_qty - item.remain) / item.qty);

  //     let rec_baseunit_amount: number = Math.ceil((item.rec_amount * item.qty));
  //     if (item.remain <= item.min_qty) {
  //       item.rec_amount = isNaN(rec_amount) ? 0 : rec_amount;
  //       item.rec_baseunit_amount = isNaN(rec_baseunit_amount) ? 0 : +rec_baseunit_amount;
  //     } else {
  //       item.rec_amount = 0;
  //       item.rec_baseunit_amount = 0;
  //     }
  //   });
  // }

  getRemainStatus(data: any) {
    if (data.remain < data.min_qty) {
      return 'text-danger';
    }
    else if (data.remain > data.min_qty) {
      return 'text-info';
    }
  }

  async createPurchaseOrders() {
    let totalPrice = 0;
    let purchaseSummary: any = {};
    const purchaseOrderItems: Array<any> = [];

    let purchaseItems = [];

    this.products.forEach(v => {
      if (v.items.length) {
        v.items.forEach(x => {
          if (x.order_qty > 0) {
            purchaseItems.push(x);
          }
        })
      }
    });

    // console.log(purchaseItems);

    let labelerGroup = _.uniqBy(purchaseItems, 'v_labeler_id');
    let productItems = [];
    let poItems = [];

    if (labelerGroup.length) {
      labelerGroup.forEach((p, i) => {
        const d = new Date();
        const purchaseOrderId = d.getTime().toString() + i++;
        let totalPrice = 0;
        // purchase items
        purchaseItems.forEach(x => {
          // const total = x.order_qty * x.cost; // ((x.order_qty * x.purchase_conversion_qty) * (x.cost/x.purchase_conversion_qty));
          // totalPrice += total;
          if (x.v_labeler_id === p.v_labeler_id) {
            let obj: any = {
              purchase_order_id: purchaseOrderId,
              generic_id: x.generic_id,
              product_id: x.product_id,
              qty: x.order_qty,
              unit_price: x.cost, // / x.purchase_conversion_qty,
              unit_generic_id: x.purchase_unit_generic_id,
              total_small_qty: x.purchase_conversion_qty * x.order_qty,
              // total_price: total
            }
            productItems.push(obj);
          }
        });

        // purchase detail
        // const vat = (totalPrice * 7) / 100;
        let objP = {
          purchase_order_id: purchaseOrderId,
          purchase_order_book_number: '',
          labeler_id: p.v_labeler_id,
          is_contract: 'F',
          // sub_total: totalPrice,
          delivery: this.delivery,
          vat_rate: 7,
          // vat: vat,
          is_reorder: 1,
          budget_year: this.defaultBudgetYear,
          // total_price: totalPrice + vat,
          order_date: moment().format('YYYY-MM-DD')
        }
        poItems.push(objP);
      });

      // console.log(poItems);
      // console.log(productItems);

      this.alertService.confirm('ต้องการสร้างใบสั่งซื้อใหม่ตามรายการที่กำหนด ใช่หรือไม่?')
        .then(async () => {
          this.modalLoading.show();
          try {
            this.loading = true;
            let rs: any = await this.purchasingOrderService.saveWithOrderPoint(poItems, productItems);
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
        })

    } else {
      this.modalLoading.hide();
      this.alertService.error('กรุณาระบุรายการที่ต้องการจัดซื้อ');
    }

  }

  settings(module: string) {
    this.settingService.byModule(module)
      .then((results: any) => {
        this.settingConfig = results.rows;
        const delivery = _.find(this.settingConfig, { 'action_name': 'PC_SHIPPING_DATE' });
        this.delivery = delivery.value;
        const budgetYear = _.find(this.settingConfig, { 'action_name': 'PC_DEFAULT_BUDGET_YEAR' });
        if (budgetYear) {
          this.defaultBudgetYear = budgetYear.value;
        }
        this.ref.detectChanges();
      })
      .catch(error => {
        this.alertService.serverError(error);
      });
  }

  onSuccessReorderPoint(event: any) {
    let idx = _.findIndex(this.orderItems, { product_id: event.product_id });
    if (idx > -1) {
      this.orderItems[idx].order_qty = +event.order_qty;
    } else {
      this.orderItems.push(event);
    }

    let idxG = _.findIndex(this.products, { generic_id: event.generic_id });

    if (idxG > -1) {
      let idxP = _.findIndex(this.products[idxG].items, { product_id: event.product_id });
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
