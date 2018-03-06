import { Component, OnInit, Input } from '@angular/core';
import { BudgetTransectionService } from '../../share/budget-transection.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'po-transaction-history',
  templateUrl: './transaction-history.component.html',
  styles: []
})
export class TransactionHistoryComponent implements OnInit {

  _budgetDetailId: any;

  @Input('budgetDetailId')
  set setBudgetDetailId(value: any) {
    this._budgetDetailId = value;
    this.getHistory();
  }
  
  transactions: any = [];

  constructor(
    private bgTransactionService: BudgetTransectionService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  async getHistory() {
    try {
      let rs: any = await this.bgTransactionService.getHistory(this._budgetDetailId);
      if (rs.ok) {
        this.transactions = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

}
