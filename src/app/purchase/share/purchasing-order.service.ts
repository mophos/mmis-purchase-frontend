import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
// import { resolve } from 'path';
import { reject } from 'q';

@Injectable()
export class PurchasingOrderService {

  apiName = 'purchasing-order';

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  budgetsYear(year: string, budget_type_id: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/budgetyear/${year}/${budget_type_id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  ordercontract(status: string = null) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/ordercontract/${status}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getOrderList(genericTypeId: any, startDate: any, endDate: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/get-list-po?genericTypeId=${genericTypeId}&startDate=${startDate}&endDate=${endDate}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        })
    })
  }

  ordernocontracts() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/nocontracts`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  ordernocontractsByRequisition(id: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/nocontracts-by-requisition/${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  contracts() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/contracts`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  byStatus(status: Array<any>, contract = 'ALL', query: string = '', start_date: string = '',
    end_date: string = '', limit: number = 20, offset: number = 0, sort: any = {}) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/${this.apiName}/by-status`, {
        status: status,
        contract: contract,
        query: query,
        start_date: start_date,
        end_date: end_date,
        limit: limit,
        offset: offset,
        sort: sort
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getPOid(s_id: any, e_id: any, genericTypeId: any, statusFilter: any, yearPO: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/getpoId/${s_id}/${e_id}/${genericTypeId}/${statusFilter}/${yearPO}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getPrintDate(start_date: any, end_date: any, genericTypeId: any, statusFilter: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/getPrintDate/${start_date}/${end_date}/${genericTypeId}/${statusFilter}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getGenericTypes() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/getgenerictypes`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  detail(id: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/detail?id=${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  lastOrderByLebelerID(id: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/lastorder/${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async save(summary: any, items: any, budgetTransaction: any) {
    const rs: any = await this.authHttp.post(`${this.url}/${this.apiName}`, {
      items: items,
      budgetTransaction: budgetTransaction,
      summary: summary
    }).toPromise();
    return rs.json();
  }

  async update(purchaseOrderId: any, summary: any, items: any, budgetTransaction: any) {
    const rs: any = await this.authHttp.put(`${this.url}/${this.apiName}/${purchaseOrderId}`, {
      items: items,
      summary: summary,
      budgetTransaction: budgetTransaction
    }).toPromise();
    return rs.json();
  }

  async updateStatus(items: any) {
    const rs: any = await this.authHttp.put(`${this.url}/${this.apiName}/update-purchase/status`, { items: items }).toPromise();
    return rs.json();
  }

  async saveWithOrderPoint(poItems: any, productItems: any) {
    const rs: any = await this.authHttp.post(`${this.url}/${this.apiName}/purchase-reorder`, {
      poItems: poItems,
      productItems: productItems
    }).toPromise();
    return rs.json();
  }



  // update(id: string, data: object) {
  //   return new Promise((resolve, reject) => {
  //     this.authHttp.put(`${this.url}/${this.apiName}/${id}`, {data})
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         resolve(data);
  //       }, error => {
  //         reject(error);
  //       });
  //   });
  // }

  newponumber(id: string, data: object) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/${this.apiName}/newponumber/${id}`, { data })
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
      this.authHttp.delete(`${this.url}/${this.apiName}/${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  async getPurchaseCheckHoliday(date) {
    const res = await this.authHttp.get(`${this.url}/${this.apiName}/check-holiday?date=${date}`)
      .toPromise();
    return res.json();
  }
  async getPeriodStatus(date) {
    const res = await this.authHttp.get(`${this.url}/${this.apiName}/period/status?date=${date}`)
      .toPromise();
    return res.json();
  }

  async getGeneric(limit = 15, offset = 0, sort: any = {}) {
    const res = await this.authHttp.post(`${this.url}/${this.apiName}/getGeneric`, {
      limit: limit,
      offset: offset,
      sort: sort
    })
      .toPromise();
    return res.json();
  }

  async getGenericHistory(limit = 15, offset = 0, sort: any = {}) {
    const res = await this.authHttp.post(`${this.url}/${this.apiName}/generic/history`, {
      limit: limit,
      offset: offset,
      sort: sort
    })
      .toPromise();
    return res.json();
  }

  async getGenericSearch(limit = 15, offset = 0, query: any, sort: any) {
    const res = await this.authHttp.post(`${this.url}/${this.apiName}/getGeneric/search`, {
      limit: limit,
      offset: offset,
      query: query,
      sort: sort
    })
      .toPromise();
    return res.json();
  }

  async getGenericHistorySearch(limit = 15, offset = 0, query: any, sort: any) {
    const res = await this.authHttp.post(`${this.url}/${this.apiName}/generic/history/search`, {
      limit: limit,
      offset: offset,
      query: query,
      sort: sort
    })
      .toPromise();
    return res.json();
  }

  async getProductHistory(generic_id: any) {
    const res = await this.authHttp.get(`${this.url}/${this.apiName}/getProductHistory/${generic_id}`)
      .toPromise();
    return res.json();
  }

  async searchGenericHistory(key: any) {
    const res = await this.authHttp.get(`${this.url}/${this.apiName}/searchGenericHistory?key=${key}`)
      .toPromise();
    return res.json();
  }


  async checkApprove(username: any, password: any, action: any) {
    const rs: any = await this.authHttp.post(`${this.url}/${this.apiName}/checkApprove`, {
      username: username,
      password: password,
      action: action
    }).toPromise();
    return rs.json();
  }

  async saveChangePurchaseDate(purchaseOrderIds: any[], purchaseDate: any) {
    const res = await this.authHttp.post(`${this.url}/${this.apiName}/change-purchase-date`, {
      purchaseOrderIds: purchaseOrderIds,
      purchaseDate: purchaseDate
    })
      .toPromise();
    return res.json();
  }

  async sysReport() {
    const res = await this.authHttp.get(`${this.url}/${this.apiName}/sys-report`)
      .toPromise();
    return res.json();
  }

  async getPoBookNumber() {
    const res = await this.authHttp.get(`${this.url}/${this.apiName}/book-number`)
      .toPromise();
    return res.json();
  }

  async getContractId(productId: any) {
    const res = await this.authHttp.get(`${this.url}/${this.apiName}/view-contract?productId=${productId}`)
      .toPromise();
    return res.json();
  }
  async sendEDI(purchasingOrderId: any) {
    const res = await this.authHttp.post(`${this.url}/edi/create`, {
      purchasingOrderId: purchasingOrderId
    })
      .toPromise();
    return res.json();
  }
}
