import { Component, OnInit, EventEmitter, NgZone, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfficerService } from '../../purchase/share/officer.service';
import { AlertService } from '../../alert.service';
@Component({
  selector: 'po-officer-type',
  templateUrl: './officer-type.component.html',
  styleUrls: ['./officer-type.component.css']
})
export class OfficerTypeComponent implements OnInit {

  officerTypes: any[];
  modalInput = false;
  typeId: any;
  typeName: any;
  comment:any;
  isActive = 1;
  isEdit = false;
  constructor(
    @Inject('API_URL') private apiUrl: string,
    private officerService: OfficerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {

    this.getOfficerTypes();
  }

  async getOfficerTypes() {
    try {
      const rs: any = await this.officerService.getPurchasingOfficerType();
      if (rs.ok) {
        this.officerTypes = rs.rows;
      } else {
        this.alertService.error(rs.error)
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }

  onClickEdit(row) {
    this.isEdit = true;
    this.typeId = row.type_id;
    this.typeName = row.type_name
    this.comment = row.comment
    this.isActive = row.isactive;
    this.modalInput = true;
  }


  async onClickSave() {
    try {
      const formInput = {
        type_name: this.typeName
      };
      if (!this.isEdit) {
        // await this.officerService.savePurchasingOfficer(formInput)
      } else {
        await this.officerService.updatePurchasingOfficerType(this.typeId, formInput)
      }
      this.getOfficerTypes();
      this.modalInput = false;
      this.alertService.success('บันทึกเรียบร้อย');
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }
}

