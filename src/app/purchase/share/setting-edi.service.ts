import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class SettingEdiService {

  constructor(
    @Inject('API_URL') private url: String,
    private authHttp: AuthHttp
  ) { }

  async getSetting(actionName: any) {
    const response = await this.authHttp.get(`${this.url}/edi/settings?actionName=${actionName}`).toPromise();
    return response.json();
  }

  async saveSetting(value: any) {
    const response = await this.authHttp.post(`${this.url}/edi/settings`, {
      value: value
    }).toPromise();
    return response.json();
  }

}
