import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
import { PurchasingOrderService } from './../../share/purchasing-order.service';
import { AlertService } from './../../../alert.service';
import * as moment from 'moment';
import { BudgetTransectionService } from 'app/purchase/share/budget-transection.service';
@Component({
  selector: 'app-purchase-cancel',
  templateUrl: './purchase-cancel.component.html',
  styleUrls: ['./purchase-cancel.component.css']
})
export class PurchaseCancelComponent implements OnInit {

  @Input() modalOpen: boolean;
  @Input() confirmMessage = 'คุณต้องการที่จะยกเลิกใบสั่งซื้อนี้ ใช่หรือไม่?';
  @Output() onAfterSave: EventEmitter<any> = new EventEmitter<any>(false);
  @Output() onModalOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  purchase_order_id: string;
  cancel_comment: any;
  purchaseOrderstatus: any;

  constructor(
    private ref: ChangeDetectorRef,
    private alertService: AlertService,
    private purchasingOrderService: PurchasingOrderService,
    private budgetTransectionService: BudgetTransectionService
  ) { }

  ngOnInit() {

  }

  onOpen(data: any) {
    this.alertService.confirm(this.confirmMessage).then(() => {
      this.modalOpen = true;
      this.purchase_order_id = data.purchase_order_id;
      this.cancel_comment = data.cancel_comment;
      this.purchaseOrderstatus = data.purchase_order_status;
    }).catch((error) => {

    });
  }

  cancelAll(data: Array<any>) {
    let promises: Array<any> = [];
    this.alertService.confirm(this.confirmMessage).then(() => {
      this.modalOpen = true;
      data.forEach((row) => {
        //  promises.push(this.purchasingOrderService.update(row.purchase_order_id,{
        //     cancel_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        //     is_cancel: 1
        //  }));
      });
      Promise.all(promises).then((resutl) => {
        this.alertService.success();
        this.onAfterSave.emit(true);
      }).catch((error) => {
        this.alertService.error(error);
        this.onAfterSave.emit(true);
      });
      this.modalOpen = false;
    }).catch((error) => { });
  }

  formOpenChange(e) {
    this.onModalOpenChange.emit(e);
  }

  closeModal() {

    this.modalOpen = false;
    this.onModalOpenChange.emit(false);
  }

  async onSave() {
    const bgtData = await this.budgetTransectionService.getCancel(this.purchase_order_id);
    const promises: Array<any> = [];
    let items = [];
    const data: any = {
      purchase_order_id: this.purchase_order_id,
      cancel_comment: this.cancel_comment,
      // cancel_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      is_cancel: 1,
      purchase_order_status: 'CANCEL',
      from_status: this.purchaseOrderstatus
    };

    items.push(data);
    const budgetTransection: any = {
      incoming_balance: bgtData.rows[0].incoming_balance,
      amount: bgtData.rows[0].amount,
      balance: bgtData.rows[0].balance,
      type: 'revoke'
    };

    try {
      let rs: any = await this.purchasingOrderService.updateStatus(items);
      let rs2: any = await this.budgetTransectionService.cancel(bgtData.rows[0].transection_id, budgetTransection);
      if (rs.ok && rs2.ok) {
        this.alertService.success();
        this.onAfterSave.emit(true);
        this.closeModal();
      } else {
        this.alertService.error(rs.error + ', ' + rs2.error);
        this.onAfterSave.emit(true);
        this.closeModal();
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
      this.onAfterSave.emit(true);
      this.closeModal();
    }
  }

}
