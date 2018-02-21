import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  
  constructor() {  }

  ngOnInit() { }

  getBudgetRemain() {
    console.log(+this._budgetDetailId);
    console.log(+this._budgetYear);
  }
}
