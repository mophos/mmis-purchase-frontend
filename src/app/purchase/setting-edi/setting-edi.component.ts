import { AlertService } from 'app/alert.service';
import { Component, OnInit } from '@angular/core';
import { SettingEdiService } from '../share/setting-edi.service';

@Component({
  selector: 'po-setting-edi',
  templateUrl: './setting-edi.component.html',
  styles: []
})
export class SettingEdiComponent implements OnInit {

  tokenEDI: any;
  constructor(
    private settingEdiService: SettingEdiService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getToKen();
  }

  async getToKen() {
    try {
      const rs = await this.settingEdiService.getSetting('TOKEN');
      if (rs.ok) {
        this.tokenEDI = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.serverError(error);
    }
  }


  async saveSetting() {
    try {
      const arr = [{
        'action_name': 'TOKEN',
        'value': this.tokenEDI
      }];
      await this.settingEdiService.saveSetting(arr);
      this.alertService.success();
    } catch (error) {
      this.alertService.serverError(error);
    }
  }
}
