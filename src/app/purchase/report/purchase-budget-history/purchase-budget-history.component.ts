import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import * as _ from 'lodash';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { HtmlPreviewComponent } from 'app/helper/html-preview/html-preview.component';
import { SelectSubBudgetComponent } from '../../../select-boxes/select-sub-budget/select-sub-budget.component';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

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
  token: any;

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  }

  constructor(
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
  }

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

  onChangeBudgetType(event: any) {
    const date = new Date();
    this.budgetYear = date.getFullYear()
    this.budgetTypeId = event.bgtype_id;
  }

  onChangeSubBudget(event: any) {
    this.budgetDetailId = event ? event.view_bgdetail_id : null;
  }

  printreport() {
    let startDate = `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}`;
    let endDate = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`;
    const url = `${this.apiUrl}/report/budget-history?startDate=${startDate}&endDate=${endDate}&budgetDetailId=${this.budgetDetailId}&token=${this.token}`;
    this.htmlPreview.showReport(url);
  }

  exportExcel() {
    let startDate = `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}`;
    let endDate = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`;
    const url = `${this.apiUrl}/report/budget-history/excel?startDate=${startDate}&endDate=${endDate}&budgetDetailId=${this.budgetDetailId}&token=${this.token}`;
    window.open(url, '_blank');
  }

}
