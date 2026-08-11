import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('LOGIN_URL') private loginUrl: string,
    private http: Http) { }

  doLogin(username: string, password: string, userWarehouseId) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.loginUrl}/login`, { username: username, password: password, userWarehouseId: userWarehouseId, supportLoginSteps: true }, { withCredentials: true })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  searchWarehouse(username: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.loginUrl}/login/warehouse/search?username=${username}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  testLogin(username: string, password: string) {
    return new Promise((resolve, reject) => {
      if (username === 'admin' && password === 'admin') {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0OTIxNTIxNTAsImV4cCI6MTUyMzY4ODE1MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImZpcnN0bmFtZSI6IkpvaG5ueSIsImxhc3RuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.PHIh0fVzpbTqi8h74stfts_CqgEmku-j0NV5G1iS0BI'
        resolve(token);
      } else {
        reject('Invalid username/password');
      }
    });
  }

  /**
   * ขั้นตอนหลังตรวจรหัสผ่านทุกตัวใช้ preAuthToken แทน token จริง
   * preAuthToken มีอายุ 15 นาที และใช้เรียก API อื่นของระบบไม่ได้
   */
  private postWithPreAuth(path: string, preAuthToken: string, body: any = {}) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${preAuthToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${this.loginUrl}${path}`, body, { headers: headers, withCredentials: true })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  changePassword(preAuthToken: string, password: string, confirmPassword: string) {
    return this.postWithPreAuth('/login/change-password', preAuthToken, {
      password: password,
      confirmPassword: confirmPassword
    });
  }

  setup2fa(preAuthToken: string) {
    return this.postWithPreAuth('/login/2fa/setup', preAuthToken);
  }

  confirm2fa(preAuthToken: string, code: string, rememberDevice: boolean) {
    return this.postWithPreAuth('/login/2fa/confirm', preAuthToken, {
      code: code,
      rememberDevice: rememberDevice === true
    });
  }

  verify2fa(preAuthToken: string, code: string, rememberDevice: boolean) {
    return this.postWithPreAuth('/login/2fa/verify', preAuthToken, {
      code: code,
      rememberDevice: rememberDevice === true
    });
  }
}
