import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UnitsService {

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private authHttp: AuthHttp
  ) { }

  async getGenericUnits(genericId: any) {
    const url: any = `${this.apiUrl}/basic/units/generic-units/${genericId}`;
    const rs: any = await this.authHttp.get(url).toPromise();
    return rs.json();
  }
}
