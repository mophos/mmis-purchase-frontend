import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { StandardService } from 'app/services/standard.service';
import { AlertService } from 'app/alert.service';
import { CommitteeService } from 'app/purchase/share/committee.service';

@Component({
  selector: 'po-select-committee',
  templateUrl: './select-committee.component.html',
  styles: []
})
export class SelectCommitteeComponent implements OnInit {

  @Input() public selectedId: any;
  @Input() public disabled: any;

  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  items: any[] = [];

  constructor(private committeeService: CommitteeService, private alertService: AlertService) { }

  async ngOnInit() {
    await this.getItems();
  }

  async getItems() {

    try {
      this.loading = true;
      let rs: any = await this.committeeService.all();
      this.loading = false;
      if (rs.ok) {
        this.items = rs.rows;
        if (this.items.length) {
          if (this.selectedId) {
            const idx = _.findIndex(this.items, { committee_id: this.selectedId });
            if (idx > -1) {
              this.onChange.emit(this.items[idx]);
            } else {
              this.onChange.emit(this.items[0]);
            }
          } else {
            this.selectedId = this.items[0].committee_id;
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
    if (event.target.value === '0') {
      const item = {
        committee_id: 0
      }
      this.onChange.emit(item)
    } else {
      const idx = _.findIndex(this.items, { committee_id: +event.target.value });
      if (idx > -1) {
        this.onChange.emit(this.items[idx]);
      }
    }
  }

}
