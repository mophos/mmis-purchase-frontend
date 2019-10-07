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
  @Input() public productId: any;
  @Input() public selectedId: any;
  @Input() public disabled: any;
  @Input() public setUnitGenericId: any;
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
      this.getUnits();
    }
    if (this.setUnitGenericId) {
      this.setSelectUnit()
    }
  }

  setSelectUnit() {
    this.selectedId = +this.setUnitGenericId;
  }

  setSelect(event: any) {
    const idx = _.findIndex(this.units, { unit_generic_id: +event.target.value });
    if (idx > -1) {
      this.onChange.emit(this.units[idx]);
    }
  }

  setGenericId(genericId: any, productId = null) {
    if (genericId) {
      this.genericId = genericId;
      this.productId = productId;
      this.selectedId = null;
      this.getUnits();
    }
  }

  async getUnits() {
    this.loading = true;
    try {
      let rs: any = [];
      if (this.productId) {
        rs = await this.stdService.getGenericUnitsProduct(this.genericId, this.productId)
      } else {
        rs = await this.stdService.getGenericUnits(this.genericId);
      }
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
            const idx = _.findIndex(this.units, { is_purchase: 'Y' });
            if (idx > -1) {
              this.onChange.emit(this.units[idx]);
              this.selectedId = this.units[idx].unit_generic_id;
            } else {
              this.selectedId = this.units[0].unit_generic_id;
              this.onChange.emit(this.units[0]);
            }
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
