import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ProductService } from '../../share/product.service';
import { log } from 'util';
import { decode } from 'punycode';
import { AlertService } from 'app/alert.service';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { HtmlPreviewComponent } from 'app/helper/html-preview/html-preview.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

  isPreview: boolean = false;

  products: any = [];
  selectedProduct: any = [];
  printProducts: any = [];

  @ViewChild('htmlPreview') public htmlPreview: HtmlPreviewComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent

  generic_type_id: string;

  productType: Array<any> = [];

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  };
  token: any;
  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: any) {
      this.token = sessionStorage.getItem('token');
  }

  public jwtHelper: JwtHelper = new JwtHelper();

  ngOnInit() {
    // this.getProductType();
    this.getProducts();
  }

  printProduct() {
    this.selectedProduct.forEach(v => {
      this.printProducts.push(v.product_id);
    });

    let productIds = '';
    this.printProducts.forEach((v: any) => {
      productIds += `product_id=${v}&`;
    });

    const url = `${this.apiUrl}/report/list/purchase-trade-select/?token=${this.token}&${productIds}`;
    this.htmlPreview.showReport(url);

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

  async getProducts() {
    try {
      this.modalLoading.show();
      let rs: any = await this.productService.getReorderPointTrade(this.generic_type_id);
      this.modalLoading.hide();
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  // async getProductType() {
  //   const token = sessionStorage.getItem('token');
  //   const decodedToken = this.jwtHelper.decodeToken(token);
  //   const productGroup = decodedToken.generic_type_id.split(',');
  //   try {
  //     const rs: any = await this.productService.type(productGroup);
  //     if (rs.ok) {
  //       this.productType = rs.rows;
  //       if (rs.rows.length) this.generic_type_id = this.productType[0].generic_type_id;
  //     } else {
  //       this.alertService.error(rs.error);
  //     }
     
  //   } catch (error) {
  //     this.alertService.error(error.message);
  //   }
  // }
}

