import { State } from '@clr/angular';
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

  isPreview = false;
  sort: any = {};
  products: any = [];
  selectedProduct: any = [];
  printProducts: any = [];

  @ViewChild('htmlPreview') public htmlPreview: HtmlPreviewComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent

  showNotPurchased = false;

  generic_type_id = 'all';
  productGroup: any;
  productType: Array<any> = [];

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
  };

  perPage = 10;
  totalProduct: any;
  public jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: any) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.productGroup = decodedToken.generic_type_id.split(',');
  }
  ngOnInit() {
    this.getProductType();
    // await this.getProducts();
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

    this.printProducts = [];
  }

  onDateStartChanged(event: IMyDateModel) {
    const selectDate: any = moment(event.jsdate).format('YYYY-MM-DD');
    if (selectDate !== 'Invalid date') {
      // this._start_date = selectDate;
    } else {

    }
  }

  onDateEndChanged(event: IMyDateModel) {
    const selectDate: any = moment(event.jsdate).format('YYYY-MM-DD');
    if (selectDate !== 'Invalid date') {
      // this._end_date = selectDate;
    } else {

    }
  }

  changeType() {
    this.getProducts();
  }

  async getProducts(limit: number = 20, offset: number = 0, sort: any = {}) {
    try {
      this.modalLoading.show();
      let rs: any;
      let showNotPurchased = this.showNotPurchased ? 'Y' : 'N';

      if (this.generic_type_id === 'all') {
        rs = await this.productService.getReorderPointTrade(this.productGroup, limit, offset, '', showNotPurchased, sort);
      } else {
        const _generic_type_id = [this.generic_type_id];
        rs = await this.productService.getReorderPointTrade(_generic_type_id, limit, offset, '', showNotPurchased, sort);
      }
      if (rs.ok) {
        this.products = rs.rows;
        this.totalProduct = rs.total;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async refresh(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;
    this.sort = state.sort;

    this.getProducts(limit, offset, this.sort);

  }

  async getProductType() {
    try {
      this.modalLoading.show();
      const rs: any = await this.productService.type(this.productGroup);
      if (rs.ok) {
        this.productType = rs.rows;
      } else {
        this.modalLoading.hide();
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  onChangePurchaseStatus() {
    this.getProducts();
  }

}

