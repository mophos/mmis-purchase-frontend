import { BudgetTransectionService } from './../../share/budget-transection.service';
import { AlertService } from './../../../alert.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-budgetransection',
  templateUrl: './budgetransection.component.html',
  styleUrls: ['./budgetransection.component.css']
})
export class BudgetransectionComponent implements OnInit {
  @Input('budgetYear') budgetYear;
  @Input('budgetDetailId') budgetDetailId;
  loading: boolean;
  bgTransection: any = [];

  constructor(
    private alertService: AlertService,
    private budgetTransectionService: BudgetTransectionService
  ) { }

  ngOnInit() {
  }

  getbgTransection(detail_id: any) {
    this.loading = true;
    this.budgetTransectionService.getBudgetTransection(detail_id)
      .then((results: any) => {
        this.bgTransection = results.rows;
        this.loading = false;
      })
      .catch(error => {
        this.alertService.serverError(error);
        this.loading = false;
      });
  }
}
