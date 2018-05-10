import { PurchasingOrderService } from './../share/purchasing-order.service';
import { Component, OnInit } from '@angular/core';
import { State } from '@clr/angular';

@Component({
  selector: 'po-history-order',
  templateUrl: './history-order.component.html',
  styleUrls: ['./history-order.component.css']
})
export class HistoryOrderComponent implements OnInit {

  sort: any = {};
  genericOrders: any;
  totalGeneric: any;
  perPage = 15;
  query: any;
  constructor(private purchasingOrderService: PurchasingOrderService) { }

  ngOnInit() {
  }

  async getOrders() {
    const rs: any = await this.purchasingOrderService.getGeneric();
    this.genericOrders = rs.rows;
  }

  async refresh(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;
    this.sort = state.sort;

    if (this.query) {
      const rs: any = await this.purchasingOrderService.getGenericSearch(limit, offset, this.query, this.sort);
      this.genericOrders = rs.rows;
    } else {
      const rs: any = await this.purchasingOrderService.getGeneric(limit, offset, this.sort);
      this.genericOrders = rs.rows;
      this.totalGeneric = +rs.total;
    }
  }

  keyupQuery(event) {
    this.doSearch();
  }

  async doSearch() {
    if (this.query) {
      const rs: any = await this.purchasingOrderService.getGenericSearch(this.perPage, 0, this.query, this.sort);
      this.genericOrders = rs.rows;
      this.totalGeneric = +rs.total;
    } else {
      const rs: any = await this.purchasingOrderService.getGeneric(this.perPage, 0);
      this.genericOrders = rs.rows;
      this.totalGeneric = +rs.total;
    }
  }
}
