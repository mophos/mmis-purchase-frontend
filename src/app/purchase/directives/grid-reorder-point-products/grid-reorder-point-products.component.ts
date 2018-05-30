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

  @Output('onSelected') onSelected: EventEmitter<any> = new EventEmitter<any>();

  @Input('genericId')
  set setConfirmId(value: any) {
    this._genericId = value;
  }

  loading = false;
  items = [];

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
            working_code: v.working_code,
            contract_no: v.contract_no,
            contract_id: v.contract_id
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

  addPurchase(item: any) {
    this.onSelected.emit(item);
  }

}
