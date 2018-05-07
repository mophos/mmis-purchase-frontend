import { CommitteeFormComponent } from './committee-form/committee-form.component';
import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommitteeService } from '../share/committee.service';
import { PeopleService } from '../share/people.service';
import { AlertService } from '../../alert.service';
import { Wizard } from '@clr/angular';

@Component({
  selector: 'app-committee',
  templateUrl: './committee.component.html',
  styleUrls: ['./committee.component.css']
})
export class CommitteeComponent implements OnInit {

  committees: Array<any> = [];
  peoples: Array<any> = [];
  committeeSelected: Array<any> = [];
  committeeIsUpdate: boolean = false;
  loading: boolean = false;

  @ViewChild('cmt') form: CommitteeFormComponent;

  constructor(
    private commiteeService: CommitteeService,
    private peopleService: PeopleService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getCommittee();
    this.getPeoples();

  }

  newCommittee() {
    this.form.newCommittee();
  }

  deleteComittee(row: any) {
    console.log(row);
    this.alertService.confirm('คุณต้องการที่จะลบคณะกรรมการใช่หรือไม่?').then(() => {
      this.commiteeService.updateIsdelete(row.committee_id)
        .then((results: any) => {
          this.ref.detectChanges();
          this.loading = false;
          this.alertService.success('ลบรายการเสร็จเรียบร้อย...');
          this.getCommittee();
        })
        .catch(error => {
          this.loading = false;
          this.alertService.serverError();
        });
    })
      .catch(() => {

      });
  }

  affterSaveCommittee(e) {
    this.getCommittee();
  }

  getCommittee() {
    this.loading = true;
    this.commiteeService.all()
      .then((results: any) => {
        this.committees = results.rows;
        this.ref.detectChanges();
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        this.alertService.serverError();
      });
  }

  onCommitteeCancle(e) {
    //this.commiteeService.remove(e.);
  }

  getPeoples() {
    this.peopleService.all()
      .then((results: any) => {
        this.peoples = results.rows;
        this.ref.detectChanges();
      })
      .catch(error => {
        this.alertService.serverError();
      });
  }
}
