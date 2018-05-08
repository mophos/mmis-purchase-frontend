import { log } from 'util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BudgetTransectionService } from 'app/purchase/share/budget-transection.service';
import { AlertService } from 'app/alert.service';
import { ContractService } from '../../share/contract.service';

@Component({
  selector: 'po-budget-remain',
  templateUrl: './budget-remain.component.html'
})
export class BudgetRemainComponent implements OnInit {
  _budgetDetailId: any;
  budgetTypeDetail: any = {};
  _budgetYear: any;

  totalPurchaseAmount = 0;
  budgetAmount = 0;
  budgetRemain = 0;
  cost = 0;
  budgetName: string;
  contractNo: string;
  purchaseAmount: number;

  contractAmount = 0;
  contractRemain = 0;
  contractPurchaseAmount = 0;
  contractRemainAfterPurchase = 0;

  _contractId: any = null;

  @Input('purchaseAmount')
  set setPurchaseAmount(value: any) {
    this.changePurchaseAmount(value);
  }

  @Input('budgetYear')
  set setBudgetYear(value: any) {
    this._budgetYear = value;
  }

  @Input('contractCost')
  set setCost(value: any) {
    this.changeContractAmount(value);
  }

  @Input('budgetDetailId')
  set setBudgetDetailId(value: any) {
    this._budgetDetailId = value;
    this.getBudget();
  }

  @Input('contractId')
  set setContractId(value: any) {
    console.log(value);
    this._contractId = value;
    this.getContractDetail(this._contractId);
  }  
  
  @Input('purchaseOrderId') purchaseOrderId: any;

  @Output('onCalculated') onCalculated: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private budgetTransactionService: BudgetTransectionService,
    private contractServices: ContractService,
    private alertService: AlertService) { }

  ngOnInit() { }

  changeContractAmount(amount: number) {
    this.cost += +amount;
    this.getContractDetail();
  }

  changePurchaseAmount(amount: number) {
    this.totalPurchaseAmount = +amount;
    // this.contractRemain = this.contractAmount - (this.contractPurchaseAmount - this.totalPurchaseAmount);
    // this.contractRemainAfterPurchase = this.contractRemain - this.totalPurchaseAmount;

    this.returnData();
  }

  async getBalance() {
    try {
      const rs: any = await this.budgetTransactionService.getBudgetTransectionBalance(this._budgetDetailId, this.purchaseOrderId);
      if (rs.ok) {
        const totalPurchase = rs.totalPurchase ? +rs.totalPurchase : 0;
        this.budgetRemain = this.budgetAmount - totalPurchase;
        this.purchaseAmount = totalPurchase;
      }
    } catch (error) {
      console.log(error);
    }
  }

  clearContractDetail() {
    this.contractAmount = 0;
    this.contractNo = null;
    this.contractPurchaseAmount = 0;
    this.contractRemain = 0;
    this.contractRemainAfterPurchase = 0;
  }

  async getContractDetail(contractId: any, purchaseId: any = '') {
    if (contractId) {
      try {
        let rs: any = await this.contractServices.remainDetail(contractId, purchaseId);
        if (rs.ok) {
          this.contractAmount = rs.detail ? rs.detail.amount : 0;
          this.contractNo = rs.detail ? rs.detail.contract_no : null;
          this.contractPurchaseAmount = rs.detail ? rs.detail.total_purchase : 0;

          this.contractRemain = this.contractAmount - this.contractPurchaseAmount;
          this.contractRemainAfterPurchase = this.contractRemain - this.totalPurchaseAmount;
          this.returnData();
        } else {
          this.alertService.error('เกิดข้อผิดพลาดในการดึงข้อมูลสัญญา');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async getBudget() {
    this.clearData();
    try {
      const rs: any = await this.budgetTransactionService.getBudgetTransection(this._budgetDetailId);
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
    const data = {
      budgetAmount: this.budgetAmount,
      budgetRemain: this.budgetRemain,
      totalPurchase: this.totalPurchaseAmount,
      remainAfterPurchase: this.budgetRemain - this.totalPurchaseAmount,
      budgetDetailId: this._budgetDetailId,
      contractRemainAfterPurchase: this.contractRemainAfterPurchase
    }

    this.onCalculated.emit(data);
  }

}
