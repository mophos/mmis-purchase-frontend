import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BudgetTransectionService {

  constructor(
    @Inject('API_URL') private url: String,
    private authHttp: AuthHttp
  ) { }

  async all() {
    const res = await this.authHttp.get(`${this.url}/budget-transection`)
      .toPromise();
    return res.json();
  }

  async getCancel(pid: any) {
    const res = await this.authHttp.get(`${this.url}/budget-transection/diff/${pid}`)
      .toPromise();
    return res.json();
  }

  detailActive(id: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/budget-transection/detail-active/${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  detail(id: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/budget-transection/detail/${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  
  async getHistory(budgetDetailId: string) {
    let rs: any = await this.authHttp.get(`${this.url}/budget-transection/history/${budgetDetailId}`).toPromise();
    return rs.json();
  }
  
  async getBudgetPurchase(purchaseOrderId: string) {
    let rs: any = await this.authHttp.get(`${this.url}/budget-transection/purchase-detail/${purchaseOrderId}`).toPromise();
    return rs.json();
  }

  async getBudgetTransection(budgetDetailId: any) {
    const res = await this.authHttp.get(`${this.url}/budget-transection/transaction/${budgetDetailId}`)
      .toPromise();
    return res.json();
  }

  async getBudgetTransectionBalance(budgetDetailId: any, purchaseOrderId: any) {
    const res = await this.authHttp.post(`${this.url}/budget-transection/transaction/balance`, {
      purchaseOrderId: purchaseOrderId,
      budgetDetailId: budgetDetailId
    })
      .toPromise();
    return res.json();
  }

  async getPoTransection(pid: any) {
    const res = await this.authHttp.get(`${this.url}/budget-transection/transaction/${pid}`)
      .toPromise();
    return res.json();
  }

}
