import { BudgetTransectionService } from './../../share/budget-transection.service';
import { AlertService } from './../../../alert.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-po',
  templateUrl: './transaction-po.component.html',
  styleUrls: ['./transaction-po.component.css']
})
export class TransactionPoComponent implements OnInit {
  @Input('purchaseOrderId') purchaseOrderId;
  transactionPo: any = [];
  loading: boolean;

  constructor(
    private alertService: AlertService,
    private budgetTransectionService: BudgetTransectionService
  ) { }

  ngOnInit() {
    if (this.purchaseOrderId) {
      this.getTransactionPo(this.purchaseOrderId);
    }
  }

  getTransactionPo(pid: any) {
    this.loading = true;
    this.budgetTransectionService.getPoTransection(pid)
      .then((results: any) => {
        this.transactionPo = results.rows;
        this.loading = false;
      })
      .catch(error => {
        this.alertService.serverError(error);
        this.loading = false;
      });
  }
}
