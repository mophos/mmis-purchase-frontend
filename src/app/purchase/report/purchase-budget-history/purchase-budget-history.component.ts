import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import * as _ from 'lodash';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { HtmlPreviewComponent } from 'app/helper/html-preview/html-preview.component';
import { SelectSubBudgetComponent } from '../../../select-boxes/select-sub-budget/select-sub-budget.component';

@Component({
  selector: 'app-purchase-budget-history',
  templateUrl: './purchase-budget-history.component.html',
  styles: []
})
export class PurchaseBudgetHistoryComponent implements OnInit {

  @ViewChild('htmlPreview') public htmlPreview: HtmlPreviewComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent;
  @ViewChild('subBudgetList') subBudgetList: SelectSubBudgetComponent;
  budgetDetailId: any;
  startDate: any;
  endDate: any;
  budgetYear: any;
  budgetTypeId: any;

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  }

  constructor() { }

  ngOnInit() {
    const date = new Date();

    this.startDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 1
      }
    };
    this.endDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
  }

  onChangeBudgetType(budgetType: any) {
    const date = new Date();
    this.budgetYear = date.getFullYear()
    this.budgetTypeId = budgetType.bgtype_id;
  }

  onChangeSubBudget(subBudget: any) {

  }

}
