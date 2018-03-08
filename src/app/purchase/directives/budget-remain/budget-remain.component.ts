import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BudgetTransectionService } from 'app/purchase/share/budget-transection.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'po-budget-remain',
  templateUrl: './budget-remain.component.html'
})
export class BudgetRemainComponent implements OnInit {
  _budgetDetailId: any;
  budgetTypeDetail: any = {};
  _contractId: any;
  _contractAmount: number = 0;
  _budgetYear: any;
  
  totalPurchaseAmount: number = 0;
  budgetAmount: number = 0;
  budgetRemain: number = 0;
  budgetName: string;
  contractNo: string;
  purchaseAmount: number;

  @Input('purchaseAmount')
  set setPurchaseAmount(value: any) {
    this.changePurchaseAmount(value);
  } 
  
  @Input('budgetYear')
  set setBudgetYear(value: any) {
    this._budgetYear = value;
  } 
  
  @Input('budgetDetailId')
  set setBudgetDetailId(value: any) {
    this._budgetDetailId = value;
    this.getBudget();
  } 
  
  @Input('contractId')
  set setContractId(value: any) {
    this._contractId = value;
  }  
  
  @Input('purchaseOrderId') purchaseOrderId: any;

  @Output('onCalculated') onCalculated: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(
    private budgetTransactionService: BudgetTransectionService,
    private alertService: AlertService) { }

  ngOnInit() { }

  changePurchaseAmount(amount: number) {
    this.totalPurchaseAmount = +amount;
    this.returnData();
  }

  async getBalance() {
    try {
      let rs: any = await this.budgetTransactionService.getBudgetTransectionBalance(this._budgetDetailId, this.purchaseOrderId);
      if (rs.ok) {
        let totalPurchase = rs.totalPurchase ? +rs.totalPurchase : 0;
        this.budgetRemain = this.budgetAmount - totalPurchase;
        this.purchaseAmount = totalPurchase;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getBudget() {
    this.clearData();
    try {
      let rs: any = await this.budgetTransactionService.getBudgetTransection(this._budgetDetailId);
      if (rs.ok) {
        this.budgetAmount = rs.detail ? rs.detail.amount : 0;
        this.budgetName = rs.detail ? `${rs.detail.bgtype_name} (${rs.detail.bgtypesub_name})` : '-';
        
        await this.getBalance();

        this.returnData();
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }

  clearData() {
    this.budgetAmount = 0;
    this.budgetRemain = 0;
  }

  returnData() {
    let data = {
      budgetAmount: this.budgetAmount,
      budgetRemain: this.budgetRemain,
      totalPurchase: this.totalPurchaseAmount,
      remainAfterPurchase: this.budgetRemain - this.totalPurchaseAmount,
      budgetDetailId: this._budgetDetailId
    }

    this.onCalculated.emit(data);
  }

}
