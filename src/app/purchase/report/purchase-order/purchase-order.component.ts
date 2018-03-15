import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ProductService } from '../../share/product.service';
import { log } from 'util';
import { decode } from 'punycode';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

  isPreview: boolean = false;

  @Output('onClickSearch') onClickSearch: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('htmlPreview') public htmlPreview: any;

  generic_type_id: string;

  productType: Array<any> = [];

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  };

  constructor(
    private productService: ProductService,
    @Inject('API_URL') private apiUrl: any) {

  }
  public jwtHelper: JwtHelper = new JwtHelper();

  ngOnInit() {
    this.getProductType();
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
    const that = this;
    setTimeout(() => {
      that.isPreview = false;
    }, 2000);

    // const token = sessionStorage.getItem('token');
    // const url = `${this.apiUrl}/report/list/purchaseSelec/?generic_type_id=${this.generic_type_id}/${token}`;
    
    const url = `${this.apiUrl}/report/list/purchaseSelec/?generic_type_id=${this.generic_type_id}`;

    this.htmlPreview.showReport(url);
  }

  async getProductType() {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    const productGroup = decodedToken.generic_type_id.split(',');
    console.log(productGroup);
    const rs: any = await this.productService.type(productGroup);
    console.log(rs.rows);
    this.productType = rs.rows;
    this.generic_type_id = '';
  }
}

