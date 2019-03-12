import { Component, OnInit, Input, Output, ViewChild, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PeopleService } from '../../share/people.service';
import { CommitteeService } from '../../share/committee.service';
import { CommitteePeopleService } from '../../share/committee-people.service';
import { AlertService } from '../../../alert.service';
import { IMyOptions } from 'mydatepicker-th';
import * as moment from 'moment';

import { People } from '../../share/models/people.interface';

import { Wizard, WizardPage } from '@clr/angular';
import * as _ from 'lodash';

@Component({
  selector: 'app-committee-form',
  templateUrl: './committee-form.component.html',
  styleUrls: ['./committee-form.component.css']
})
export class CommitteeFormComponent implements OnInit {

  @ViewChild('wizardCommittee') wizardCommittee: Wizard;
  @ViewChild("pageOne") pageOne: WizardPage;
  @ViewChild("pageTwo") pageTwo: WizardPage;
  @ViewChild("pageThree") pageThree: WizardPage;

  @ViewChild("formCommittee") formCommittee: FormControl;
  @Output("affterSave") affterSave: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output("wizardOnCancel") wizardOnCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('opened') wizardCommitteeOpen: boolean = false;
  @Input('isUpdate') isUpdate: boolean = false;

  loadingFlag: boolean = false;
  committee: FormGroup;
  formGroupCommitteePosition: FormGroup;

