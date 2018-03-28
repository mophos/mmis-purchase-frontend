import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyDateModel } from 'mydatepicker-th';
import * as moment from 'moment';
import { HtmlPreviewComponent } from 'app/helper/html-preview/html-preview.component';
import { ModalLoadingComponent } from 'app/modal-loading/modal-loading.component';
import { ProductService } from 'app/purchase/share/product.service';
import { JwtHelper } from 'angular2-jwt';
import { AlertService } from 'app/alert.service';
import { State } from '@clr/angular';
@Component({
  selector: 'po-order-point',
  templateUrl: './order-point.component.html',
  styles: []
})
export class OrderPointComponent implements OnInit {

  @ViewChild('htmlPreview') public htmlPreview: HtmlPreviewComponent;
  @ViewChild('modalLoading') modalLoading: ModalLoadingComponent

  isPreview: boolean = false;

  products: any = [];
  prepareItems: any = [];
  selectedProduct: any = [];
  selectedPrepare: any = [];
  printProducts: any = [];
  generic_type_id = 'all';
  productGroup: any;
  productType: Array<any> = [];

  token: any;
  perPage: number = 20;
  total: number = 0;
  query: any = '';

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: any) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.productGroup = decodedToken.generic_type_id.split(',');
  }

  public jwtHelper: JwtHelper = new JwtHelper();

  ngOnInit() {
    this.getProductType();
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

  changeType() {
    this.getProducts(this.perPage);
  }

  async getProducts(limit: number = 20, offset: number = 0) {
    try {
      this.modalLoading.show();
      let rs: any;
      if (this.generic_type_id === 'all') {
        rs = await this.productService.getReorderPointTrade(this.productGroup, limit, offset, this.query);
      } else {
        let genericIds: any = [];
        genericIds.push(this.generic_type_id);
        rs = await this.productService.getReorderPointTrade(genericIds, limit, offset, this.query);
      }
      this.modalLoading.hide();
      if (rs.ok) {
        this.products = rs.rows;
        this.total = rs.total || 0;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getProductType() {
    try {
      // this.modalLoading.show();
      const rs: any = await this.productService.type(this.productGroup);
      if (rs.ok) {
        this.productType = rs.rows;
        await this.getProducts();
      } else {
        // this.modalLoading.hide();
        this.alertService.error(rs.error);
      }

    } catch (error) {
      // this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  refresh(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;

    this.getProducts(limit, offset);
  }

  doSearch(event: any) {
    if (event.keyCode === 13) {
      this.getProducts();
    }
  }

  async saveReserved() {
    if (this.selectedProduct.length) {
      try {
        let items: any = [];
        this.selectedProduct.forEach(v => {
          let obj: any = {};
          obj.product_id = v.product_id;
          obj.generic_id = v.generic_id;
          items.push(obj);
        });

        this.modalLoading.show();
        let rs: any = await this.productService.saveReservedProducts(items);
        if (rs.ok) {
          this.alertService.success();
          this.getProducts();
        } else {
          this.alertService.error(rs.error);
        }
        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        console.log(error);
        this.alertService.error(error);
      }
    } else {
      this.alertService.error('กรุณาเลือกรายการที่ต้องการ')
    }
  }

}
