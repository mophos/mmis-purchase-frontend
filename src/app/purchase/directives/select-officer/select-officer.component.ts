import { AlertService } from '../../../alert.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OfficerService } from 'app/purchase/share/officer.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-select-officer',
  templateUrl: './select-officer.component.html',
  styleUrls: ['./select-officer.component.css']
})
export class SelectOfficerComponent implements OnInit {

  loading: boolean;
  officers: Array<any> = [];

  @Input() officer_id: string;
  @Input() isReorder: number;
  @Input() isUpdate: boolean = false;
  @Input() type_id: number;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>(false);
  
  constructor(
    private ref: ChangeDetectorRef,
    private officerService: OfficerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getOfficersByType(this.type_id);
  }

  onChangeOfficer(e:any, value:string){
    const row = _.find(this.officers, { 'people_id': +value });
    this.onChange.emit(row);
  }

  async getOfficers() {
    try {
      const res = await  this.officerService.findAll();
      this.officers = res.ok ? res.rows : [];
    } catch (error) {
      this.alertService.error(error.message);
    }
  } 

  async getOfficersByType(id: number) {
    try {
      const res = await this.officerService.findAllByTypeId(id);
      this.officers = res.ok ? res.rows : [];
      this.officers.forEach(v => {
        if(v.type_id == 3) {
          this.officers.push({
            fullname: '',
            isactive: v.p_id,
            people_id: v.people_id,
            position_name: v.position_name,
            type_id: v.type_id,
            type_name: 'ไม่ระบุ',
            check: 'true'
          })
        }
      });
      console.log(this.officers)
      if(this.officers.length>0 && this.isUpdate===false || this.isReorder === 1){
        this.officer_id = this.officers[0].people_id;
        const row = _.find(this.officers, { 'people_id': +this.officer_id });
        this.onChange.emit(row);
      } else {
        if (this.officers.length) {
          if (this.officer_id) {
            const row = _.find(this.officers, { 'people_id': +this.officer_id });
            this.onChange.emit(row);
          } else {
            this.officer_id = this.officers[0].people_id;
            const row = _.find(this.officers, { 'people_id': +this.officer_id });
            this.onChange.emit(row);
          }
        }
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  } 

}
