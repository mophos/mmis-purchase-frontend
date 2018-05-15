import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductService {

  apiName = 'products';

  constructor(
    @Inject('API_URL') private url: String,
    private authHttp: AuthHttp
  ) { }

  async getUnitConversion(productId: any) {
    const res = await this.authHttp.get(`${this.url}/products/unit-conversion/${productId}`)
      .toPromise();
    return res.json();
  }

  async getReorderPointGeneric(genericTypeId: any, limit: number = 20, offset: number = 0, query: any = '', showNotPurchased: any = 'N', sort: any = {}) {
    const res = await this.authHttp.post(`${this.url}/products/reorderpoint/generic`, {
      genericTypeId: genericTypeId,
      limit: limit,
      offset: offset,
      query: query,
      showNotPurchased: showNotPurchased,
      sort: sort
    }).toPromise();
    return res.json();
  }

  async getReorderPointTradeReserved(genericTypeId: any, limit: number = 20, offset: number = 0, query: any = '', sort: any) {
    const res = await this.authHttp.post(`${this.url}/products/reorderpoint/trade/reserved`, {
      genericTypeId: genericTypeId,
      limit: limit,
      offset: offset,
      query: query,
      sort: sort
    }).toPromise();
    return res.json();
  }

  async getReorderPointTradeReservedForOrdered() {
    const res = await this.authHttp.get(`${this.url}/products/reorderpoint/trade/reserved/confirmed`).toPromise();
    return res.json();
  }

  async updateTradeReserved(items: any[]) {
    const res = await this.authHttp.put(`${this.url}/products/reorderpoint/trade/reserved-update`, {
      items: items
    }).toPromise();
    return res.json();
  }

  async saveReservedProducts(items: any[]) {
    const res = await this.authHttp.post(`${this.url}/products/save-reserved`, {
      items: items
    }).toPromise();
    return res.json();
  }

  async removeReservedProducts(reserveId: any) {
    const res = await this.authHttp.delete(`${this.url}/products/remove-reserved/${reserveId}`).toPromise();
    return res.json();
  }

  async getProductsListByGeneric(genericId: any) {
    const res = await this.authHttp.get(`${this.url}/products/orderspoint/product-list-by-generic/${genericId}`)
      .toPromise();
    return res.json();
  }

  async ordersPoint(q: string = '', contractFilter = 'all', genericType: any, limit: number = 50, offset: number = 0) {
    const res = await this.authHttp.post(`${this.url}/${this.apiName}/orderspoint`, {
      limit,
      offset,
      q: q,
      contract: contractFilter,
      generictype: genericType,

    }).toPromise();
    return res.json();
  }

  productHistory(productId) {
    return new Promise((resolve, reject) => {
      const url = `${this.url}/purchasing-orderitem/product-history/${productId}`;
      this.authHttp.get(url)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  all(type: string = 'all') {
    return new Promise((resolve, reject) => {
      const url = type === 'all' ? `${this.url}/${this.apiName}` : `${this.url}/${this.apiName}/type/${type}`;
      this.authHttp.get(url)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  allByPlaning(year: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/byplaning/${year}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  products() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/products`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  productsByLabeler(labelerId: string, query: string = '') {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/${this.apiName}/productsbylabeler/${labelerId}`, {
        q: query
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  allProduct() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/allproduct`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  byContract() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/bycontract`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  withoutContract() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/withoutcontract`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  type(types) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/${this.apiName}/types`, {
        types: types
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}
