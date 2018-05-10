import { AuthHttp } from 'angular2-jwt';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class OfficerService {
  tokenKey = sessionStorage.getItem('token');

  apiName = 'purchasing-order';

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async findAll() {
    const response = await this.authHttp.get(`${this.url}/${this.apiName}/officers`).toPromise();
    return response.json();
  }

  async findAllByTypeId(id: number) {
    const response = await this.authHttp.get(`${this.url}/${this.apiName}/officers-by-officeid/${id}`).toPromise();
    return response.json();
  }
  async findPeople(id: number) {
    const response = await this.authHttp.get(`${this.url}/${this.apiName}/officers/${id}`).toPromise();
    return response.json();
  }
  getSetting() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/officer`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getSysSetting(actionName) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/officer/get-sys-setting`, {
        actionName: actionName
      })
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, error => {
          reject(error);
        });
    });
  }

  save(data: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/officer`, {
        data: data
      })
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, error => {
          reject(error);
        });
    });
  }

  saveSetting(varName, dataValue) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/officer/save-settings`, {
        varName: varName,
        dataValue: dataValue
      })
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, error => {
          reject(error);
        });
    });
  }

  // // PurchasingOfficer =====================================
  getPurchasingOfficerType() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/officer/getPurchasingOfficerType`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getPeoples() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/officer/getPeoples`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getPurchasingOfficer() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/officer/getPurchasingOfficer`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  savePurchasingOfficer(data) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/officer/savePurchasingOfficer`, {
        data: data
      })
        .map(res => res.json())
        .subscribe(datas => {
          resolve(datas);
        }, error => {
          reject(error);
        });
    });
  }

  updatePurchasingOfficer(officerId, data) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/officer/updatePurchasingOfficer`, {
        data: data,
        officerId: officerId
      })
        .map(res => res.json())
        .subscribe(datas => {
          resolve(datas);
        }, error => {
          reject(error);
        });
    });
  }

  deletePurchasingOfficer(officerId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/officer/${officerId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}
