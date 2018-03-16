import { Component, OnInit, Input, Output, EventEmitter, ViewChild,Inject } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.css']
})
export class PrintFormComponent implements OnInit {

  startDate: any;
  endDate: any;
  isPreview: boolean = false;
  token: any;
  @Output('onClickSearch') onClickSearch: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('htmlPreview') public htmlPreview: any;
  @Inject('API_URL') private apiUrl: any;
  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  };

  constructor() { 
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    const date = new Date();

    this.startDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 1
      }
    };
    this.endDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    // console.log(this.start_date,this.end_date);

  }

  onDateStartChanged(event: IMyDateModel) {
    const selectDate: any = moment(event.jsdate).format('YYYY-MM-DD');
    if (selectDate !== 'Invalid date') {
      //this._start_date = selectDate;
    } else {

    }
  }
  onDateEndChanged(event: IMyDateModel) {
    const selectDate: any = moment(event.jsdate).format('YYYY-MM-DD');
    if (selectDate !== 'Invalid date') {
      //this._end_date = selectDate;
    } else {

    }
  }

  print() {
    // this.onClickSearch.emit({
    //   start_date: `${this.start_date.date.year}-${this.start_date.date.month}-${this.start_date.date.day}`,
    //   end_date: `${this.end_date.date.year}-${this.end_date.date.month}-${this.end_date.date.day}`,
    // });
  }
  showReport() {
    this.isPreview = true;
    // this.startDate = {
    //   date: {
    //     year: date.getFullYear(),
    //     month: date.getMonth() + 1,
    //     day: 1
    //   }
    // };
    // this.endtDate = {
    //   date: {
    //     year: date.getFullYear(),
    //     month: date.getMonth() + 1,
    //     day: date.getDate()
    //   }
    // };

    // console.log(this.startDate, this.endDate);
    const that = this;

    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    console.log(startDate, endDate);
    // setTimeout(() => {
    //   that.isPreview = false;
    // }, 5000);

    const url = `${this.apiUrl}/report/list/purchase/${startDate}/${endDate}?token=${this.token}`;
    console.log(url);
     this.htmlPreview.showReport(url);
  }
}
