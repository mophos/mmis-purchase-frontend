
import { Component, OnInit, EventEmitter, NgZone, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfficerService } from '../../purchase/share/officer.service';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'app-officer',
  templateUrl: './officer.component.html',
  styleUrls: ['./officer.component.css']
})
export class PurchasingofficerComponent implements OnInit {
  officerTypes: any[];
  officers: any[];
  peoples: any[];
  modalInput = false;
  officerId: any;
  peopleId: any;
  type: any;
  isActive = 1;
  isEdit = false;

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private officerService: OfficerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getOfficer();
    this.getPeoples();
    this.getOfficerTypes();
  }

  async getOfficer() {
    try {
      const rs: any = await this.officerService.getPurchasingOfficer();
      if (rs.ok) {
        this.officers = rs.rows;
      } else {
        this.alertService.error(rs.error)
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
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

  async getPeoples() {
    try {
      const rs: any = await this.officerService.getPeoples();
      if (rs.ok) {
        this.peoples = rs.rows;
      } else {
        this.alertService.error(rs.error)
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }

  onClickAdd() {
    this.isEdit = false;
    this.modalInput = true;
  }

  onClickEdit(row) {
    this.isEdit = true;
    this.officerId = row.p_id;
    this.peopleId = row.people_id;
    this.type = row.type_id;
    this.isActive = row.isactive;
    this.modalInput = true;
  }

  onClickDelete(row) {
    this.alertService.confirm('ยืนยันการลบข้อมูล?')
      .then(() => {
        this.officerService.deletePurchasingOfficer(row.p_id)
          .then((resolve: any) => {
            this.getOfficer();
          })
          .catch(error => {
            this.alertService.error(JSON.stringify(error))
          });
      });
  }

  async onClickSave() {
    try {
      const formInput = {
        people_id: this.peopleId,
        type_id: this.type,
        isactive: this.isActive
      };
      if (!this.isEdit) {
        await this.officerService.savePurchasingOfficer(formInput)
      } else {
        await this.officerService.updatePurchasingOfficer(this.officerId, formInput)
      }
      this.getOfficer();
      this.modalInput = false;
      this.alertService.success('บันทึกเรียบร้อย');
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }
}

