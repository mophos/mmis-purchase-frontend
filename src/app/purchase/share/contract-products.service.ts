import { Injectable,Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
@Injectable()
export class ContractProductsService {

  apiName: string = 'contract-product';

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

}
