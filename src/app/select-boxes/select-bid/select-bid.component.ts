import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { IBidType } from 'app/interfaces';
import { StandardService } from 'app/services/standard.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'po-select-bid',
  templateUrl: './select-bid.component.html',
  styles: []
})
export class SelectBidComponent implements OnInit {

  @Input() public selectedId: any;
  @Input() public disabled: any;
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  items: IBidType[] = [];

  constructor(private stdService: StandardService, private alertService: AlertService) { }

  async ngOnInit() {
    await this.getItems();
  }

  async getItems() {
    try {
      this.loading = true;
      let rs: any = await this.stdService.getBidType();
      this.loading = false;
      if (rs.ok) {
        this.items = rs.rows;
        if (this.items.length) {
          if (this.selectedId) {
            let idx = _.findIndex(this.items, { id: this.selectedId });
            if (idx > -1) {
              this.onChange.emit(this.items[idx]);
            } else {
              idx = _.findIndex(this.items, { isdefault: 'Y' });
              if (idx > -1) {
                this.selectedId = this.items[idx].bid_id;
              } else {
                this.selectedId = this.items[0].bid_id;
              }
            }
          } else {
            const idx = _.findIndex(this.items, { isdefault: 'Y' });
            if (idx > -1) {
              this.selectedId = this.items[idx].bid_id;
            } else {
              this.selectedId = this.items[0].bid_id;
            }
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
    const idx = _.findIndex(this.items, { bid_id: +event.target.value });
    if (idx > -1) {
      this.onChange.emit(this.items[idx]);
    }
  }

}
