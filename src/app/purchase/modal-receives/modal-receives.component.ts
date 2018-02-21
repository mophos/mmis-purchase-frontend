import { Component, OnInit } from '@angular/core';
import { ReceiveService } from 'app/purchase/share/receive.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'app-modal-receives',
  templateUrl: './modal-receives.component.html',
  styles: []
})
export class ModalReceivesComponent implements OnInit {
  open: boolean = false;
  receives: any = [];
  purchaseOrderId: any;
  purchaseOrderCode: any;
  loading = false;

  constructor(private receiveService: ReceiveService, private alertService: AlertService) { }

  ngOnInit() {
  }

  show(pro: any) {
    console.log(pro);
    this.purchaseOrderId = pro.purchase_order_id;
    this.purchaseOrderCode = pro.purchase_order_number;
    this.getProductList();
    this.open = true;
  } 

  hide() {
    this.open = false;
  }

  async getProductList() {
    try {
      this.loading = true;
      const result: any = await this.receiveService.getReceives(this.purchaseOrderId)
      this.loading = false;
      if (result.ok) {
        this.receives = result.rows;
      } else {
        console.log(result.error);
        this.alertService.error();
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}
