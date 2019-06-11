
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
  type: any;
  isActive = 'Y';
  isEdit = false;

  peopleId: any;
  fullname: any;
  typeName: any;
  typeShow: any;
  typeCode: any;
  modalEdit = false;
  modalChange = false;
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
    this.typeShow = '';
    this.peopleId = '';
    this.modalInput = true;
  }

  onClickDelete(row) {
    this.alertService.confirm('ยืนยันการลบข้อมูล?')
      .then(() => {
        this.officerService.deletePurchasingOfficer(row.officer_id)
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
        type_code: this.typeCode,
        type_name: this.typeShow,
        is_actived: this.isActive
      };
      await this.officerService.savePurchasingOfficer(formInput)

      this.getOfficer();
      this.modalInput = false;
      this.alertService.success('บันทึกเรียบร้อย');
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }

  editTypeName(row) {
    this.isEdit = true;
    this.fullname = row.fullname
    this.officerId = row.officer_id;
    this.typeShow = row.type_show;
    this.typeName = row.type_name;
    this.isActive = row.is_actived;
    this.modalEdit = true;
  }

  async saveEdit() {
    try {
      const data = {
        type_name: this.typeShow,
        is_actived: this.isActive
      };
      await this.officerService.editTypeShow(this.officerId, data)
      await this.getOfficer();
      this.modalEdit = false;
    } catch (error) {
      this.alertService.error(error);
    }
  }
  changeTypeName(row) {
    // this.isEdit = true;
    this.peopleId = row.people_id;
    this.typeCode = row.type_code;
    this.fullname = row.fullname
    this.officerId = row.officer_id;
    this.typeShow = row.type_show;
    this.typeName = row.type_name;
    this.isActive = row.is_actived;
    this.modalChange = true;
  }

  async saveChange() {
    try {
      const data = {
        people_id: this.peopleId,
        type_code: this.typeCode,
        type_name: this.typeShow,
        is_actived: this.isActive
      };
      await this.officerService.changeTypeShow(data)
      await this.getOfficer();
      this.modalChange = false;
    } catch (error) {
      this.alertService.error(error);
    }
  }
}

