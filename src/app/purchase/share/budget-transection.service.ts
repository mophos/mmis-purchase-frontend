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
  
  async getDetail(id: number, year: any) {
    let rs: any = await this.authHttp.get(`${this.url}/budget-transection/get-detail/${id}/${year}`).toPromise();
    return rs.json();
  }

  save(data: object) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/budget-transection`, { data })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getBudgetTransection(budgetYear: any, budgetDetailId: any) {
    const res = await this.authHttp.get(`${this.url}/budget-transection/transaction/${budgetYear}/${budgetDetailId}`)
      .toPromise();
    return res.json();
  }

  async getPoTransection(pid: any) {
    const res = await this.authHttp.get(`${this.url}/budget-transection/transaction/${pid}`)
      .toPromise();
    return res.json();
  }

  update(id: string, data: object) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/budget-transection/${id}`, { data })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  cancel(id: string, data: object) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/budget-transection/cancel/${id}`, { data })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(id: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/budget-transection/${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


}
