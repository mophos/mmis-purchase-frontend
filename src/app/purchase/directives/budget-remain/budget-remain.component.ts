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

  @Input('purchaseAmount')
  set setPurchaseAmount(value: any) {
    this.totalPurchaseAmount = value;
  } 
  

  @Input('budgetYear')
  set setBudgetYear(value: any) {
    this._budgetYear = value;
  } 
  
  @Input('budgetDetailId')
  set setBudgetDetailId(value: any) {
    this._budgetDetailId = value;
    this.getBudgetRemain();
  } 
  
  @Input('contractId')
  set setContractId(value: any) {
    this._contractId = value;
  }  

  @Output('onCalculated') onChange: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private budgetTransactionService: BudgetTransectionService, private alertService: AlertService) {  }

  ngOnInit() { 
    this.getBudgetRemain();
  }

  async getBudgetRemain() {
    try {
      let rs: any = await this.budgetTransactionService.getBudgetTransection(this._budgetYear, this._budgetDetailId);
      if (rs.ok) {
        console.log(rs);
        this.budgetAmount = rs.detail ? rs.detail.amount : 0;
        this.budgetName = rs.detail ? `${rs.detail.bgtype_name} (${rs.detail.bgtypesub_name})` : '-';
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }

    // getDetailContract(id: string) {
  //   this.contractService.detail(id)
  //     .then((results: any) => {
  //       this.contractDetail = results.detail;
  //       this.contract_amount = this.contractDetail.amount;
  //       this.amount_spent = this.contractDetail.amount_spent;
  //     })
  //     .catch(error => {
  //       this.alertService.serverError(error);
  //     });
  // }
}
