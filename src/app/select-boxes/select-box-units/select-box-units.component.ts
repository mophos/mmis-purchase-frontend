import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlertService } from 'app/alert.service';
import { StandardService } from 'app/services/standard.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-select-box-units',
  templateUrl: './select-box-units.component.html',
  styles: []
})
export class SelectBoxUnitsComponent implements OnInit {

  @Input() public genericId: any;
  @Input() public selectedId: any;
  @Input() public disabled: any;
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  units = [];
  unitGenericId = null;
  loading = false;

  constructor(
    private alertService: AlertService,
    private stdService: StandardService
  ) { }

  ngOnInit() {
    if (this.genericId) {
      this.getUnits(this.genericId);
    }
  }

  setSelect(event: any) {
    const idx = _.findIndex(this.units, { unit_generic_id: +event.target.value });
    if (idx > -1) {
      this.onChange.emit(this.units[idx]);
    }
  }

  setGenericId(genericId: any) {
    if (genericId) {
      this.genericId = genericId;
      this.selectedId = null;
      this.getUnits(this.genericId);
    }
  }

  async getUnits(genericId: any) {
    this.loading = true;
    try {
      let rs: any = await this.stdService.getGenericUnits(genericId);
      this.loading = false;
      if (rs.ok) {
        this.units = rs.rows;
        if (this.units.length) {
          if (this.selectedId) {
            const idx = _.findIndex(this.units, { unit_generic_id: +this.selectedId });
            if (idx > -1) {
              this.onChange.emit(this.units[idx]);
            } else {
              this.onChange.emit(this.units[0]);
            }
          } else {
            this.selectedId = this.units[0].unit_generic_id;
            this.onChange.emit(this.units[0]);
          }
        }
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  clearUnits() {
    this.genericId = null;
    this.selectedId = null;
    this.units = [];
    // this.modalUom.clearUnits();
  }

}
