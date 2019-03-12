import { Component, OnInit } from '@angular/core';
import { CommitteeService } from '../share/committee.service';
import { AlertService } from '../../alert.service';
@Component({
  selector: 'app-mapping-committee',
  templateUrl: './mapping-committee.component.html',
  styleUrls: ['./mapping-committee.component.css']
})
export class MappingCommitteeComponent implements OnInit {

  committees = [];
  loading = false;
  listbidtypes = [];
  listbidtype: any;
  constructor(private commiteeService: CommitteeService,
    private alertService: AlertService) { }

  async ngOnInit() {
    await this.getListBidType();
    await this.getCommittee();
  }

  async select(e, id) {
    const bid_id = e.target.value;
    this.commiteeService.removecommitteebid(bid_id)
      .then((results: any) => {
        this.commiteeService.updatecommitteebid(id, bid_id)
          .then((res: any) => {
            this.alertService.success();
            this.getCommittee();
          })
          .catch((err) => {
            this.alertService.error(err);
          })
      })
      .catch((error) => {
        this.alertService.error(error);
      })
  }

  getCommittee() {
    this.loading = true;
    this.commiteeService.allbid()
      .then((results: any) => {
        this.committees = results.rows;
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.alertService.serverError();
      });
  }

  getListBidType() {
    this.commiteeService.listbidtype()
      .then((results: any) => {
        this.listbidtypes = results.rows;
      })
      .catch(error => {
        console.log(error);
        this.alertService.serverError();
      });
  }
}
