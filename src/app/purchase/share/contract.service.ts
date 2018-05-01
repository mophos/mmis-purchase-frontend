import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
@Injectable()
export class ContractService {

  apiName: string = 'contracts';

  constructor(
    @Inject('API_URL') private url: String,
    private authHttp: AuthHttp
  ) { }

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

  allGroupContractID() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/group-contractid`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  allActive() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/allactive`)
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
      this.authHttp.get(`${this.url}/${this.apiName}/detail/${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remainDetail(id: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/detail-contract?contractId=${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(data: object) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/${this.apiName}`, {data})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(id: string, data: object) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/${this.apiName}/${id}`, {data})
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


}
