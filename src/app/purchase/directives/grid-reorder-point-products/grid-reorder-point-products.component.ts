import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as _ from 'lodash';
import { ProductService } from 'app/purchase/share/product.service';

@Component({
  selector: 'app-grid-reorder-point-products',
  templateUrl: './grid-reorder-point-products.component.html',
  styles: []
})
export class GridReorderPointProductsComponent implements OnInit {

  _genericId: any;
  _productItems: any = [];
  _baseUnitName: any;

  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Input() genericId: any;
  @Input('baseUnitName')
  set setBaseUnitName(value: any) {
    this._baseUnitName = value;
  }

  @Input('genericId')
  set setConfirmId(value: any) {
    this._genericId = value;
  }

  @Input('productItems')
  set setConfirmItems(value: any) {
    this._productItems = value;
  }

  loading = false;
  items = [];
  currentTotalSmallQty = 0;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getProductItems();
  }

  async getProductItems() {
    try {
      this.loading = true;
      let rs: any = await this.productService.getProductsListByGeneric(this._genericId);
      if (rs.ok) {
        // this.items = rs.rows;
        rs.rows.forEach(v => {
          let obj: any = {
            conversion_qty: v.conversion_qty,
            from_unit_name: v.from_unit_name,
            generic_id: v.generic_id,
            is_lot_control: v.is_lot_control,
            m_labeler_id: v.m_labeler_id,
            m_labeler_name: v.m_labeler_name,
            order_qty: v.order_qty,
            primary_unit_id: v.primary_unit_id,
            primary_unit_name: v.primary_unit_name,
            product_id: v.product_id,
            product_name: v.product_name,
            purchase_cost: v.purchase_cost,
            purchase_unit_id: v.purchase_unit_id,
            remain_qty: v.remain_qty,
            to_unit_name: v.to_unit_name,
            unit_generic_id: v.unit_generic_id,
            v_labeler_id: v.v_labeler_id,
            v_labeler_name: v.v_labeler_name,
            working_code: v.working_code
          }

          let _idx = _.findIndex(this._productItems, { product_id: v.product_id });
          if (_idx > -1) {
            obj.order_qty = this._productItems[_idx].order_qty;
          }

          this.items.push(obj);
        });
      } else {
        console.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  onChangeQty(product: any, qty: any) {
    let idx = _.findIndex(this.items, { product_id: product.product_id });

    if (idx > -1) {
      if (qty) {
        this.items[idx].order_qty = qty;
      } else {
        this.items[idx].order_qty = 0;
      }
      this.onSuccess.emit(this.items[idx]);
    }
  }

  onChangeUnit(event: any, product: any) {
    let idx = _.findIndex(this.items, { product_id: product.product_id });
    if (idx > -1) {
      this.items[idx].cost = +event.cost;
      this.items[idx].purchase_unit_generic_id = event.unit_generic_id;
      this.items[idx].purchase_conversion_qty = event.qty;

      this.onSuccess.emit(this.items[idx]);
    }
    /*
    cost:4.1
    from_unit_id:124
    from_unit_name:"BOX"
    qty:1
    to_unit_id:99
    to_unit_name:"AMP"
    unit_generic_id:12762
    */
  }
}
