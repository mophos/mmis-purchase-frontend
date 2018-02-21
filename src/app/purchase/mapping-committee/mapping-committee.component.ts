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
    await this.commiteeService.removecommitteebid(bid_id);
    await this.commiteeService.updatecommitteebid(id, bid_id);
    this.getCommittee();
  }
  getCommittee() {
    this.loading = true;
    this.commiteeService.allbid()
      .then((results: any) => {
        this.committees = results.rows;
        console.log(this.committees);
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
        console.log(this.listbidtypes);
      })
      .catch(error => {
        console.log(error);
        this.alertService.serverError();
      });
  }
}
