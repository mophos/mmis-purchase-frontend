import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
@Injectable()
export class CommitteeService {

  apiName: string = 'committee';

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
  
  allbid() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/bid`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  
  listbidtype() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/listbidtype`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removecommitteebid(id) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/${this.apiName}/removecommitteebid?id=${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  updatecommitteebid(id, bid_id) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/${this.apiName}/updatecommitteebid`, { id: id, bid_id: bid_id })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  active() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/active`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  one(id: number) {
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

  save(data: object) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/${this.apiName}`, { data })
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
      this.authHttp.put(`${this.url}/${this.apiName}/${id}`, { data })
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

  getCommittee(bidId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/${this.apiName}/getcommittee/${bidId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}