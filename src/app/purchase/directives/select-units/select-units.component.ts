import { UnitService } from './../../share/unit.service';
import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter, ViewContainerRef, AfterViewInit } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'select-units',
  templateUrl: './select-units.component.html',
})

export class SelectUnitsComponent implements AfterViewInit, OnInit {
  loading: boolean;
  units: Array<any> = [];
  private _isNewRecord: string;

  @Input() set isNewRecord(value: string) {
    this._isNewRecord = value;
  }

  get isNewRecord(): string {
    return this._isNewRecord;
  }

  @Input() unitId: string;
  @Input() productId: string;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>(false);

  constructor(
    private unitService: UnitService,
    private viewContainerRef: ViewContainerRef,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.productId) {
      this.getUnitsByGeneric(this.productId, this.unitId);
    }
  }

  setSelected(unitId: any) {
    this.unitId = unitId;
  }

  ngAfterViewInit() {
  }

  onChangeUnit(unit_generic_id: string) {
    const unitObject: any = _.find(this.units, { 'unit_generic_id': +unit_generic_id });
    this.onChange.emit(unitObject);
  }

  getUnitsByProduct(productId: any, unit_product_id: string) {
    this.loading = true;
    this.unitService.byProduct(productId)
      .then((results: any) => {
        this.ref.detectChanges();
        this.units = results.rows;
        if (unit_product_id) {
          const unitObject: any = _.find(this.units, { 'unit_product_id': +unit_product_id });
          if (unitObject) {
            this.unitId = unitObject.unit_product_id;
            this.onChangeUnit(this.unitId);
          } else {
            console.log('empty purchase unit default');
          }
        } else {
          this.onChangeUnit(this.units[0].unit_product_id);
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        console.log('service units error: ', error);
      });
  }

  getUnitsByGeneric(genericId: any, purchase_unit_generic_id: string) {
    this.loading = true;
    this.unitService.byGeneric(genericId)
      .then((results: any) => {
        this.ref.detectChanges();
        this.units = results.rows;
        if (purchase_unit_generic_id) {
          const unitObject: any = _.find(this.units, { 'unit_generic_id': +purchase_unit_generic_id });
          if (unitObject) {
            this.unitId = unitObject.unit_generic_id;
            if (this._isNewRecord) {
              this.onChangeUnit(this.unitId);
            }
          } else {
            console.log('empty purchase unit default');
          }
        } else {
          if (this.units.length > 0) {
            this.unitId = this.units[0].unit_generic_id;
            if (this._isNewRecord) {
              this.onChangeUnit(this.unitId);
            }
          } else {
            console.log('unit is Empty');
          }
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        console.log('service units error: ', error);
      });
  }

}
