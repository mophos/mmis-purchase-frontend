import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { IBudgetType } from 'app/interfaces';
import { StandardService } from 'app/services/standard.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'po-select-budget',
  templateUrl: './select-budget.component.html',
  styles: []
})
export class SelectBudgetComponent implements OnInit {

  @Input() public selectedId: any;
  @Input() public disabled: any;
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  items: IBudgetType[] = [];

  constructor(private stdService: StandardService, private alertService: AlertService) { }

  async ngOnInit() {
    await this.getItems();
  }

  async getItems() {
    try {
      this.loading = true;
      const rs: any = await this.stdService.getBudgetType();
      this.loading = false;
      if (rs.ok) {
        this.items = rs.rows;
        if (this.items.length) {
          if (this.selectedId) {
            const idx = _.findIndex(this.items, { bgtype_id: this.selectedId });
            if (idx > -1) {
              this.onChange.emit(this.items[idx]);
            } else {
              this.onChange.emit(this.items[0]);
            }
          } else {
            this.selectedId = this.items[0].bgtype_id;
            this.onChange.emit(this.items[0]);
          }
        }

      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error()
    }
  }

  setSelected(event: any) {
    const idx = _.findIndex(this.items, { bgtype_id: +event.target.value });
    if (idx > -1) {
      this.onChange.emit(this.items[idx]);
    }
  }

}
