import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise'

@Injectable()
export class ReceiveService {

  constructor(
    @Inject('API_URL') private url: String,
    private authHttp: AuthHttp
  ) { }

  async getReceives(purchaseOrderId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/purchasing-order/get-receives/${purchaseOrderId}`)
      .toPromise();
    return rs.json();
  }

  async getReceiveItems(receiveId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/purchasing-order/get-receives-items/${receiveId}`)
      .toPromise();
    return rs.json();
  }

}
