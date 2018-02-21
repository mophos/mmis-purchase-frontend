import { ProductService } from './../../share/product.service';
import { AlertService } from './../../../alert.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'orders-history',
  templateUrl: './orders-history.component.html',
  styleUrls: ['./orders-history.component.css']
})
export class OrdersHistoryComponent implements OnInit {

  loading:boolean;
  productsSelected: Array<any> = [];
  products: Array<any> = [];

  constructor(
    private alertService: AlertService,
    private productService: ProductService
  ) { }

  ngOnInit() {
  }

  getProductHistory(productId: string) {
    this.loading = true;
    this.productService.productHistory(productId)
      .then((results: any) => {
        this.products = results.rows;
        this.loading = false;
      })
      .catch(error => {
        this.alertService.serverError(error);
        this.loading = false;
      });
  }

}
