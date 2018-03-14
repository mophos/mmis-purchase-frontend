import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { IBidProcess } from 'app/interfaces';
import { StandardService } from 'app/services/standard.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'po-select-bid-process',
  templateUrl: './select-bid-process.component.html',
  styles: []
})
export class SelectBidProcessComponent implements OnInit {

  @Input() public selectedId: any;
  @Input() public disabled: any;
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  items: IBidProcess[] = [];

  constructor(private stdService: StandardService, private alertService: AlertService) { }

  async ngOnInit() {
    await this.getItems();
  }

  async getItems() {
    try {
      this.loading = true;
      let rs: any = await this.stdService.getBidProcess();
      this.loading = false;
      if (rs.ok) {
        this.items = rs.rows;
        if (this.items.length) {
          if (this.selectedId) {
            let idx = _.findIndex(this.items, { id: this.selectedId });
            if (idx > -1) {
              this.onChange.emit(this.items[idx]);
            } else {
              idx = _.findIndex(this.items, { is_default: 'Y' });
              if (idx > -1) {
                this.selectedId = this.items[idx].id;
              } else {
                this.selectedId = this.items[0].id;
              }
            }
          } else {
            const idx = _.findIndex(this.items, { is_default: 'Y' });
            if (idx > -1) {
              this.selectedId = this.items[idx].id;
              this.onChange.emit(this.items[idx]);
            } else {
              this.selectedId = this.items[0].id;
              this.onChange.emit(this.items[0]);
            }
            
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
    const idx = _.findIndex(this.items, { id: +event.target.value });
    if (idx > -1) {
      this.onChange.emit(this.items[idx]);
    }
  }

}