  peoplesSourceTemp: Array<any> = [];
  peoplesSource: Array<any> = [];
  peoplesSourceSelected: Array<any> = [];
  peoplesTarget: Array<any> = [];
  peoplesTargetSelected: Array<any> = [];
  committees: Array<any> = [];
  committeeNewPosition: any;
  _saveBtn: boolean = false
  leader: string;
  query: string;

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  };

  formErrors = {
    committee_name: '',
    committee_type: '',
    datetime_start: '',
    datetime_end: '',
    committee_status: ''
  };

  validationMessage = {
    committee_name: {
      required: 'กรุณากรอกข้อมูลใม่ควรเป็นช่องว่าง'
    },
    committee_type: {
      required: 'กรุณากรอกข้อมูลใม่ควรเป็นช่องว่าง'
    },
    committee_status: {
      required: 'กรุณากรอกข้อมูลใม่ควรเป็นช่องว่าง'
    },
    datetime_start: {
      required: 'กรุณากรอกข้อมูลใม่ควรเป็นช่องว่าง'
    },
    datetime_end: {
      required: 'กรุณากรอกข้อมูลใม่ควรเป็นช่องว่าง'
    }
  };

  constructor(
    private ref: ChangeDetectorRef,
    private peopleService: PeopleService,
    private committeeService: CommitteeService,
    private committeePeopleService: CommitteePeopleService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getPeoples();
  }

  buildForm() {
    this.committee = new FormGroup({
      committee_id: new FormControl('', Validators.required),
      committee_name: new FormControl('', Validators.required),
      committee_type: new FormControl('1', Validators.required),
      committee_status: new FormControl('T', Validators.required),
      datetime_start: new FormControl('', Validators.required),
      datetime_end: new FormControl('', Validators.required),
    });

    this.formGroupCommitteePosition = new FormGroup({
      positoinsName: new FormControl('', Validators.required)
    });
  }

  public jumpTo(page: WizardPage) {
    if (page && page.completed) {
      this.wizardCommittee.navService.setCurrentPage(page);
    } else {
      this.wizardCommittee.navService.setLastEnabledPageCurrent();
    }
    this.wizardCommittee.open();
  }

  doCancel() {
    this.wizardOnCancel.emit(true);
  }

  newCommittee() {
    this._saveBtn = false;
    this.wizardCommitteeOpen = true;
    this.isUpdate = false;
    this.peoplesSource = this.peoplesSourceTemp;
    this.wizardCommittee.reset();
    this.committee.reset();
    const d = new Date();
    const committee_id = d.getTime().toString().substr(1, 7);
    this.committee.patchValue({
      committee_id
    });
    this.loadingFlag = false;
    this.peoplesTarget.length = 0;
  }

  updateCommittee(committee: any) {
    this.isUpdate = true;
    this.loadingFlag = false;
    this.getCommittee(committee.committee_id);
    this.getCommitteePeople(committee.committee_id);
    this.pageOne.completed = true;
    this.pageTwo.completed = true;
    this.pageThree.completed = true;
    this.jumpTo(this.pageThree);
    this.wizardCommitteeOpen = true;
  }

  convertDate(date: object) {
    return moment(date).format('YYYY-MM-DD');
  }

  initSelectedPeople() {
    this.peoplesSource = _.differenceBy(this.peoplesSourceTemp, this.peoplesTarget, 'people_id');
  }

  selectedPeople() {
    this.peoplesSourceSelected.forEach(v => {
      this.peoplesTarget.push(v);
      let id = _.findIndex(this.peoplesSource, { people_id: v.people_id });
      if (id > -1) {
        this.peoplesSource.splice(id, 1);
      }
    });
    this.peoplesSourceSelected = [];
  }

  selectedPeopleAll() {
    this.peoplesSource.forEach(v => {
      this.peoplesTarget.push(v);
    });
    this.peoplesSource = [];
    this.peoplesSourceSelected = [];
  }

  revokePeople() {
    this.peoplesTargetSelected.forEach(v => {
      this.peoplesSource.push(v);
      let id = _.findIndex(this.peoplesTarget, { people_id: v.people_id });
      if (id > -1) {
        this.peoplesTarget.splice(id, 1);
      }
    });
    this.peoplesTargetSelected = [];
  }

  revokePeopleAll() {
    this.peoplesTarget.forEach(v => {
      this.peoplesSource.push(v);
    });
    this.peoplesTarget = [];
    this.peoplesTargetSelected = [];
    this.peoplesSource = _.sortBy(this.peoplesSource, 'people_id');
  }

  getPeoples() {
    this.peopleService.all()
      .then((results: any) => {
        this.peoplesSource = results.rows;
        this.peoplesSourceTemp = results.rows;
        this.ref.detectChanges();
      })
      .catch(error => {
        this.alertService.serverError();
      });
  }

  singleSelectedChange(e) {
    this._saveBtn = true
  }

  onCommitWizard3() {
    this.saveCommittee(this.formCommittee.value);
  }

  getCommittee(id: any) {
    let promise;
    promise = this.committeeService.one(id);
    promise
      .then((result: any) => {
        let ds = new Date(moment(result.detail.datetime_start).format('YYYY-MM-DD'));
        let de = new Date(moment(result.detail.datetime_end).format('YYYY-MM-DD'));
        this.committee.patchValue({
          committee_id: result.detail.committee_id,
          committee_name: result.detail.committee_name,
          committee_type: result.detail.committee_type,
          committee_status: result.detail.committee_status,
          datetime_start: {
            date: {
              year: ds.getFullYear(),
              month: ds.getMonth() + 1,
              day: ds.getDate()
            }
          },
          datetime_end: {
            date: {
              year: de.getFullYear(),
              month: de.getMonth() + 1,
              day: de.getDate()
            }
          }
        });
      })
      .catch((results) => {
        this.alertService.error();
      });
  }

  saveCommittee(data: any) {
    this.loadingFlag = true;
    let promise;

    data.datetime_start = this.convertDate(data.datetime_start.jsdate);
    data.datetime_end = this.convertDate(data.datetime_end.jsdate);

    if (this.isUpdate) {
      promise = this.committeeService.update(data.committee_id, data);
    } else {
      promise = this.committeeService.save(data);
    }

    this.saveCommitteePeople(data.committee_id, this.peoplesTarget);

    promise
      .then((results: any) => {
        this.affterSave.emit(results);
        this.alertService.success();
        this.loadingFlag = false;
        this._saveBtn = false;
      })
      .catch((results) => {
        this.alertService.error();
      });
  }

  saveCommitteePeople(committeeId, data) {
    let promise;
    let peoples: Array<any> = [];

    data.forEach((v: People, i) => {
      this.leader = i == 0 ? 'ประธาน' : 'กรรมการ';
      // let position = this.committeeNewPosition.people_id === v.people_id ? 'ประธาน' : 'กรรมการ';
      peoples.push({
        committee_id: committeeId,
        people_id: v.people_id,
        position_name: this.leader
      });
    });

    this.removeCommitteePeople(committeeId)
      .then((results: any) => {
        return this.committeePeopleService.save(peoples);
      })
      .then((results: any) => {
        this.alertService.success();
      })
      .catch((results) => {
        this.alertService.error();
      });
  }

  getCommitteePeople(committeeId: string) {
    let promise;
    promise = this.committeePeopleService.allByCommitteeId(committeeId);
    promise
      .then((results: any) => {
        this.peoplesTarget = results.rows;
        this.getChief(results.rows);
        //this.initSelectedPeople();
      })
      .catch((results) => {
        this.alertService.error();
      });
  }

  removeCommitteePeople(committeeId: string) {
    return this.committeePeopleService.removeByCommitteeId(committeeId);
  }

  getChief(peoples: Array<any>) {
    peoples.forEach((row, index) => {
      if (row.cp_position_name === 'ประธาน') {
        this.committeeNewPosition = row;
      }
    });
  }
  productDown(g) {
    if (this.peoplesTarget.length > 1) {
      const idx = _.findIndex(this.peoplesTarget, { fullname: g.fullname });
      if (idx !== this.peoplesTarget.length - 1) {
        const temp = this.peoplesTarget[idx];
        this.peoplesTarget[idx] = this.peoplesTarget[idx + 1];
        this.peoplesTarget[idx + 1] = temp;
      }
    }
  }
  productUp(g) {
    if (this.peoplesTarget.length > 1) {
      const idx = _.findIndex(this.peoplesTarget, { fullname: g.fullname });
      if (idx !== 0) {
        const temp = this.peoplesTarget[idx];
        this.peoplesTarget[idx] = this.peoplesTarget[idx - 1];
        this.peoplesTarget[idx - 1] = temp;
      }
    }
  }
  searchPeoples(event: any) {
    if (event.keyCode === 13) {
      this.peopleService.search(this.query)
        .then((results: any) => {
          this.peoplesSource = results.rows;
          this.peoplesSourceTemp = results.rows;
          this.ref.detectChanges();
        })
        .catch(error => {
          this.peoplesSource = [];
          this.peoplesSourceTemp = [];
          this.ref.detectChanges();
        });
    }
  }
}
