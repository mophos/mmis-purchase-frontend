import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlertService } from 'app/alert.service';
import { UnitsService } from 'app/services/units.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-select-box-units',
  templateUrl: './select-box-units.component.html',
  styles: []
})
export class SelectBoxUnitsComponent implements OnInit {

  @Input() public genericId: any;
  @Input() public selectedUnitGenericId: any;
  @Input() public disabled: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  units = [];
  unitGenericId = null;
  loading = false;

  constructor(
    private alertService: AlertService,
    private unitService: UnitsService
  ) { }

  ngOnInit() {
    if (this.genericId) {
      this.getUnits(this.genericId);
    }
  }

  setSelect(event: any) {
    const idx = _.findIndex(this.units, { unit_generic_id: +event.target.value });
      if (idx > -1) {
        this.onSelect.emit(this.units[idx]);
      }
  }

  setGenericId(genericId: any) {
    if (genericId) {
      this.genericId = genericId;
      this.getUnits(this.genericId);
    }
  }

  async getUnits(genericId: any) {
    console.log(this.selectedUnitGenericId);
    this.loading = true;
    try {
      let rs: any = await this.unitService.getGenericUnits(genericId);
      this.loading = false;
      if (rs.ok) {
        this.units = rs.rows;
        if (this.units.length) {
          if (this.selectedUnitGenericId) {
            this.unitGenericId = this.selectedUnitGenericId;
            const idx = _.findIndex(this.units, { unit_generic_id: this.selectedUnitGenericId });
            if (idx > -1) {
              this.onSelect.emit(this.units[idx]);
            } else {
              this.onSelect.emit(this.units[0]);
            }
          } else {
            this.selectedUnitGenericId = this.units[0].unit_generic_id;
            this.unitGenericId = this.selectedUnitGenericId;
            this.onSelect.emit(this.units[0]);
          }
        }
      } else {
        this.loading = false;
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message); 
    }
  }

  clearUnits() {
    this.genericId = null;
    this.units = [];
    // this.modalUom.clearUnits();
  }

}
