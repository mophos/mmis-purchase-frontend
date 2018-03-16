import { ActivatedRoute, Params } from '@angular/router';
import { Component, AfterViewInit, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Inject, Optional, Renderer } from '@angular/core';
import { HtmlPreviewComponent } from 'app/helper/html-preview/html-preview.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import * as _ from 'lodash';


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  @ViewChild('print') printPreview: HtmlPreviewComponent;
  @ViewChild('iframe') iframe: ElementRef;

  id: string;
  reportURL: SafeUrl;
  options: any;
  reports: Array<any> = [];
  start_date: any;
  end_date: any;
  reportName: string;
  report: any;
  token: any;
  constructor(
    private santizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    @Inject('API_URL') public url: String,
  ) {
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {

    this.showReport('');


    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.id  = params['id'] || null;
        if(this.id === null) {

        } else {
          this.showReport('');
          this.getActiveReports(this.id);
        }
    });
  }

  getActiveReports(id: string){
    this.reports = [
      {'id': '01', 'name': 'รายการสั่งซื้อยา', 'url': this.url + `/report/list/purchase/${this.start_date}/${this.end_date}?token=${this.token}`},
      {'id': '02', 'name': 'รายการเวชภัณฑ์ที่สั่งซื้อ', 'url': this.url + `/report/purchasing/${this.start_date}/${this.end_date}?token=${this.token}`}
    ];
    this.report = _.find(this.reports, {'id': this.id});
    if(this.report){
      this.reportName = this.report.name;
    }
  }

  showReport(url: any) {
    this.reportURL = this.santizer.bypassSecurityTrustResourceUrl(url);
  }

  getReport(){
    if(this.report){
      this.showReport(this.report.url);
    }
  }

  onClickSearch(e){
    this.start_date = e.start_date;
    this.end_date = e.end_date;
    this.showReport('');
    this.getActiveReports(this.id);
    this.getReport();
  }

}
