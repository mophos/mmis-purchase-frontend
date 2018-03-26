import { PurchasingOrderService } from './../share/purchasing-order.service';
import { PurchasingOrderItemService } from './../share/purchasing-orderitem.service';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'app-expand-purchase-order',
  templateUrl: './expand-purchase-order.component.html',
  styleUrls: ['./expand-purchase-order.component.css']
})
export class ExpandPurchaseOrderComponent implements OnInit {

  @Input() purchaseOrderId: string;

  loading: boolean;
  vat_rate: any;
  purchaseOrderItems: Array<any> = [];
  purchaseOrder: any = {};

  totalPrice = 0;

  constructor(
    private purchasingOrderItemService: PurchasingOrderItemService,
    private purchasingOrderService: PurchasingOrderService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    await this.getPurchaseOrderItems(this.purchaseOrderId);
    await this.getPurchaseOrderDetail(this.purchaseOrderId)
  }

  getPurchaseOrderItems(orderId: string) {
    this.loading = true;
    this.purchasingOrderItemService.allByOrderID(orderId)
      .then((results: any) => {
        this.purchaseOrderItems = results.rows;
        results.rows.forEach(v => {
          this.totalPrice += v.unit_price * v.qty;
        });
        
        this.ref.detectChanges();
        this.loading = false;
      })
      .catch(error => {
        this.alertService.serverError(error);
      });
  }

  getPurchaseOrderDetail(orderId: string) {
    this.loading = true;
    this.purchasingOrderService.detail(orderId)
      .then((results: any) => {
          this.purchaseOrder = results.detail;
          this.ref.detectChanges();
          this.loading = false;
      })
      .catch(error => {
          this.alertService.serverError(error);
      });
  }

}
