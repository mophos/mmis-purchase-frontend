import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class StandardService {

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private authHttp: AuthHttp
  ) { }

  async getGenericUnits(genericId: any) {
    const url: any = `${this.apiUrl}/std/generic-units/${genericId}`;
    const rs: any = await this.authHttp.get(url).toPromise();
    return rs.json();
  }

  async getBidType() {
    const url: any = `${this.apiUrl}/std/bid-types`;
    const rs: any = await this.authHttp.get(url).toPromise();
    return rs.json();
  }

  async getBudgetType() {
    const url: any = `${this.apiUrl}/std/budget-types`;
    const rs: any = await this.authHttp.get(url).toPromise();
    return rs.json();
  }

  async getBidProcess() {
    const url: any = `${this.apiUrl}/std/bid-process`;
    const rs: any = await this.authHttp.get(url).toPromise();
    return rs.json();
  }

  async getBudgetSub(budgetTypeId: string, year: string) {
    const url: any = `${this.apiUrl}/std/budget-year/${budgetTypeId}/${year}`;
    const rs: any = await this.authHttp.get(url).toPromise();
    return rs.json();
  }

}
