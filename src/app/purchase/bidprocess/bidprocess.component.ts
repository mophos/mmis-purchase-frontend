import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../alert.service';
import { BidProcessService } from '../share/bid-process.service';

@Component({
  selector: 'po-bidprocess',
  templateUrl: './bidprocess.component.html',
  styleUrls: []
})
export class BidprocessComponent implements OnInit {

  bidprocess: any = [];

  isOpen: any = false;
  isEdit: any = false;

  bidId: any;
  bidname: any;
  f_amount: number = 0;

  constructor(
    private alertService: AlertService,
    private bidService: BidProcessService
  ) { }

  ngOnInit() {
    this.getBidprocess();

    this.bidname = null;
    this.isEdit = false;
    this.f_amount = 0;
  }

  async getBidprocess() {
    this.bidService.all()
      .then((results: any) => {
        if (results.ok) {
          this.bidprocess = results.rows;
        }
      }).catch((error) => {
        this.alertService.error(error);
      });
  }

  async onClickAdd() {
    this.isOpen = true;
    this.isEdit = false;

    this.bidname = null;
    this.f_amount = 0;
  }

  async onClickEdit(row: any) {
    this.isOpen = true;
    this.isEdit = true;

    this.bidname = row.name;
    this.f_amount = row.f_amount;
    this.bidId = row.id;
  }

  async onClickDelete(row: any) {
    this.alertService.confirm('ยืนยันการลบข้อมูล?')
      .then(() => {
        this.bidService.isActive(row.id)
          .then((resolve: any) => {
            this.getBidprocess();
          })
          .catch(error => {
            this.alertService.error(JSON.stringify(error))
          });
      });
  }

  async onClickSave() {
    try {
      const formInput = {
        name: this.bidname,
        f_amount: this.f_amount
      };
      if (!this.isEdit) {
        await this.bidService.save(formInput)
      } else {
        await this.bidService.update(this.bidId, formInput)
      }
      this.getBidprocess();
      this.isOpen = false;
      this.alertService.success('บันทึกเรียบร้อย');
    } catch (error) {
      this.alertService.error(JSON.stringify(error))
    }
  }
}