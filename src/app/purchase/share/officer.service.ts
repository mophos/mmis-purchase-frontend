import { AuthHttp } from 'angular2-jwt';
import { Injectable,Inject } from '@angular/core';

@Injectable()
export class OfficerService {
  tokenKey = sessionStorage.getItem('token');

  apiName: string = 'purchasing-order';
  
    constructor(
      @Inject('API_URL') private url: String,
      private authHttp: AuthHttp
    ) { }
  
    async findAll() {
      const response = await this.authHttp.get(`${this.url}/${this.apiName}/officers`).toPromise();
      return response.json();
    }
  
    async findAllByTypeId(id:number) {
      const response = await this.authHttp.get(`${this.url}/${this.apiName}/officers-by-officeid/${id}`).toPromise();
      return response.json();
    }
    async findPeople(id:number) {
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
    selectData(tableName, selectText, whereText, groupBy, orderText) {
      return new Promise((resolve, reject) => {
        this.authHttp.post(`${this.url}/officer/selectData`, {
          tableName: tableName,
          selectText: selectText,
          whereText: whereText,
          groupBy: groupBy,
          orderText: orderText,
          tokenKey: this.tokenKey
        } )
          .map(res => res.json())
          .subscribe(data => {
            resolve(data);
          }, error => {
            reject(error);
          });
      });
    }
  
    getPurchasingOfficer(ref) {
      return new Promise((resolve, reject) => {
        this.authHttp.post(`${this.url}/officer/getPurchasingOfficer`, {
          tokenKey: this.tokenKey,
          ref: ref
        } )
          .map(res => res.json())
          .subscribe(data => {
            resolve(data);
          }, error => {
            reject(error);
          });
      });
    }
  
    savePurchasingOfficer(ref, formInput) {
      return new Promise((resolve, reject) => {
        this.authHttp.post(`${this.url}/officer/savePurchasingOfficer`, {
          tokenKey: this.tokenKey,
          ref: ref,
          data: formInput,
        } )
          .map(res => res.json())
          .subscribe(data => {
            resolve(data);
          }, error => {
            reject(error);
          });
      });
    }
  
    deletePurchasingOfficer(ref) {
      return new Promise((resolve, reject) => {
        this.authHttp.post(`${this.url}/officer/deletePurchasingOfficer`, {
          tokenKey: this.tokenKey,
          ref: ref
        } )
          .map(res => res.json())
          .subscribe(data => {
            resolve(data);
          }, error => {
            reject(error);
          });
      });
    }
  
  // type bid =====================================
    // deleteTypeBid(ref) {
    //   return new Promise((resolve, reject) => {
    //     this.authHttp.post(`${this.url}/delete-type-bid`, {
    //       tokenKey: this.tokenKey,
    //       ref: ref
    //     } )
    //       .map(res => res.json())
    //       .subscribe(data => {
    //         resolve(data);
    //       }, error => {
    //         reject(error);
    //       });
    //   });
    // }
  
    // saveBidProcess(ref, data) {
    //   return new Promise((resolve, reject) => {
    //     this.authHttp.post(`${this.url}/save-bid-process`, {
    //       tokenKey: this.tokenKey,
    //       data: data,
    //       ref: ref
    //     } )
    //       .map(res => res.json())
    //       .subscribe(res => {
    //         resolve(res);
    //       }, error => {
    //         reject(error);
    //       });
    //   });
    // }
  
    // deleteBidProcess(ref) {
    //   return new Promise((resolve, reject) => {
    //     this.authHttp.post(`${this.url}/delete-bid-process`, {
    //       tokenKey: this.tokenKey,
    //       ref: ref
    //     } )
    //       .map(res => res.json())
    //       .subscribe(data => {
    //         resolve(data);
    //       }, error => {
    //         reject(error);
    //       });
    //   });
    // }
  
    // saveTypeBid(ref, data) {
    //   return new Promise((resolve, reject) => {
    //     this.authHttp.post(`${this.url}/save-type-bid`, {
    //       tokenKey: this.tokenKey,
    //       data: data,
    //       ref: ref
    //     } )
    //       .map(res => res.json())
    //       .subscribe(res => {
    //         resolve(res);
    //       }, error => {
    //         reject(error);
    //       });
    //   });
    // }
}
