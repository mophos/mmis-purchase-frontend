import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { PurchasingOrderService } from '../../share/purchasing-order.service';

@Component({
  selector: 'app-product-history',
  templateUrl: './product-history.component.html'
})
export class ProductHistoryComponent implements OnInit {

  @Input() genericId: string;
  productOrders: Array<any> = [];
  constructor(
    private purchasingOrderService: PurchasingOrderService
  ) { }

  ngOnInit() {
    this.getOrders();
  }

  async getOrders() {
    const rs: any = await this.purchasingOrderService.getProductHistory(this.genericId);
    this.productOrders = rs.rows;
    // console.log(this.productOrders);
  }

}
